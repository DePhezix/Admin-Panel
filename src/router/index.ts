import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import Cookies from "js-cookie";
import component from "element-plus/es/components/tree-select/src/tree-select-option.mjs";

const routes = [
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/login.vue"),
  },
  {
    path: "/",
    component: () => import("@/layouts/default.vue"),
    meta: { requiresAuth: true },
    children: [
      { path: "", redirect: "/dashboard" },
      {
        path: "dashboard",
        name: "dashboard",
        component: () => import("@/views/dashboard.vue"),
      },
      {
        path: "settings",
        name: "settings",
        component: () => import("@/views/settings.vue"),
      },
      {
        path: "sessions",
        name: "sessions",
        component: () => import("@/views/workerSession.vue"),
      },
      {
        path: "categories",
        children: [
          {
            path: "",
            name: "categories",
            component: () => import("@/views/categories.vue"),
          },
          {
            path: ":categoryId",
            name: "organizations",
            component: () => import("@/views/organizations.vue"),
          },
          {
            path: ":categoryId/organizations/:organizationId",
            name: "staff_and_activities",
            component: () => import("@/views/staffAndActivities.vue"),
          },
          {
            path: ":categoryId/organization/:organizationId/staff/:staffId",
            name: "staff_activities",
            component: () => import("@/views/staffActivities.vue")
          },
        ],
      },
      {
        path: "equipment",
        name: "equipment",
        component: () => import("@/views/healthCheck.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
  scrollBehavior() {
    return { top: 0, behavior: "smooth" };
  },
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  if (!authStore.userRole && Cookies.get("token")) {
    await authStore.initAuth();
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next("/login");
  } else if (to.path === "/login" && authStore.isAuthenticated) {
    next("/dashboard");
  } else {
    next();
  }
});

export default router;
