<!-- src/components/RevenueChart.vue -->
<template>
  <div class="revenue-chart">
    <div class="chart-placeholder">
      <q-icon name="bar_chart" size="3rem" color="#667eea" />
      <div class="placeholder-text">Gráfico de Receita</div>
      <div class="placeholder-subtext">Dados de tendência de receita serão exibidos aqui</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RevenueTrend } from 'src/types/analytics';

interface Props {
  data?: RevenueTrend[];
}

defineProps<Props>();
</script>

<style scoped lang="scss">
.revenue-chart {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-placeholder {
  text-align: center;
  color: #7f8c8d;

  .placeholder-text {
    font-size: 1.1rem;
    font-weight: 600;
    margin-top: 10px;
    color: #2c3e50;
  }

  .placeholder-subtext {
    font-size: 0.9rem;
    margin-top: 5px;
    opacity: 0.7;
  }
}
</style>
