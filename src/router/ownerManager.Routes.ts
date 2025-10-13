// src/router/businessManager.Routes.ts
import type { RouteRecordRaw } from 'vue-router';

const businessManagerRoutes: RouteRecordRaw[] = [
  {
    path: '/ownerManager',
    component: () => import('layouts/ManagerLayout.vue'),
    meta: { requiresAuth: true, requiredRole: 'manager' },
    children: [
      {
        path: 'dashboard',
        name: 'manager-dashboard',
        component: () => import('pages/manager/ManagerDashboardPage.vue'),
        meta: {
          title: 'Dashboard - Gestor',
          requiresAuth: true,
          requiredRole: 'manager',
        },
      },
      {
        path: 'financial',
        name: 'manager-financial',
        component: () => import('pages/manager/FinancialPage.vue'),
        meta: {
          title: 'Gestão Financeira',
          requiresAuth: true,
          requiredRole: 'manager',
        },
      },
      {
        path: 'team',
        name: 'manager-team',
        component: () => import('pages/manager/TeamPage.vue'),
        meta: {
          title: 'Gestão de Equipa',
          requiresAuth: true,
          requiredRole: 'manager',
        },
      },
      {
        path: 'create/new-salon',
        name: 'manager-salon-create',
        component: () => import('pages/manager/SalonCreatePage.vue'),
        meta: {
          title: 'Criar Novo Salão',
          requiresAuth: true,
          requiredRole: 'manager',
        },
      },
      {
        path: 'add/new-salon',
        name: 'manager-salon-add',
        component: () => import('pages/manager/addNewSalonPage.vue'),
        meta: {
          title: 'Adcionar um Novo Salão',
          requiresAuth: true,
          requiredRole: 'manager',
        },
      },


    ],
  },
];

export default businessManagerRoutes;
