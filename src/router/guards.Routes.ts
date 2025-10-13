// src/router/index.ts
import { defineRouter } from '#q-app/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';
import routes from './routes';
import { useAuthStore } from 'src/stores/auth-store';

export default defineRouter(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  // 🔐 Guard de navegação para autenticação e roles
  Router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();
    const isAuthenticated = authStore.isAuthenticated;
    const userRole = authStore.userRole;

    // Se a rota requer autenticação e o usuário não está autenticado
    if (to.meta.requiresAuth && !isAuthenticated) {
      next({ name: 'auth' });
      return;
    }


    // Verificação de role específica
    if (to.meta.requiredRole && userRole !== to.meta.requiredRole) {
      next({ name: 'access-denied' });
      return;
    }

    next();
  });

  return Router;
});
