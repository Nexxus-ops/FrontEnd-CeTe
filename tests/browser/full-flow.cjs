const { chromium } = require('playwright');
const { randomUUID, randomBytes } = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const api = process.env.CETE_API_URL || 'http://127.0.0.1:5080/api/v1';
const appUrl = process.env.CETE_WEB_URL || 'http://127.0.0.1:5173/FrontEnd-CeTe/';
const output = path.join(process.cwd(), 'test-results', 'browser');
fs.mkdirSync(output, { recursive: true });
(async () => {
  const password = randomBytes(18).toString('hex');
  const email = `browser-${randomUUID()}@example.invalid`;
  const browser = await chromium.launch({ ...(process.env.CETE_BROWSER_CHANNEL || process.platform === 'win32' ? {channel:process.env.CETE_BROWSER_CHANNEL || 'msedge'} : {}), headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  const failures = [];
  const expectedFailures=new Set();
  page.on('pageerror', error => failures.push(error.message));
  page.on('requestfailed', req=>{if(new URL(req.url()).pathname.startsWith(new URL(api).pathname+'/'))failures.push(req.method()+' '+req.url()+': '+req.failure()?.errorText)});
  page.on('response', res=>{if(new URL(res.url()).pathname.startsWith(new URL(api).pathname+'/')&&res.status()>=400&&!expectedFailures.has(res.request().method()+' '+new URL(res.url()).pathname+' '+res.status()))failures.push(res.status()+' '+res.url())});
  try {
    page.setDefaultNavigationTimeout(90000);
    await page.goto(appUrl + '#/iam/sign-up');
    await page.getByLabel('Company name', { exact: true }).fill('CeTe demonstration');
    await page.getByLabel('RUC', { exact: true }).fill('20' + String(Math.floor(Math.random() * 1e9)).padStart(9, '0'));
    await page.getByLabel('Business address', { exact: true }).fill('Av. Universitaria 1801, Lima');
    await page.getByLabel('Company Email', { exact: true }).fill(email);
    await page.getByLabel('Password', { exact: true }).fill(password);
    await page.getByLabel('Confirm Password', { exact: true }).fill(password);
    await page.getByRole('button', { name: 'Register SMB', exact: true }).click();
    await page.waitForURL('**/iam/sign-in');
    await page.getByLabel('Email or Username', { exact: true }).fill(email);
    await page.getByLabel('Password', { exact: true }).fill(password);
    await page.locator('form').getByRole('button', { name: 'Sign In', exact: true }).click();
    await page.waitForURL('**/home');
    await page.getByText('Revenue today', { exact: true }).waitFor();
    if (await page.locator('#p-license-host').count()) throw new Error('Unexpected component license banner');
    const token = await page.evaluate(() => sessionStorage.getItem('cete.token'));
    async function request(method, url, body) {
      const response = await fetch(api + url, { method, headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token }, body: body ? JSON.stringify(body) : undefined });
      if (!response.ok) throw new Error(`${method} ${url}: ${response.status}`);
      return response.status === 204 ? null : response.json();
    }
    for (const item of [{ sku: 'CAF-001', name: 'Coffee 250 g', unitPrice: 18.5 }, { sku: 'ARR-001', name: 'Rice 1 kg', unitPrice: 5.9 }, { sku: 'ACE-001', name: 'Cooking oil 1 L', unitPrice: 9.5 }]) {
      const product = await request('POST', '/inventory', { ...item, quantity: 0 });
      await request('POST', '/inventory/' + product.id + '/entries', { quantity: 25, reason: 'Demonstration opening receipt' });
    }

    // Exercise the complete catalogue UI, including a rejected duplicate.
    await page.goto(appUrl + '#/inventory/new');
    await page.getByLabel('SKU Code', {exact:true}).fill('UI-ZERO');
    await page.getByLabel('Product Name', {exact:true}).fill('UI product');
    await page.getByLabel('Unit Price', {exact:true}).fill('4.50');
    await page.getByLabel('Unit Price', {exact:true}).press('Tab');
    const productCreated=page.waitForResponse(r=>new URL(r.url()).pathname===new URL(api).pathname+'/inventory' && r.request().method()==='POST' && r.status()===200);
    await page.getByRole('button',{name:'Save',exact:true}).click();
    const uiProduct=await(await productCreated).json();
    await page.waitForURL('**/inventory');
    await page.getByRole('row').filter({hasText:'UI-ZERO'}).getByRole('button',{name:'Edit product',exact:true}).click();
    await page.getByLabel('Product Name',{exact:true}).fill('UI product revised');
    await page.getByLabel('Unit Price',{exact:true}).fill('6.25');
    await page.getByLabel('Unit Price',{exact:true}).press('Tab');
    await page.getByRole('button',{name:'Save',exact:true}).click();
    await page.waitForURL('**/inventory');
    await page.getByRole('cell',{name:'UI product revised',exact:true}).waitFor();
    expectedFailures.add('POST '+new URL(api).pathname+'/inventory 409');
    await page.goto(appUrl + '#/inventory/new');
    await page.getByLabel('SKU Code',{exact:true}).fill('UI-ZERO');
    await page.getByLabel('Product Name',{exact:true}).fill('Duplicate product');
    await page.getByRole('button',{name:'Save',exact:true}).click();
    await page.getByRole('alert').filter({hasText:/SKU/i}).waitFor();
    await page.getByRole('button',{name:'Cancel',exact:true}).click();
    await page.waitForURL('**/inventory');
    await page.getByRole('row').filter({hasText:'UI-ZERO'}).getByRole('button',{name:'Archive product with zero stock',exact:true}).click();
    await page.getByRole('alertdialog').getByRole('button',{name:'Archive product',exact:true}).click();
    await page.getByRole('row').filter({hasText:'UI-ZERO'}).waitFor({state:'hidden'});
    if((await request('GET','/inventory')).some(p=>p.id===uiProduct.id))throw Error('Archived product remains active');
    // Exercise stock entries and exits using the form and verify persisted quantity.
    const coffee=(await request('GET','/inventory')).find(p=>p.sku==='CAF-001');
    await page.goto(appUrl+'#/inventory/'+coffee.id+'/movements');
    await page.getByLabel('Quantity',{exact:true}).fill('2');
    await page.getByLabel('Reason',{exact:true}).fill('UI stock entry');
    await page.getByRole('button',{name:'Save',exact:true}).click();
    await page.getByRole('cell',{name:'UI stock entry',exact:true}).waitFor();
    await page.getByLabel('Movement type',{exact:true}).selectOption('exits');
    await page.getByLabel('Quantity',{exact:true}).fill('1');
    await page.getByLabel('Reason',{exact:true}).fill('UI stock exit');
    await page.getByRole('button',{name:'Save',exact:true}).click();
    await page.getByRole('cell',{name:'UI stock exit',exact:true}).waitFor();
    if((await request('GET','/inventory')).find(p=>p.id===coffee.id).quantity!==26)throw Error('Movement form did not persist the expected stock');
    // Create a real warehouse account through the team form.
    const workerEmail='worker-'+randomUUID()+'@example.invalid';
    await page.goto(appUrl+'#/team');
    await page.getByLabel('Company Email',{exact:true}).fill(workerEmail);
    await page.getByLabel('Password',{exact:true}).fill(password);
    await page.getByLabel('Operational role',{exact:true}).selectOption('Warehouse');
    await page.getByRole('button',{name:'Create employee',exact:true}).click();
    await page.getByText(workerEmail,{exact:true}).waitFor();

    await page.goto(appUrl + '#/purchases');
    await page.getByLabel('Supplier', {exact:true}).fill('Demonstration supplier');
    await page.getByLabel('Product Name', {exact:true}).selectOption({label:'CAF-001 · Coffee 250 g'});
    await page.getByLabel('Quantity', {exact:true}).fill('2');
    await page.getByLabel('Unit cost (PEN)', {exact:true}).fill('12');
    await page.getByRole('button', {name:'Create purchase order',exact:true}).click();
    await page.getByRole('cell', {name:'Demonstration supplier',exact:true}).waitFor();
    await page.getByLabel('Quantity to receive', {exact:true}).fill('1');
    await page.getByRole('button', {name:'Receive goods',exact:true}).click();
    await page.getByRole('cell', {name:'1 / 2',exact:true}).waitFor();
    await page.getByRole('button', {name:'Receive goods',exact:true}).click();
    await page.getByRole('cell', {name:'2 / 2',exact:true}).waitFor();
    await page.screenshot({path:path.join(output,'purchases-desktop.png'),fullPage:true});
    await page.goto(appUrl + '#/home');
    await page.getByText('Active products', { exact: true }).waitFor();
    await page.screenshot({ path: path.join(output, 'dashboard-desktop.png'), fullPage: true });
    await page.goto(appUrl + '#/sales/pos');
    await page.getByRole('button', {name:/Coffee 250 g/}).press('Enter');
    await page.getByRole('button', { name: 'Process Sale', exact: true }).click();
    await page.waitForURL('**/receipt');
    await page.getByRole('heading', { name: 'Sales receipt', exact: true }).waitFor();
    await page.getByText('Av. Universitaria 1801, Lima', { exact: true }).waitFor();
    await page.waitForFunction(()=>document.querySelectorAll('.p-toast-message').length===0);
    await page.screenshot({ path: path.join(output, 'receipt-desktop.png'), fullPage: true });
    await page.locator('.receipt').screenshot({path:path.join(output,'receipt-document.png')});
    await page.emulateMedia({media:'print'});
    if(!await page.locator('.receipt h1').isVisible() || await page.locator('footer').isVisible() || await page.getByRole('button',{name:'Print receipt',exact:true}).isVisible()) throw new Error('Print layout must retain receipt and hide application controls');
    await page.emulateMedia({media:'screen'});

    const originalReceiptUrl=page.url();
    const dispatchedSaleId=originalReceiptUrl.match(/sales\/([^/]+)\/receipt/)[1];
    await page.goto(appUrl+'#/dispatches/new');
    await page.getByLabel("Driver's Name",{exact:true}).fill('UI demonstration driver');
    await page.getByLabel('License Plate',{exact:true}).fill('UI-001');
    await page.getByRole('button',{name:'Schedule Route',exact:true}).click();
    await page.getByText('Enter a driver, license plate and at least one sale.',{exact:true}).waitFor();
    await page.getByRole('combobox',{name:'Sales to Dispatch',exact:true}).press('ArrowDown');
    await page.getByRole('option',{name:new RegExp(dispatchedSaleId)}).click();
    await page.keyboard.press('Escape');
    await page.getByRole('button',{name:'Schedule Route',exact:true}).click();
    await page.waitForURL('**/dispatches');
    const dispatchRow=page.getByRole('row').filter({hasText:'UI demonstration driver'});
    await dispatchRow.getByRole('button',{name:'Start',exact:true}).click();
    await dispatchRow.getByRole('button',{name:'Delivered',exact:true}).click();
    await dispatchRow.getByRole('button',{name:'Delivered',exact:true}).waitFor({state:'hidden'});
    await dispatchRow.getByText('Delivered',{exact:true}).waitFor();
    // The UI must show a conflict when cancelling a sale assigned to a dispatch.
    expectedFailures.add('PATCH '+new URL(api).pathname+'/sales/'+dispatchedSaleId+'/cancel 409');
    await page.goto(appUrl+'#/sales');
    await page.getByRole('row').filter({hasText:dispatchedSaleId}).getByRole('button',{name:'Cancel Sale',exact:true}).click();
    await page.getByRole('alertdialog').getByRole('button',{name:'Cancel Sale',exact:true}).click();
    await page.getByRole('alert').filter({hasText:/dispatch/i}).waitFor();
    // A second, unassigned sale can be cancelled and must restore its stock.
    await page.goto(appUrl+'#/sales/pos');
    await page.getByRole('button',{name:/Rice 1 kg/}).press('Enter');
    await page.getByRole('button',{name:'Process Sale',exact:true}).click();
    await page.waitForURL('**/receipt');
    const cancellableSaleId=page.url().match(/sales\/([^/]+)\/receipt/)[1];
    await page.goto(appUrl+'#/sales');
    const saleRow=page.getByRole('row').filter({hasText:cancellableSaleId});
    await saleRow.getByRole('button',{name:'Cancel Sale',exact:true}).click();
    await page.getByRole('alertdialog').getByRole('button',{name:'Cancel Sale',exact:true}).click();
    await saleRow.getByText('Cancelled',{exact:true}).waitFor();
    if((await request('GET','/inventory')).find(p=>p.sku==='ARR-001').quantity!==25)throw Error('UI cancellation did not restore stock');
    await page.goto(originalReceiptUrl);
    await page.getByRole('heading',{name:'Sales receipt',exact:true}).waitFor();

    await page.getByRole('combobox', { name: 'Language' }).selectOption('es_419');
    await page.getByRole('heading', { name: 'Boleta de venta', exact: true }).waitFor();
    await page.reload();
    await page.getByRole('heading', { name: 'Boleta de venta', exact: true }).waitFor();
    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({ path: path.join(output, 'receipt-mobile.png'), fullPage: true });
    const hasHorizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
    if (hasHorizontalOverflow) throw new Error('Receipt overflows the mobile viewport');
    if (await page.locator('footer').evaluate(el=>getComputedStyle(el).backgroundColor)!=='rgb(15, 23, 42)') throw new Error('Footer contrast background missing');

    // A warehouse user must not enter team administration or POS by direct URL.
    await page.setViewportSize({width:1440,height:1000});
    await page.getByRole('combobox',{name:'Idioma'}).selectOption('en_US');
    await page.getByRole('button',{name:'Sign Out',exact:true}).click();
    await page.waitForURL('**/iam/sign-in');
    if(await page.evaluate(()=>sessionStorage.getItem('cete.token')))throw Error('Owner session not cleared');
    await page.getByLabel('Email or Username',{exact:true}).fill(workerEmail);
    await page.getByLabel('Password',{exact:true}).fill(password);
    await page.locator('form').getByRole('button',{name:'Sign In',exact:true}).click();
    await page.waitForURL('**/home');
    const workerToken=await page.evaluate(()=>sessionStorage.getItem('cete.token'));
    await page.goto(appUrl+'#/team');
    await page.waitForURL('**/home');
    await page.goto(appUrl+'#/sales/pos');
    await page.waitForURL('**/home');
    await page.getByRole('button',{name:'Sign Out',exact:true}).click();
    await page.waitForURL('**/iam/sign-in');
    const revoked=await fetch(api+'/inventory',{headers:{Authorization:'Bearer '+workerToken}});
    if(revoked.status!==401)throw Error('Logout did not revoke the employee session');

    if (failures.length) throw new Error('Browser errors: ' + failures.join('; '));

    console.log('PASS: full browser flow: catalogue create/edit/archive/duplicate, stock entry/exit, employee creation, partial receiving, keyboard POS, historical receipt/print/mobile, dispatch transitions, cancellation, role guards and logout revocation.');
  } catch (error) {
    await page.screenshot({ path: path.join(output, 'failure.png'), fullPage: true });
    console.error((String(error.message)+'; '+failures.join('; ')).replaceAll(password, '[redacted]'));
    process.exitCode = 1;
  } finally { await browser.close(); }
})();
