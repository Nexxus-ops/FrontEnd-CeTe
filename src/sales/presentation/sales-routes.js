const salesList = () => import('./views/sales-list.vue');
const pointOfSale = () => import('./views/point-of-sale.vue');

const salesRoutes = [
    { path: '',    name: 'sales-list', component: salesList,  meta: { title: 'Historial de Ventas' } },
    { path: 'pos', name: 'sales-pos',  component: pointOfSale, meta: { title: 'Punto de Venta (POS)' } }
];

export default salesRoutes;