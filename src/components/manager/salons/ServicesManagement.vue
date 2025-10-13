<template>
  <div class="reports-dashboard">
    <q-card class="header-card q-mb-lg">
      <q-card-section>
        <div class="text-h5 text-primary">Relatórios e Analytics</div>
        <div class="text-subtitle1 text-grey-7">
          Acompanhe métricas e desempenho dos seus salões e serviços
        </div>
      </q-card-section>
    </q-card>

    <!-- Filtros -->
    <q-card class="q-mb-lg">
      <q-card-section>
        <div class="row items-center q-col-gutter-md">
          <div class="col-12 col-sm-3">
            <q-select
              v-model="selectedPeriod"
              :options="periodOptions"
              label="Período"
              outlined
              dense
            />
          </div>
          <div class="col-12 col-sm-3">
            <q-select
              v-model="selectedSalon"
              :options="salonOptions"
              label="Salão"
              outlined
              dense
            />
          </div>
          <div class="col-12 col-sm-3">
            <q-select
              v-model="selectedService"
              :options="serviceOptions"
              label="Serviço"
              outlined
              dense
            />
          </div>
          <div class="col-12 col-sm-3">
            <q-btn
              color="primary"
              icon="fas fa-download"
              label="Exportar Relatório"
              class="full-width"
              @click="exportReport"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Métricas Principais -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-sm-3" v-for="metric in salonMetrics" :key="metric.id">
        <q-card class="metric-card">
          <q-card-section class="text-center">
            <q-icon :name="metric.icon" size="xl" :color="metric.color" class="q-mb-sm" />
            <div class="text-h4 text-weight-bold">{{ metric.value }}</div>
            <div class="text-caption text-grey-7">{{ metric.label }}</div>
            <q-badge :color="metric.trend > 0 ? 'positive' : 'negative'" class="q-mt-sm">
              <q-icon :name="metric.trend > 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'" />
              {{ Math.abs(metric.trend) }}%
            </q-badge>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Métricas de Serviços -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12">
        <div class="text-h6 q-mb-md">Desempenho por Serviço</div>
      </div>
      <div class="col-12 col-sm-2" v-for="serviceMetric in serviceMetrics" :key="serviceMetric.id">
        <q-card class="service-metric-card">
          <q-card-section class="text-center">
            <q-avatar :color="serviceMetric.color" text-color="white" class="q-mb-sm">
              <q-icon :name="serviceMetric.icon" />
            </q-avatar>
            <div class="text-h6 text-weight-bold">{{ serviceMetric.value }}</div>
            <div class="text-caption text-grey-7">{{ serviceMetric.name }}</div>
            <div class="text-caption text-green">{{ serviceMetric.revenue }}</div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Gráficos e Tabelas -->
    <div class="row q-col-gutter-md">
      <!-- Desempenho por Salão -->
      <div class="col-12 col-lg-6">
        <q-card>
          <q-card-section>
            <div class="text-h6">Desempenho por Salão</div>
            <div class="chart-placeholder">
              <q-list class="q-mt-md">
                <q-item v-for="salon in salonPerformance" :key="salon.id" class="q-my-xs">
                  <q-item-section avatar>
                    <q-avatar size="40px">
                      <img :src="salon.logo" :alt="salon.name" />
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ salon.name }}</q-item-label>
                    <q-linear-progress
                      :value="salon.performance / 100"
                      :color="getPerformanceColor(salon.performance)"
                      class="q-mt-xs"
                    />
                  </q-item-section>
                  <q-item-section side>
                    <div class="text-right">
                      <div class="text-weight-bold">{{ salon.revenue }}</div>
                      <div class="text-caption">{{ salon.appointments }} agend.</div>
                    </div>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Serviços Mais Populares -->
      <div class="col-12 col-lg-6">
        <q-card>
          <q-card-section>
            <div class="text-h6">Serviços Mais Rentáveis</div>
            <q-list separator>
              <q-item v-for="service in profitableServices" :key="service.id">
                <q-item-section avatar>
                  <q-avatar :color="service.categoryColor" text-color="white">
                    <q-icon :name="service.icon" />
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ service.name }}</q-item-label>
                  <q-item-label caption
                    >{{ service.salon }} • {{ service.bookings }} agendamentos</q-item-label
                  >
                </q-item-section>
                <q-item-section side>
                  <div class="text-right">
                    <div class="text-weight-bold text-green">{{ service.revenue }}</div>
                    <q-badge :color="service.popularity > 70 ? 'positive' : 'warning'">
                      {{ service.popularity }}%
                    </q-badge>
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Tabela Detalhada -->
    <div class="row q-mt-lg">
      <div class="col-12">
        <q-card>
          <q-card-section>
            <div class="text-h6">Relatório Detalhado de Serviços</div>
            <q-table :rows="serviceDetails" :columns="serviceColumns" row-key="id" flat bordered>
              <template v-slot:body-cell-popularity="props">
                <q-td :props="props">
                  <q-linear-progress
                    :value="props.row.popularity / 100"
                    :color="getPopularityColor(props.row.popularity)"
                    class="q-mt-xs"
                  />
                  <div class="text-caption text-center">{{ props.row.popularity }}%</div>
                </q-td>
              </template>

              <template v-slot:body-cell-actions="props">
                <q-td :props="props">
                  <q-btn
                    flat
                    round
                    icon="fas fa-chart-line"
                    color="primary"
                    size="sm"
                    @click="viewServiceAnalytics(props.row)"
                  />
                </q-td>
              </template>
            </q-table>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import type { QTableProps } from 'quasar';

