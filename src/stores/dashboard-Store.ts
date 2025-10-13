import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import type {
  UserProfile,
  Booking,
  Promotion,
  Feedback,
  Service,
  Notification,
  FilterState,
} from '../types/indexDashboard-Type';
import { useAuthStore } from './auth-store';
import { api } from 'boot/axios';

export const useAppStore = defineStore('app', () => {
  const authStore = useAuthStore();

  // State
  const user = ref<UserProfile | null>(null);
  const bookings = ref<Booking[]>([]);
  const promotions = ref<Promotion[]>([]);
  const feedbacks = ref<Feedback[]>([]);
  const services = ref<Service[]>([]);
  const notifications = ref<Notification[]>([]);
  const filters = ref<FilterState>({ salon: '' });
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Sincronizar usuário da authStore com appStore
  watch(
    () => authStore.currentUser,
    (newUser) => {
      if (newUser) {
        const userWithPhone = newUser as unknown as { phone?: string };
        user.value = {
          id: newUser.id,
          name:
            newUser.fullName.display ||
            `${newUser.fullName.firstName} ${newUser.fullName.lastName}`,
          email: newUser.email,
          role: newUser.role as 'client' | 'professional' | 'manager',
          avatar: newUser.profileImage || undefined,
          phone: userWithPhone.phone || undefined,
        };
      } else {
        user.value = null;
      }
    },
    { immediate: true },
  );

  // Getters
  const isClient = computed(() => user.value?.role === 'client');
  const isProfessional = computed(() => user.value?.role === 'professional');
  const isManager = computed(() => user.value?.role === 'manager');

  const upcomingAppointments = computed(() =>
    bookings.value.filter(
      (booking) => booking.status === 'confirmed' || booking.status === 'pending',
    ),
  );

  const nextBooking = computed(() =>
    upcomingAppointments.value.length > 0 ? upcomingAppointments.value[0] : null,
  );

  const averageRating = computed(() => {
    if (feedbacks.value.length === 0) return '0.0';
    const total = feedbacks.value.reduce((sum, feedback) => sum + feedback.rating, 0);
    return (total / feedbacks.value.length).toFixed(1);
  });

  const salonOptions = computed(() => {
    const salons = [...new Set(feedbacks.value.map((f) => f.salon))];
    return [
      { label: 'Todos os salões', value: '' },
      ...salons.map((salon) => ({ label: salon, value: salon })),
    ];
  });

  const filteredFeedbacks = computed(() => {
    if (!filters.value.salon) return feedbacks.value;
    return feedbacks.value.filter((f) => f.salon === filters.value.salon);
  });

  const recentReviews = computed(() => {
    return [...feedbacks.value]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3);
  });

  const unreadNotifications = computed(() => notifications.value.filter((n) => !n.read).length);

  // Actions
  const setUser = (userData: UserProfile) => {
    user.value = userData;
  };

  const setBookings = (bookingsData: Booking[]) => {
    bookings.value = bookingsData;
  };

  const setPromotions = (promotionsData: Promotion[]) => {
    promotions.value = promotionsData;
  };

  const setFeedbacks = (feedbacksData: Feedback[]) => {
    feedbacks.value = feedbacksData;
  };

  const setServices = (servicesData: Service[]) => {
    services.value = servicesData;
  };

  const setNotifications = (notificationsData: Notification[]) => {
    notifications.value = notificationsData;
  };

  const setFilters = (newFilters: Partial<FilterState>) => {
    filters.value = { ...filters.value, ...newFilters };
  };

  const markNotificationAsRead = (notificationId: string) => {
    const notification = notifications.value.find((n) => n.id === notificationId);
    if (notification) {
      notification.read = true;
    }
  };

  const markAllNotificationsAsRead = () => {
    notifications.value.forEach((notification) => {
      notification.read = true;
    });
  };

  // Carregar dados reais da API
  const loadUserData = async (): Promise<void> => {
    if (!authStore.isAuthenticated) {
      return;
    }

    loading.value = true;
    error.value = null;

    try {
      const [
        bookingsResponse,
        promotionsResponse,
        feedbacksResponse,
        servicesResponse,
        notificationsResponse,
      ] = await Promise.all([
        api.get('/bookings'),
        api.get('/promotions'),
        api.get('/feedbacks'),
        api.get('/services'),
        api.get('/notifications'),
      ]);

      bookings.value = bookingsResponse.data.data || [];
      promotions.value = promotionsResponse.data.data || [];
      feedbacks.value = feedbacksResponse.data.data || [];
      services.value = servicesResponse.data.data || [];
      notifications.value = notificationsResponse.data.data || [];
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      error.value = 'Erro ao carregar dados. Tente novamente.';
      loadMockData();
    } finally {
      loading.value = false;
    }
  };

  // Fallback para dados mockados
  const loadMockData = (): void => {
    bookings.value = [
      {
        id: '123',
        service: 'Corte de Cabelo',
        date: '2023-12-15',
        time: '14:30',
        salonName: 'Salão Elegance',
        salonAddress: 'Av. Principal, 123',
        status: 'confirmed',
        professional: 'João Silva',
        price: 50,
      },
    ] as Booking[];

    promotions.value = [
      {
        id: 1,
        title: 'Desconto de 20%',
        description: 'Em todos os serviços de beleza',
        discount: 20,
        validUntil: '2023-12-31',
        salonId: 'salon-1',
      },
    ] as Promotion[];

    feedbacks.value = [
      {
        id: '1',
        name: 'Joana Santos',
        salon: 'Salão Elegance',
        date: '2023-12-10',
        rating: 5,
        comment: 'Serviço excelente, adorei o resultado!',
        service: 'Corte de Cabelo',
        gender: 'female',
        clientId: 'client-1',
      },
    ] as Feedback[];

    services.value = [
      {
        id: 1,
        name: 'Corte de Cabelo',
        icon: 'cut',
        category: 'Cabelo',
        description: 'Corte moderno e estilizado',
        duration: 60,
        price: 50,
      },
    ] as Service[];

    notifications.value = [
      {
        id: '1',
        title: 'Agendamento Confirmado',
        message: 'Seu horário foi confirmado com sucesso',
        type: 'success',
        read: false,
        createdAt: '2023-12-10T10:00:00',
      },
    ] as Notification[];
  };

  const clearError = (): void => {
    error.value = null;
  };

  // Carregar dados quando o usuário se autenticar
  watch(
    () => authStore.isAuthenticated,
    (isAuthenticated) => {
      if (isAuthenticated) {
        void loadUserData();
      } else {
        bookings.value = [];
        promotions.value = [];
        feedbacks.value = [];
        services.value = [];
        notifications.value = [];
      }
    },
    { immediate: true },
  );

  return {
    user,
    bookings,
    promotions,
    feedbacks,
    services,
    notifications,
    filters,
    loading,
    error,
    isClient,
    isProfessional,
    isManager,
    upcomingAppointments,
    nextBooking,
    averageRating,
    salonOptions,
    filteredFeedbacks,
    recentReviews,
    unreadNotifications,
    setUser,
    setBookings,
    setPromotions,
    setFeedbacks,
    setServices,
    setNotifications,
    setFilters,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    loadUserData,
    loadMockData,
    clearError,
  };
});
