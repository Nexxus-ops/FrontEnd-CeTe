const dispatchList = () => import('./views/dispatch-list.vue');
const dispatchForm = () => import('./views/dispatch-form.vue');

const dispatchesRoutes = [
    { path: '',    name: 'dispatches-list', component: dispatchList, meta: { title: 'Rutas y Despachos' } },
    { path: 'new', name: 'dispatch-new',    component: dispatchForm, meta: { title: 'Nuevo Manifiesto' } }
];

export default dispatchesRoutes;