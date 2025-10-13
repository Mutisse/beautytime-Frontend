// src/router/adminSystem.Routes.ts
import type { RouteRecordRaw } from 'vue-router';

const adminSystemRoutes: RouteRecordRaw[] = [
  {
    path: '/adminSystem',
    component: () => import('layouts/AdminLayout.vue'),
    meta: { requiresAuth: true, requiredRole: 'admin' },
    children: [
      {
        path: 'dashboard',
        name: 'admin-dashboard',
        component: () => import('pages/admin/AdminSytemDashboardPage.vue'),
        meta: {
          title: 'Dashboard - Administrador',
          requiresAuth: true,
          requiredRole: 'admin',
        },
      },
      {
        path: 'users',
        name: 'admin-users',
        component: () => import('pages/admin/UsersManagementPage.vue'),
        meta: {
          title: 'Gestão de Usuários',
          requiresAuth: true,
          requiredRole: 'admin',
        },
      },
      {
        path: 'settings',
        name: 'admin-settings',
        component: () => import('pages/admin/SettingsPage.vue'),
        meta: {
          title: 'Configurações do Sistema',
          requiresAuth: true,
          requiredRole: 'admin',
        },
      },
      {
        path: 'reports',
        name: 'admin-reports',
        component: () => import('pages/admin/ReportsPage.vue'),
        meta: {
          title: 'Relatórios',
          requiresAuth: true,
          requiredRole: 'admin',
        },
      },
    ],
  },
];

export default adminSystemRoutes;
