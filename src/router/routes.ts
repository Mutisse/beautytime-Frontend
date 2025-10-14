import type { RouteRecordRaw } from 'vue-router';

// Importe as rotas específicas de cada role
import clientRoutes from './client.Routes';
import adminSystemRoutes from './adminSystem.Routes';
import businessManagerRoutes from './ownerManager.Routes';
import staffEmployeeRoutes from './staffEmployee.Routes';

const routes: RouteRecordRaw[] = [
  // Rotas públicas primeiro
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/IndexPage.vue'),
        meta: {
          title: 'Página Inicial',
          requiresAuth: false,
        },
      },
    ],
  },

  // Rotas de autenticação
  {
    path: '/auth',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      {
        path: '',
        name: 'auth',
        component: () => import('pages/auth/AuthView.vue'),
        meta: {
          requiresGuest: true,
          title: 'Autenticação',
        },
      },
    ],
  },

  // Rotas de redefinição de senha
  /*{
    path: '/password-reset',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      {
        path: '',
        name: 'password-reset-request',
        component: () => import('pages/auth/PasswordResetPage.vue'),
        meta: {
          requiresGuest: true,
          title: 'Redefinir Senha',
        },
      },
    ],
  },
  {
    path: '/password-reset-confirm/:token',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      {
        path: '',
        name: 'password-reset-confirm',
        component: () => import('pages/auth/PasswordResetConfirm.vue'),
        meta: {
          requiresGuest: true,
          title: 'Confirmar Nova Senha',
        },
        props: true,
      },
    ],
  },*/

  // Rotas públicas
  {
    path: '/about',
    component: () => import('../layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'about',
        component: () => import('../pages/AboutPage.vue'),
        meta: {
          title: 'Sobre Nós',
          requiresAuth: false,
        },
      },
    ],
  },
  // No seu router
  {
    path: '/beauty-services',
    component: () => import('../layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'beauty-services',
        component: () => import('../pages/BeautyServicesPage.vue'),
        meta: { title: 'Beauty Services' },
      },
    ],
  },
  // router/index.ts

  // 🔐 ROTAS PROTEGIDAS - Adicionadas DEPOIS das públicas
  ...clientRoutes,
  ...adminSystemRoutes,
  ...businessManagerRoutes,
  ...staffEmployeeRoutes,

  // Rotas de erro e suporte
  {
    path: '/conta-pendente',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      {
        path: '',
        name: 'account-pending',
        component: () => import('pages/errors/AccountPending.vue'),
        meta: {
          title: 'Conta Pendente',
        },
      },
    ],
  },
  {
    path: '/conta-desativada',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      {
        path: '',
        name: 'account-deactivated',
        component: () => import('pages/errors/AccountDeactivated.vue'),
        meta: {
          title: 'Conta Desativada',
        },
      },
    ],
  },
  {
    path: '/403',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      {
        path: '',
        name: 'access-denied',
        component: () => import('pages/errors/AccessDenied.vue'),
        meta: {
          title: 'Acesso Negado',
        },
      },
    ],
  },
  {
    path: '/500',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'server-error',
        component: () => import('pages/ErrorServer.vue'),
        meta: {
          title: 'Erro do servidor',
        },
      },
    ],
  },
  {
    path: '/suporte',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'SuportTech',
        component: () => import('pages/admin/SuportTechView.vue'),
        meta: {
          title: 'Suporte Técnico',
          requiresAuth: true,
        },
        props: true,
      },
    ],
  },

  // ⚠️ SEMPRE ÚLTIMA - Rota curinga
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
    meta: {
      title: 'Página Não Encontrada',
    },
  },
];

export default routes;
