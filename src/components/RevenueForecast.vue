<!-- src/components/RevenueForecast.vue -->
<template>
  <div class="revenue-forecast">
    <div class="forecast-placeholder">
      <q-icon name="trending_up" size="3rem" color="#667eea" />
      <div class="placeholder-text">Previsões de Receita</div>
      <div class="placeholder-subtext">Projeções futuras serão exibidas aqui</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RevenueProjection } from 'src/types/analytics';

interface Props {
  projections?: RevenueProjection[];
}

defineProps<Props>();
</script>

<style scoped lang="scss">
.revenue-forecast {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.forecast-placeholder {
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