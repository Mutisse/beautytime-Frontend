import type { RouteRecordRaw } from 'vue-router';

const clientRoutes: RouteRecordRaw[] = [
  {
    path: '/client',
    component: () => import('layouts/ClientLayout.vue'),
    meta: { requiresAuth: true, requiredRole: 'client' },
    children: [
      {
        path: '',
        redirect: '/client/dashboard',
      },
      {
        path: 'dashboard',
        name: 'client-dashboard',
        component: () => import('pages/client/DashboardPageClient.vue'),
        meta: {
          title: 'Dashboard - Cliente',
          requiresAuth: true,
          requiredRole: 'client',
        },
      },
      // Rotas do Menu Perfil
      {
        path: 'profile',
        name: 'client-profile',
        component: () => import('pages/client/ProfilePage.vue'),
        meta: {
          title: 'Meu Perfil',
          requiresAuth: true,
          requiredRole: 'client',
        },
      },
      {
        path: 'history',
        name: 'client-history',
        component: () => import('pages/client/HistoryPage.vue'),
        meta: {
          title: 'Histórico de Serviços',
          requiresAuth: true,
          requiredRole: 'client',
        },
      },
      // Rotas do Menu Busca
      {
        path: 'saloes-proximos',
        name: 'client-nearby-salons',
        component: () => import('pages/client/NearbySalonsPage.vue'),
        meta: {
          title: 'Salões Próximos',
          requiresAuth: true,
          requiredRole: 'client',
        },
      },
      {
        path: '/salon/:salonId/services',
        name: 'services',
        component: () => import('pages/client/servicesSchedulingPage.vue'),
        props: true,
        meta: {
          title: 'Serviços do Salão',
          requiresAuth: true,
          breadcrumb: 'Serviços',
        },
      },
      {
        path: 'favoritos',
        name: 'client-favorites',
        component: () => import('pages/client/FavoritesPage.vue'),
        meta: {
          title: 'Meus Favoritos',
          requiresAuth: true,
          requiredRole: 'client',
        },
      },
      {
        path: 'filtrar/avaliacao',
        name: 'client-filter-rating',
        component: () => import('pages/client/FilterByRatingPage.vue'),
        meta: {
          title: 'Filtrar por Avaliação',
          requiresAuth: true,
          requiredRole: 'client',
        },
      },
      {
        path: 'promocoes',
        name: 'client-promotions',
        component: () => import('pages/client/PromotionsPage.vue'),
        meta: {
          title: 'Promoções',
          requiresAuth: true,
          requiredRole: 'client',
        },
      },
      // Rotas do Menu Agenda
      /*{
        path: 'servico-domiciliar',
        name: 'client-home-service',
        component: () => import('pages/client/HomeServicePage.vue'),
        meta: {
          title: 'Serviço Domiciliar',
          requiresAuth: true,
          requiredRole: 'client',
        },
      },
      {
        path: 'reagendar',
        name: 'client-reschedule',
        component: () => import('pages/client/ReschedulePage.vue'),
        meta: {
          title: 'Reagendar/Cancelar',
          requiresAuth: true,
          requiredRole: 'client',
        },
      },*/
      // Rotas do Menu Pagamento
      {
        path: 'pagar-online',
        name: 'client-pay-online',
        component: () => import('pages/client/PayOnlinePage.vue'),
        meta: {
          title: 'Pagar Online',
          requiresAuth: true,
          requiredRole: 'client',
        },
      },
      {
        path: 'metodos-pagamento',
        name: 'client-payment-methods',
        component: () => import('pages/client/PaymentMethodsPage.vue'),
        meta: {
          title: 'Métodos de Pagamento',
          requiresAuth: true,
          requiredRole: 'client',
        },
      },
      // Rotas do Menu Histórico
      /*{
        path: 'servicos-anteriores',
        name: 'client-previous-services',
        component: () => import('pages/client/PreviousServicesPage.vue'),
        meta: {
          title: 'Serviços Anteriores',
          requiresAuth: true,
          requiredRole: 'client',
        },
      },
      {
        path: 'avaliacoes-feitas',
        name: 'client-given-ratings',
        component: () => import('pages/client/GivenRatingsPage.vue'),
        meta: {
          title: 'Avaliações Feitas',
          requiresAuth: true,
          requiredRole: 'client',
        },
      },*/
      // Rotas do Menu Configurações
      {
        path: 'notificacoes',
        name: 'client-notifications',
        component: () => import('pages/client/NotificationsPage.vue'),
        meta: {
          title: 'Notificações',
          requiresAuth: true,
          requiredRole: 'client',
        },
      },
      {
        path: 'privacidade',
        name: 'client-privacy',
        component: () => import('pages/client/PrivacyPage.vue'),
        meta: {
          title: 'Privacidade e Segurança',
          requiresAuth: true,
          requiredRole: 'client',
        },
      },
      {
        path: 'preferencias',
        name: 'client-preferences',
        component: () => import('../pages/client/PreferencesPage.vue'),
        meta: {
          title: 'Preferências',
          requiresAuth: true,
          requiredRole: 'client',
        },
      },
      {
        path: 'ajuda',
        name: 'client-help',
        component: () => import('../components/Forms/BookingForm.vue'),
        meta: {
          title: 'Ajuda e Suporte',
          requiresAuth: true,
          requiredRole: 'client',
        },
      },
    ],
  },
];

export default clientRoutes;
