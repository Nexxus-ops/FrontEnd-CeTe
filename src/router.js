import {createRouter, createWebHistory} from "vue-router";
import Home from "./shared/presentation/views/home.vue";

// Importación de las rutas de nuestros Bounded Contexts
import inventoryRoutes from "./inventory/presentation/inventory-routes.js";
import salesRoutes from "./sales/presentation/sales-routes.js";
import dispatchesRoutes from "./logistics/presentation/dispatches-routes.js";
import iamRoutes from "./iam/presentation/iam-routes.js";

import { authenticationGuard } from "./iam/infrastructure/authentication.guard.js";

// Definimos las vistas compartidas con lazy-loading para optimizar el rendimiento
const about = () => import('./shared/presentation/views/about.vue');
const pageNotFound = () => import('./shared/presentation/views/page-not-found.vue');

const routes = [
    { path: '/home',            name: 'home',       component: Home,        meta: { title: 'Dashboard' } },
    { path: '/about',           name: 'about',      component: about,       meta: { title: 'Acerca de CeTe' } },

    // Inyectamos los sub-módulos (Bounded Contexts)
    { path: '/inventory',       name: 'inventory',  children: inventoryRoutes },
    { path: '/sales',           name: 'sales',      children: salesRoutes },
    { path: '/dispatches',      name: 'dispatches', children: dispatchesRoutes },
    { path: '/iam',             name: 'iam',        children: iamRoutes },

    // Redirección por defecto
    { path: '/',                redirect: '/home' },

    // Captura de rutas no encontradas (Error 404)
    { path: '/:pathMatch(.*)*', name: 'not-found',  component: pageNotFound, meta: { title: 'Página No Encontrada' } }
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: routes,
});

router.beforeEach((to, from) => {
    console.log(`Navegando desde ${from.name?.toString() || 'inicio'} hacia ${to.name?.toString()}`);

    // Cambiar el título de la pestaña del navegador dinámicamente
    let baseTitle = 'CeTe SaaS';
    document.title = `${baseTitle} - ${to.meta['title'] || 'Workspace'}`;

    // Ejecutar el guardia de seguridad (IAM)
    // Si la ruta no es pública y no estás logueado, te enviará a /iam/sign-in
    return authenticationGuard(to, from);
});

export default router;