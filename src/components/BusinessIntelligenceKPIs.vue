<!-- src/components/BusinessIntelligenceKPIs.vue -->
<template>
  <div class="bi-kpis">
    <div class="kpi-grid">
      <div class="kpi-item">
        <div class="kpi-label">CLV</div>
        <div class="kpi-value">{{ formatCurrency(kpis?.customerLifetimeValue) }}</div>
        <div class="kpi-description">Customer Lifetime Value</div>
      </div>

      <div class="kpi-item">
        <div class="kpi-label">Churn Rate</div>
        <div class="kpi-value">{{ kpis?.churnRate?.toFixed(1) }}%</div>
        <div class="kpi-description">Taxa de Cancelamento</div>
      </div>

      <div class="kpi-item">
        <div class="kpi-label">CAC</div>
        <div class="kpi-value">{{ formatCurrency(kpis?.acquisitionCost) }}</div>
        <div class="kpi-description">Custo de Aquisição</div>
      </div>

      <div class="kpi-item">
        <div class="kpi-label">Produtividade</div>
        <div class="kpi-value">{{ kpis?.employeeProductivity?.toFixed(1) }}</div>
        <div class="kpi-description">Apps/Funcionário</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BusinessIntelligence } from '../types/analytics';

interface Props {
  kpis?: BusinessIntelligence['kpis'];
}

defineProps<Props>();

const formatCurrency = (value: number = 0) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};
</script>

<style scoped lang="scss">
.bi-kpis {
  height: 100%;
}

.kpi-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.kpi-item {
  text-align: center;
  padding: 15px;
  background: rgba(248, 249, 250, 0.5);
  border-radius: 8px;
  border: 1px solid rgba(236, 240, 241, 0.5);

  .kpi-label {
    font-size: 0.75rem;
    font-weight: 600;
    color: #7f8c8d;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .kpi-value {
    font-size: 1.3rem;
    font-weight: 700;
    color: #2c3e50;
    margin: 5px 0;
  }

  .kpi-description {
    font-size: 0.7rem;
    color: #bdc3c7;
  }
}

@media (max-width: 768px) {
  .kpi-grid {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .kpi-item {
    padding: 12px;
    
    .kpi-value {
      font-size: 1.1rem;
    }
  }
}
</style>