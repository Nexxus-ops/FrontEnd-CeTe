# CeTe · Frontend AV2

Vue 3, Pinia, Vue Router, PrimeVue 4 (MIT), Material y Vue I18n. Consume la API C# propia; el flujo principal ya no usa JSON Server ni acepta un acceso ficticio.

```powershell
npm ci
npm run dev
```

Abrir la URL que muestra Vite con la base `/FrontEnd-CeTe/`. El backend debe estar ejecutándose con Docker. La API predeterminada es `http://localhost:5080/api/v1`; se puede cambiar mediante `VITE_PLATFORM_API_URL` en `.env.local`. Ver `.env.example`. Ninguna variable VITE debe contener secretos.

Registrar una empresa con datos ficticios para la demostración. El administrador gestiona inventario, entradas/salidas, compras y recepción, ventas y boletas, despachos, métricas y empleados con roles. La boleta se abre al confirmar una venta y desde el historial; Imprimir permite guardarla como PDF desde el navegador.

Inglés por defecto (`en_US`) y español latinoamericano (`es_419`), con preferencia persistente. Sesión en `sessionStorage`, vencimiento y limpieza de datos al cambiar de usuario. El servidor verifica permisos, precios, stock y aislamiento de empresa.

```powershell
npm run build
npm audit
```

GitHub Pages toma `VITE_PLATFORM_API_URL` de una variable del repositorio. Configurar la URL HTTPS pública antes de publicar. Si falta en CI, el build debe fallar para evitar desplegar una aplicación que intente conectarse al localhost del visitante.

Evidencias y alcance del incremento: [Report-CeTe](https://github.com/Nexxus-ops/Report-CeTe). El equipo debe aportar y revisar cambios reales de al menos tres participantes; la asistencia técnica no reemplaza su participación.

## Prueba completa de navegador

Con API Docker y Vite ejecutándose, usar npm run test:e2e. La suite usa Playwright 1.62.1 y Edge en Windows. En Linux, preparar Chromium mediante npx playwright install chromium. CETE_BROWSER_CHANNEL permite seleccionar otro canal instalado.

También se puede verificar la demo pública desde PowerShell:

    $env:CETE_WEB_URL = "https://cete-web-av2.onrender.com/"
    $env:CETE_API_URL = "https://cete-api-av2.onrender.com/api/v1"
    npm run test:e2e

La suite crea una empresa ficticia y cuentas temporales en memoria. Comprueba catálogo, SKU duplicado, movimientos, empleados, compras parciales, venta por teclado, boleta e impresión, despacho, anulación, idiomas, móvil, permisos y revocación de sesión. Ejecutar en una base de demostración. Las capturas locales quedan en test-results y están excluidas de Git. Las credenciales y tokens no se guardan en archivos.
