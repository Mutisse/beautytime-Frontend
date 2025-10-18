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

      // ========== AGENDAMENTOS ==========
      {
        path: 'agendamentos/novo',
        name: 'novo-agendamento',
        component: () => import('pages/client/agendamentos/NewBookingPage.vue'),
        meta: {
          title: 'Novo Agendamento',
          requiresAuth: true,
          requiredRole: 'client',
        },
      },
      {
        path: 'agendamentos/proximos',
        name: 'proximos-agendamentos',
        component: () => import('pages/client/agendamentos/UpcomingAppointmentsPage.vue'),
        meta: {
          title: 'Próximos Agendamentos',
          requiresAuth: true,
          requiredRole: 'client',
        },
      },
      {
        path: 'agendamentos/historico',
        name: 'historico-agendamentos',
        component: () => import('pages/client/agendamentos/AppointmentHistoryPage.vue'),
        meta: {
          title: 'Histórico de Agendamentos',
          requiresAuth: true,
          requiredRole: 'client',
        },
      },

      // ========== SERVIÇOS ==========
      {
        path: 'servicos/explorar',
        name: 'explorar-servicos',
        component: () => import('pages/client/servicos/ExploreServicesPage.vue'),
        meta: {
          title: 'Explorar Serviços',
          requiresAuth: true,
          requiredRole: 'client',
        },
      },
      {
        path: 'servicos/favoritos',
        name: 'servicos-favoritos',
        component: () => import('pages/client/servicos/FavoriteServicesPage.vue'),
        meta: {
          title: 'Serviços Favoritos',
          requiresAuth: true,
          requiredRole: 'client',
        },
      },
      {
        path: 'servicos/historico',
        name: 'historico-servicos',
        component: () => import('pages/client/servicos/ServiceHistoryPage.vue'),
        meta: {
          title: 'Histórico de Serviços',
          requiresAuth: true,
          requiredRole: 'client',
        },
      },

      // ========== SALÕES ==========
      {
        path: 'saloes/proximos',
        name: 'saloes-proximos',
        component: () => import('pages/client/saloes/NearbySalonsPage.vue'),
        meta: {
          title: 'Salões Próximos',
          requiresAuth: true,
          requiredRole: 'client',
        },
      },
      {
        path: 'saloes/favoritos',
        name: 'saloes-favoritos',
        component: () => import('pages/client/saloes/FavoriteSalonsPage.vue'),
        meta: {
          title: 'Salões Favoritos',
          requiresAuth: true,
          requiredRole: 'client',
        },
      },
      {
        path: 'saloes/avaliados',
        name: 'saloes-avaliados',
        component: () => import('pages/client/saloes/TopRatedSalonsPage.vue'),
        meta: {
          title: 'Melhores Avaliados',
          requiresAuth: true,
          requiredRole: 'client',
        },
      },

      // ========== PROMOÇÕES ==========
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

      // ========== PAGAMENTOS ==========
      {
        path: 'pagamentos/metodos',
        name: 'metodos-pagamento',
        component: () => import('pages/client/pagamentos/PaymentMethodsPage.vue'),
        meta: {
          title: 'Métodos de Pagamento',
          requiresAuth: true,
          requiredRole: 'client',
        },
      },
      {
        path: 'pagamentos/historico',
        name: 'historico-pagamentos',
        component: () => import('pages/client/pagamentos/PaymentHistoryPage.vue'),
        meta: {
          title: 'Histórico de Pagamentos',
          requiresAuth: true,
          requiredRole: 'client',
        },
      },
      {
        path: 'pagamentos/cupons',
        name: 'cupons-desconto',
        component: () => import('pages/client/pagamentos/CouponsPage.vue'),
        meta: {
          title: 'Cupons de Desconto',
          requiresAuth: true,
          requiredRole: 'client',
        },
      },

      // ========== AVALIAÇÕES ==========
      {
        path: 'avaliacoes/minhas',
        name: 'minhas-avaliacoes',
        component: () => import('pages/client/avaliacoes/MyReviewsPage.vue'),
        meta: {
          title: 'Minhas Avaliações',
          requiresAuth: true,
          requiredRole: 'client',
        },
      },
      {
        path: 'avaliacoes/pendentes',
        name: 'avaliacoes-pendentes',
        component: () => import('pages/client/avaliacoes/PendingReviewsPage.vue'),
        meta: {
          title: 'Avaliações Pendentes',
          requiresAuth: true,
          requiredRole: 'client',
        },
      },

      // ========== SUPORTE ==========
      {
        path: 'suporte/chat',
        name: 'chat-suporte',
        component: () => import('pages/client/suporte/SupportChatPage.vue'),
        meta: {
          title: 'Chat com Suporte',
          requiresAuth: true,
          requiredRole: 'client',
        },
      },
      {
        path: 'suporte/faq',
        name: 'faq-suporte',
        component: () => import('pages/client/suporte/FAQPage.vue'),
        meta: {
          title: 'Perguntas Frequentes',
          requiresAuth: true,
          requiredRole: 'client',
        },
      },
      {
        path: 'suporte/central-ajuda',
        name: 'central-ajuda',
        component: () => import('pages/client/suporte/HelpCenterPage.vue'),
        meta: {
          title: 'Central de Ajuda',
          requiresAuth: true,
          requiredRole: 'client',
        },
      },

      // ========== PERFIL E CONFIGURAÇÕES ==========
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
        path: 'configuracoes',
        name: 'configuracoes',
        component: () => import('pages/client/ConfiguracoesPage.vue'),
        meta: {
          title: 'Configurações',
          requiresAuth: true,
          requiredRole: 'client',
        },
      },

      // ========== ROTAS EXISTENTES (mantidas) ==========
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
