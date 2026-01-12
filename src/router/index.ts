import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";

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
      { path: "", redirect: "/categories" },
      {
        path: "activity",
        name: "activity",
        component: () => import("@/views/activity.vue"),
      },
      {
        path: "analytics",
        name: "analytics",
        component: () => import("@/views/analytics.vue"),
      },
      {
        path: "health_check",
        name: "healthCheck",
        component: () => import("@/views/healthCheck.vue"),
      },
      {
        path: "organizations",
        name: "organizations",
        component: () => import("@/views/organizations.vue"),
      },
      {
        path: "staff",
        name: "staff",
        component: () => import("@/views/staff.vue"),
      },
      {
        path: "staff_activity",
        name: "staffActivity",
        component: () => import("@/views/staffActivity.vue"),
      },
      {
        path: "worker_session",
        name: "workerSession",
        component: () => import("@/views/workerSession.vue"),
      },
      {
        path: "categories",
        name: "categories",
        component: () => import("@/views/categories.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next("/login");
  } else if (to.path === "/login" && authStore.isAuthenticated) {
    next("/categories");
  } else {
    next();
  }
});

export default router;