// Interfaces
interface FilterOption {
  label: string;
  value: string;
}

interface SalonMetric {
  id: number;
  label: string;
  value: string;
  icon: string;
  color: string;
  trend: number;
}

interface ServiceMetric {
  id: number;
  name: string;
  value: string;
  revenue: string;
  icon: string;
  color: string;
}

interface SalonPerformance {
  id: number;
  name: string;
  logo: string;
  performance: number;
  revenue: string;
  appointments: number;
}

interface ProfitableService {
  id: number;
  name: string;
  salon: string;
  bookings: number;
  revenue: string;
  popularity: number;
  icon: string;
  categoryColor: string;
}

interface ServiceDetail {
  id: number;
  name: string;
  salon: string;
  bookings: number;
  revenue: string;
  popularity: number;
  rating: number;
}

const $q = useQuasar();

const selectedPeriod = ref<FilterOption>({ label: 'Últimos 30 dias', value: '30d' });
const selectedSalon = ref<FilterOption>({ label: 'Todos os Salões', value: 'all' });
const selectedService = ref<FilterOption>({ label: 'Todos os Serviços', value: 'all' });

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

// ✅ CORREÇÃO: Usar o tipo correto do Quasar diretamente
const serviceColumns: QTableProps['columns'] = [
  {
    name: 'service',
    label: 'Serviço',
    field: 'name',
    align: 'left',
    sortable: true,
  },
  {
    name: 'salon',
    label: 'Salão',
    field: 'salon',
    align: 'left',
    sortable: true,
  },
  {
    name: 'bookings',
    label: 'Agendamentos',
    field: 'bookings',
    align: 'center',
    sortable: true,
  },
  {
    name: 'revenue',
    label: 'Faturamento',
    field: 'revenue',
    align: 'center',
    sortable: true,
  },
  {
    name: 'popularity',
    label: 'Popularidade',
    field: 'popularity',
    align: 'center',
    sortable: true,
  },
  {
    name: 'rating',
    label: 'Avaliação',
    field: 'rating',
    align: 'center',
    sortable: true,
  },
  {
    name: 'actions',
    label: 'Ações',
    field: 'actions',
    align: 'center',
  },
];

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

const viewServiceAnalytics = (service: ServiceDetail): void => {
  $q.notify({
    message: `Analisando: ${service.name}`,
    color: 'info',
    position: 'top',
  });
};

const exportReport = (): void => {
  $q.notify({
    message: 'Relatório exportado com sucesso!',
    color: 'positive',
    position: 'top',
  });
};
</script>

<style lang="scss" scoped>
.reports-dashboard {
  .header-card {
    border-left: 4px solid $primary;
  }

  .metric-card {
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: $shadow-4;
    }
  }

  .service-metric-card {
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: $shadow-3;
    }
  }

  .chart-placeholder {
    min-height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
