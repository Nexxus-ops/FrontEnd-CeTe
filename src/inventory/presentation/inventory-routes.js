const inventoryList = () => import('./views/inventory-list.vue');
const inventoryForm = () => import('./views/inventory-form.vue');

const inventoryRoutes = [
    { path: ':id/movements', name: 'inventory-movements', component: () => import('./views/movements.vue'), meta: { roles: ['Admin','Warehouse'] } },
    { path: '',         name: 'inventory-list', component: inventoryList, meta: { title: 'Kardex de Inventario' } },
    { path: 'new',      name: 'inventory-new',  component: inventoryForm, meta: { title: 'Registrar Ingreso' } },
    { path: ':id/edit', name: 'inventory-edit', component: inventoryForm, meta: { title: 'Ajuste de Stock / Merma' } }
];

export default inventoryRoutes;