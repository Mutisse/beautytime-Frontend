<!-- src/components/RealTimeMetrics.vue -->
<template>
  <div class="real-time-metrics">
    <div class="metrics-grid">
      <div class="metric-item">
        <q-icon name="event_available" size="2rem" color="#4caf50" />
        <div class="metric-value">{{ data?.liveAppointments || 0 }}</div>
        <div class="metric-label">Agendamentos Hoje</div>
      </div>

      <div class="metric-item">
        <q-icon name="attach_money" size="2rem" color="#2196f3" />
        <div class="metric-value">{{ formatCurrency(data?.todayRevenue) }}</div>
        <div class="metric-label">Receita do Dia</div>
      </div>

      <div class="metric-item">
        <q-icon name="person" size="2rem" color="#ff9800" />
        <div class="metric-value">{{ data?.activeEmployees || 0 }}</div>
        <div class="metric-label">Funcionários Ativos</div>
      </div>
    </div>

    <!-- Status dos Serviços -->
    <div class="services-status" v-if="data?.systemHealth">
      <div class="status-title">Status dos Serviços</div>
      <div class="status-grid">
        <div
          v-for="(status, service) in data.systemHealth"
          :key="service"
          class="status-item"
          :class="{ 'status-up': status, 'status-down': !status }"
        >
          <q-icon
            :name="status ? 'check_circle' : 'error'"
            size="1rem"
            :color="status ? '#4caf50' : '#f44336'"
          />
          <span class="status-label">{{ formatServiceName(service) }}</span>
        </div>
      </div>
    </div>

    <div class="last-updated" v-if="data?.lastUpdated">
      Última atualização: {{ formatTime(data.lastUpdated) }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RealTimeMetrics } from 'src/types/analytics';

interface Props {
  data?: RealTimeMetrics;
}

defineProps<Props>();

const formatCurrency = (value: number = 0) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

const formatTime = (timestamp: string) => {
  return new Date(timestamp).toLocaleTimeString('pt-BR');
};

const formatServiceName = (service: string) => {
  const serviceNames: Record<string, string> = {
    users: 'Serviço de Usuários',
    salons: 'Serviço de Salões',
    appointments: 'Serviço de Agendamentos',
    payments: 'Serviço de Pagamentos',
    notifications: 'Serviço de Notificações',
  };
  return serviceNames[service] || service;
};
</script>

<style scoped lang="scss">
.real-time-metrics {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.metrics-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.metric-item {
  text-align: center;
  padding: 15px;
  background: rgba(248, 249, 250, 0.5);
  border-radius: 10px;
  border: 1px solid rgba(236, 240, 241, 0.5);

  .metric-value {
    font-size: 1.8rem;
    font-weight: 700;
    color: #2c3e50;
    margin: 8px 0;
  }

  .metric-label {
    font-size: 0.85rem;
    color: #7f8c8d;
    font-weight: 500;
  }
}

.services-status {
  margin-bottom: 15px;

  .status-title {
    font-size: 0.9rem;
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 10px;
  }

  .status-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }

  .status-item {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 0.8rem;

    &.status-up {
      background: rgba(76, 175, 80, 0.1);
      color: #4caf50;
    }

    &.status-down {
      background: rgba(244, 67, 54, 0.1);
      color: #f44336;
    }

    .status-label {
      margin-left: 8px;
      font-weight: 500;
    }
  }
}

.last-updated {
  text-align: center;
  font-size: 0.8rem;
  color: #bdc3c7;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid rgba(236, 240, 241, 0.5);
}

@media (max-width: 768px) {
  .metrics-grid {
    gap: 15px;
  }

  .metric-item {
    padding: 12px;
    
    .metric-value {
      font-size: 1.5rem;
    }
  }

  .status-grid {
    grid-template-columns: 1fr !important;
  }
}
</style>