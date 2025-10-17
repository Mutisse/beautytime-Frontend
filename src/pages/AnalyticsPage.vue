<!-- src/pages/AnalyticsPage.vue -->
<template>
  <q-page class="analytics-page">
    <AnalyticsDashboard />
  </q-page>
</template>

<script setup lang="ts">
import AnalyticsDashboard from 'src/components/AnalyticsDashboard.vue';
</script>

<style scoped lang="scss">
.analytics-page {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}
</style>