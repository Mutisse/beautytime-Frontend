<template>
  <q-card>
    <q-card-section>
      <div class="text-h6">Estatísticas Diárias</div>
    </q-card-section>

    <q-card-section class="q-pt-none">
      <div class="row q-col-gutter-md q-mb-md">
        <div class="col-6 col-sm-3" v-for="stat in stats" :key="stat.label">
          <q-card flat bordered>
            <q-card-section class="text-center">
              <div class="text-h6">{{ stat.value }}</div>
              <div class="text-caption">{{ stat.label }}</div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <div class="text-subtitle2 q-mb-sm">Horários Mais Ocupados</div>
      <div class="chart-container bg-grey-2 rounded-borders q-pa-md">
        <div class="row items-end justify-around" style="height: 150px">
          <div v-for="hour in peakHours" :key="hour.time" class="chart-bar text-center">
            <div
              class="bg-primary rounded-tops"
              :style="{ height: `${hour.percentage}%` }"
              style="width: 30px"
            ></div>
            <div class="text-caption q-mt-xs">{{ hour.time }}</div>
            <div class="text-caption text-weight-bold">{{ hour.count }}</div>
          </div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { StatItem, PeakHour } from '../../types/staff-Type';

const stats = ref<StatItem[]>([
  { label: 'Total de Marcações', value: 12 },
  { label: 'Confirmadas', value: 8 },
  { label: 'Em Atendimento', value: 2 },
  { label: 'Concluídas', value: 6 },
]);

const peakHours = ref<PeakHour[]>([]);

onMounted(() => {
  // Simular dados
  peakHours.value = [
    { time: '09:00', count: 3, percentage: 60 },
    { time: '10:00', count: 5, percentage: 100 },
    { time: '11:00', count: 4, percentage: 80 },
    { time: '14:00', count: 2, percentage: 40 },
    { time: '15:00', count: 3, percentage: 60 },
  ];
});
</script>

<style scoped>
.chart-bar {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.rounded-tops {
  border-radius: 4px 4px 0 0;
}
</style>
