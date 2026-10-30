import { createRouter, createWebHashHistory } from "vue-router";
import inventoryRoutes from "./inventory/presentation/inventory-routes.js";
import salesRoutes from "./sales/presentation/sales-routes.js";
import dispatchesRoutes from "./logistics/presentation/dispatches-routes.js";
import iamRoutes from "./iam/presentation/iam-routes.js";
import { authenticationGuard } from "./iam/infrastructure/authentication.guard.js";
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/", redirect: "/home" },
    {
      path: "/home",
      name: "home",
      component: () => import("./shared/presentation/views/home.vue"),
    },
    {
      path: "/about",
      name: "about",
      component: () => import("./shared/presentation/views/about.vue"),
      meta: { public: true },
    },
    { path: "/inventory", children: inventoryRoutes },
    {
      path: "/sales",
      children: salesRoutes,
      meta: { roles: ["Admin", "Sales", "Logistics"] },
    },
    {
      path: "/dispatches",
      children: dispatchesRoutes,
      meta: { roles: ["Admin", "Logistics"] },
    },
    {
      path: "/purchases",
      name: "purchases",
      component: () => import("./procurement/presentation/views/purchases.vue"),
      meta: { roles: ["Admin", "Warehouse"] },
    },
    {
      path: "/team",
      name: "team",
      component: () => import("./iam/presentation/views/team.vue"),
      meta: { roles: ["Admin"] },
    },
    { path: "/iam", children: iamRoutes, meta: { public: true } },
    { path: "/login", redirect: "/iam/sign-in", meta: { public: true } },
    { path: "/register", redirect: "/iam/sign-up", meta: { public: true } },
    {
      path: "/:pathMatch(.*)*",
      name: "not-found",
      component: () => import("./shared/presentation/views/page-not-found.vue"),
      meta: { public: true },
    },
  ],
});
router.beforeEach((to) => {
  document.title = "CeTe · Workspace";
  return authenticationGuard(to);
});
export default router;
