// src/stores/analytics-store.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { DashboardData, RealTimeMetrics } from 'src/types/analytics'; // ✅ Importar RealTimeMetrics

export const useAnalyticsStore = defineStore('analytics', () => {
  const dashboardData = ref<DashboardData | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Computed properties para facilitar o acesso
  const overview = computed(() => dashboardData.value?.overview);
  const realTime = computed(() => dashboardData.value?.realTime);
  const financial = computed(() => dashboardData.value?.financial);
  const operational = computed(() => dashboardData.value?.operational);
  const customers = computed(() => dashboardData.value?.customers);
  const intelligence = computed(() => dashboardData.value?.intelligence);
  const alerts = computed(() => dashboardData.value?.alerts);

  async function fetchDashboard(salonId?: string) {
    loading.value = true;
    error.value = null;

    try {
      const params = salonId ? `?salonId=${salonId}` : '';
      const response = await fetch(`http://localhost:3004/api/analytics/dashboard${params}`);

      if (!response.ok) {
        throw new Error(`Erro ao buscar dados: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.success) {
        dashboardData.value = result.data;
      } else {
        throw new Error(result.error || 'Erro desconhecido');
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro ao carregar dados';
      console.error('Erro no Analytics Store:', err);
    } finally {
      loading.value = false;
    }
  }

  async function fetchBusinessIntelligence(salonId: string) {
    try {
      const response = await fetch(
        `http://localhost:3004/api/analytics/business-intelligence?salonId=${salonId}`,
      );
      const result = await response.json();
      return result.data;
    } catch (err) {
      console.error('Erro ao buscar business intelligence:', err);
      throw err;
    }
  }

  async function fetchRealTimeMetrics(): Promise<RealTimeMetrics> {
    try {
      const response = await fetch('http://localhost:3004/api/analytics/real-time-metrics');
      const result = await response.json();
      return result.data;
    } catch (err) {
      console.error('Erro ao buscar métricas em tempo real:', err);
      throw err;
    }
  }

  return {
    dashboardData,
    loading,
    error,
    overview,
    realTime,
    financial,
    operational,
    customers,
    intelligence,
    alerts,
    fetchDashboard,
    fetchBusinessIntelligence,
    fetchRealTimeMetrics,
  };
});
