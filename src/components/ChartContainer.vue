<!-- src/components/ChartContainer.vue -->
<template>
  <div class="chart-container">
    <div class="chart-container__header">
      <h3>{{ title }}</h3>
      <slot name="actions"></slot>
    </div>
    <div class="chart-container__content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string;
}

defineProps<Props>();
</script>
