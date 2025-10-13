// stores/reports-store.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';
import type {
  FilterOption,
  SalonMetric,
  ServiceMetric,
  SalonPerformance,
  ProfitableService,
  ServiceDetail,
} from '../types/reports-types';

export const useReportsStore = defineStore('reports', () => {
  // State
  const selectedPeriod = ref<FilterOption>({ label: 'Últimos 30 dias', value: '30d' });
  const selectedSalon = ref<FilterOption>({ label: 'Todos os Salões', value: 'all' });
  const selectedService = ref<FilterOption>({ label: 'Todos os Serviços', value: 'all' });

  const salonMetrics = ref<SalonMetric[]>([
    {
      id: 1,
      label: 'Faturamento Total',
      value: '45.8K MT',
      icon: 'fas fa-money-bill-wave',
      color: 'positive',
      trend: 15.2,
    },
    {
      id: 2,
      label: 'Total de Agendamentos',
      value: '324',
      icon: 'fas fa-calendar-check',
      color: 'primary',
      trend: 8.7,
    },
    {
      id: 3,
      label: 'Clientes Atendidos',
      value: '287',
      icon: 'fas fa-users',
      color: 'info',
      trend: 12.3,
    },
    {
      id: 4,
      label: 'Serviços Realizados',
      value: '412',
      icon: 'fas fa-concierge-bell',
      color: 'warning',
      trend: 18.5,
    },
  ]);

  const serviceMetrics = ref<ServiceMetric[]>([
    {
      id: 1,
      name: 'Cabelo',
      value: '156',
      revenue: '18.2K MT',
      icon: 'fas fa-cut',
      color: 'primary',
    },
    {
      id: 2,
      name: 'Unhas',
      value: '98',
      revenue: '9.8K MT',
      icon: 'fas fa-hand-sparkles',
      color: 'pink',
    },
    {
      id: 3,
      name: 'Barba',
      value: '87',
      revenue: '6.9K MT',
      icon: 'fas fa-user',
      color: 'teal',
    },
    {
      id: 4,
      name: 'Pele',
      value: '45',
      revenue: '8.1K MT',
      icon: 'fas fa-spa',
      color: 'orange',
    },
    {
      id: 5,
      name: 'Massagem',
      value: '26',
      revenue: '5.2K MT',
      icon: 'fas fa-spa',
      color: 'purple',
    },
  ]);

  const salonPerformance = ref<SalonPerformance[]>([
    {
      id: 1,
      name: 'Beauty Time Matola',
      logo: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=100&h=100&fit=crop',
      performance: 85,
      revenue: '24.5K MT',
      appointments: 156,
    },
    {
      id: 2,
      name: 'Beauty Time Maputo',
      logo: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=100&h=100&fit=crop',
      performance: 72,
      revenue: '15.8K MT',
      appointments: 112,
    },
    {
      id: 3,
      name: 'Beauty Time Costa do Sol',
      logo: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=100&h=100&fit=crop',
      performance: 45,
      revenue: '5.5K MT',
      appointments: 56,
    },
  ]);

  const profitableServices = ref<ProfitableService[]>([
    {
      id: 1,
      name: 'Corte de Cabelo Premium',
      salon: 'Beauty Time Matola',
      bookings: 67,
      revenue: '10.1K MT',
      popularity: 85,
      icon: 'fas fa-cut',
      categoryColor: 'primary',
    },
    {
      id: 2,
      name: 'Manicure Completa',
      salon: 'Beauty Time Maputo',
      bookings: 54,
      revenue: '5.4K MT',
      popularity: 78,
      icon: 'fas fa-hand-sparkles',
      categoryColor: 'pink',
    },
    {
      id: 3,
      name: 'Tratamento Facial Premium',
      salon: 'Beauty Time Matola',
      bookings: 32,
      revenue: '8.6K MT',
      popularity: 65,
      icon: 'fas fa-spa',
      categoryColor: 'orange',
    },
    {
      id: 4,
      name: 'Barba e Bigode',
      salon: 'Beauty Time Maputo',
      bookings: 48,
      revenue: '3.8K MT',
      popularity: 72,
      icon: 'fas fa-user',
      categoryColor: 'teal',
    },
  ]);

  const serviceDetails = ref<ServiceDetail[]>([
    {
      id: 1,
      name: 'Corte de Cabelo Masculino',
      salon: 'Beauty Time Matola',
      bookings: 45,
      revenue: '6.8K MT',
      popularity: 85,
      rating: 4.8,
    },
    {
      id: 2,
      name: 'Manicure Completa',
      salon: 'Beauty Time Maputo',
      bookings: 32,
      revenue: '3.2K MT',
      popularity: 72,
      rating: 4.6,
    },
    {
      id: 3,
      name: 'Barba Premium',
      salon: 'Beauty Time Matola',
      bookings: 28,
      revenue: '2.2K MT',
      popularity: 68,
      rating: 4.7,
    },
    {
      id: 4,
      name: 'Limpeza de Pele',
      salon: 'Beauty Time Maputo',
      bookings: 25,
      revenue: '4.5K MT',
      popularity: 58,
      rating: 4.5,
    },
    {
      id: 5,
      name: 'Pedicure Completa',
      salon: 'Beauty Time Matola',
      bookings: 22,
      revenue: '2.6K MT',
      popularity: 63,
      rating: 4.4,
    },
  ]);

  // Options
  const periodOptions: FilterOption[] = [
    { label: 'Hoje', value: 'today' },
    { label: 'Últimos 7 dias', value: '7d' },
    { label: 'Últimos 30 dias', value: '30d' },
    { label: 'Este Mês', value: 'month' },
    { label: 'Este Ano', value: 'year' },
  ];

  const salonOptions: FilterOption[] = [
    { label: 'Todos os Salões', value: 'all' },
    { label: 'Beauty Time Matola', value: 'matola' },
    { label: 'Beauty Time Maputo', value: 'maputo' },
    { label: 'Beauty Time Costa do Sol', value: 'costa-sol' },
  ];

  const serviceOptions: FilterOption[] = [
    { label: 'Todos os Serviços', value: 'all' },
    { label: 'Cabelo', value: 'hair' },
    { label: 'Unhas', value: 'nails' },
    { label: 'Barba', value: 'beard' },
    { label: 'Pele', value: 'skin' },
    { label: 'Massagem', value: 'massage' },
  ];

  // Getters
  const getPerformanceColor = (performance: number): string => {
    if (performance >= 80) return 'positive';
    if (performance >= 60) return 'warning';
    return 'negative';
  };

  const getPopularityColor = (popularity: number): string => {
    if (popularity >= 80) return 'positive';
    if (popularity >= 60) return 'warning';
    return 'negative';
  };

  // Actions
  const updateFilters = (filters: {
    period?: FilterOption;
    salon?: FilterOption;
    service?: FilterOption;
  }) => {
    if (filters.period) selectedPeriod.value = filters.period;
    if (filters.salon) selectedSalon.value = filters.salon;
    if (filters.service) selectedService.value = filters.service;
  };

  const exportReportData = () => {
    return {
      period: selectedPeriod.value,
      salon: selectedSalon.value,
      service: selectedService.value,
      metrics: salonMetrics.value,
      serviceDetails: serviceDetails.value,
    };
  };

  return {
    // State
    selectedPeriod,
    selectedSalon,
    selectedService,
    salonMetrics,
    serviceMetrics,
    salonPerformance,
    profitableServices,
    serviceDetails,
    
    // Options
    periodOptions,
    salonOptions,
    serviceOptions,
    
    // Getters
    getPerformanceColor,
    getPopularityColor,
    
    // Actions
    updateFilters,
    exportReportData,
  };
});