<!-- src/components/EmployeePerformanceTable.vue -->
<template>
  <div class="employee-performance">
    <div class="performance-placeholder">
      <q-icon name="groups" size="3rem" color="#667eea" />
      <div class="placeholder-text">Performance dos Funcionários</div>
      <div class="placeholder-subtext">Top performers serão exibidos aqui</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { EmployeePerformance } from 'src/types/analytics';

interface Props {
  employees?: EmployeePerformance[];
}

defineProps<Props>();
</script>

<style scoped lang="scss">
.employee-performance {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.performance-placeholder {
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