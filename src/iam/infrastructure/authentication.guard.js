import useIamStore from "../application/iam.store.js";

/**
 * Navigation guard that protects non-public routes for anonymous users.
 *
 * @param {import('vue-router').RouteLocationNormalized} to - Target route.
 * @param {import('vue-router').RouteLocationNormalized} from - Current route.
 * @returns {{name: string}|boolean|undefined} - Returns true to allow navigation or an object to redirect.
 */
export const authenticationGuard = (to, from) => {
    const store = useIamStore();
    const isAnonymous = !store.isSignedIn;
    // Agregamos todas las rutas que son públicas
    const publicRoutes = ['/iam/sign-in', '/iam/sign-up', '/about', '/home', '/page-not-found'];

    // Si la ruta a la que va NO está en la lista de públicas, requiere autenticación
    const routeRequiresToBeAuthenticated = !publicRoutes.includes(to.path);

    if (isAnonymous && routeRequiresToBeAuthenticated) {
        console.warn("Acceso denegado. Redirigiendo a Login.");
        return { name: 'iam-sign-in'};
    }
    else return true;
}