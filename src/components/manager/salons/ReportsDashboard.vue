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
              v-model="reportsStore.selectedPeriod"
              :options="reportsStore.periodOptions"
              label="Período"
              outlined
              dense
            />
          </div>
          <div class="col-12 col-sm-3">
            <q-select
              v-model="reportsStore.selectedSalon"
              :options="reportsStore.salonOptions"
              label="Salão"
              outlined
              dense
            />
          </div>
          <div class="col-12 col-sm-3">
            <q-select
              v-model="reportsStore.selectedService"
              :options="reportsStore.serviceOptions"
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
      <div class="col-12 col-sm-3" v-for="metric in reportsStore.salonMetrics" :key="metric.id">
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
      <div
        class="col-12 col-sm-2"
        v-for="serviceMetric in reportsStore.serviceMetrics"
        :key="serviceMetric.id"
      >
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
                <q-item
                  v-for="salon in reportsStore.salonPerformance"
                  :key="salon.id"
                  class="q-my-xs"
                >
                  <q-item-section avatar>
                    <q-avatar size="40px">
                      <img :src="salon.logo" :alt="salon.name" />
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ salon.name }}</q-item-label>
                    <q-linear-progress
                      :value="salon.performance / 100"
                      :color="reportsStore.getPerformanceColor(salon.performance)"
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
              <q-item v-for="service in reportsStore.profitableServices" :key="service.id">
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
            <q-table
              :rows="reportsStore.serviceDetails"
              :columns="serviceColumns"
              row-key="id"
              flat
              bordered
            >
              <template v-slot:body-cell-popularity="props">
                <q-td :props="props">
                  <q-linear-progress
                    :value="props.row.popularity / 100"
                    :color="reportsStore.getPopularityColor(props.row.popularity)"
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
import { useQuasar } from 'quasar';
import type { QTableProps } from 'quasar';
import { useReportsStore } from '../../../stores/reports-store';
import type { ServiceDetail } from '../../../types/reports-types';

const $q = useQuasar();
const reportsStore = useReportsStore();

// ✅ CORREÇÃO: Removido tipo ServiceColumn não utilizado
// Usar diretamente o tipo do Quasar para as colunas
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
    color: $grey-6;
    font-style: italic;
  }

  // Responsividade
  @media (max-width: 768px) {
    .metric-card,
    .service-metric-card {
      margin-bottom: 16px;
    }
  }

  @media (max-width: 480px) {
    .header-card {
      .text-h5 {
        font-size: 1.5rem;
      }

      .text-subtitle1 {
        font-size: 0.9rem;
      }
    }
  }
}
</style>
