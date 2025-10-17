<!-- src/components/CustomerSegmentationChart.vue -->
<template>
  <div class="customer-segmentation">
    <div class="segmentation-placeholder">
      <q-icon name="pie_chart" size="3rem" color="#667eea" />
      <div class="placeholder-text">Segmentação de Clientes</div>
      <div class="placeholder-subtext">Dados de segmentação serão exibidos aqui</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CustomerSegment } from 'src/types/analytics';

interface Props {
  segments?: CustomerSegment[];
}

defineProps<Props>();
</script>

<style scoped lang="scss">
.customer-segmentation {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.segmentation-placeholder {
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
