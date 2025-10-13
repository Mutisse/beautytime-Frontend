<template>
  <q-card>
    <q-card-section>
      <div class="text-h6">
        <q-icon name="pie_chart" class="q-mr-sm" />
        Estatísticas
      </div>
    </q-card-section>

    <q-card-section class="q-pt-none">
      <div class="row q-col-gutter-md">
        <!-- Estatísticas com QLinearProgress -->
        <div class="col-12 col-md-6">
          <q-card flat bordered>
            <q-card-section>
              <div class="text-subtitle2">Taxa de Conversão</div>
            </q-card-section>
            <q-card-section class="q-pt-none">
              <div class="q-gutter-md">
                <div v-for="stat in conversionStats" :key="stat.label" class="q-mb-md">
                  <div class="row items-center justify-between q-mb-xs">
                    <span class="text-caption">{{ stat.label }}</span>
                    <span class="text-weight-medium">{{ stat.value }}%</span>
                  </div>
                  <q-linear-progress
                    :value="stat.value / 100"
                    :color="stat.color"
                    size="12px"
                    rounded
                  />
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Estatísticas com QCircularProgress -->
        <div class="col-12 col-md-6">
          <q-card flat bordered>
            <q-card-section>
              <div class="text-subtitle2">Performance do Sistema</div>
            </q-card-section>
            <q-card-section class="q-pt-none">
              <div class="row justify-around items-center">
                <div v-for="metric in performanceMetrics" :key="metric.label" class="text-center">
                  <q-circular-progress
                    :model-value="metric.value"
                    :color="metric.color"
                    :center-color="metric.centerColor || 'grey-2'"
                    size="80px"
                    :thickness="0.2"
                    show-value
                    class="q-ma-md"
                  >
                    {{ metric.value }}%
                  </q-circular-progress>
                  <div class="text-caption text-grey-8">{{ metric.label }}</div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Estatísticas com QKnob -->
        <div class="col-12 col-md-6">
          <q-card flat bordered>
            <q-card-section>
              <div class="text-subtitle2">Uso de Recursos</div>
            </q-card-section>
            <q-card-section class="q-pt-none">
              <div class="row justify-around items-center">
                <div v-for="resource in resourceUsage" :key="resource.label" class="text-center">
                  <q-knob
                    v-model="resource.value"
                    :color="resource.color"
                    size="70px"
                    :thickness="0.3"
                    track-color="grey-3"
                    class="q-ma-sm"
                    readonly
                  />
                  <div class="text-caption text-grey-8">{{ resource.label }}</div>
                  <div class="text-caption text-weight-medium">{{ resource.value }}%</div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Estatísticas com QRating (para visualização) -->
        <div class="col-12 col-md-6">
          <q-card flat bordered>
            <q-card-section>
              <div class="text-subtitle2">Satisfação do Usuário</div>
            </q-card-section>
            <q-card-section class="q-pt-none">
              <div class="q-gutter-y-md">
                <div
                  v-for="rating in userSatisfaction"
                  :key="rating.category"
                  class="row items-center"
                >
                  <div class="col-5">
                    <span class="text-caption">{{ rating.category }}</span>
                  </div>
                  <div class="col-7">
                    <q-rating v-model="rating.score" :max="5" size="20px" color="orange" readonly />
                    <span class="text-caption text-grey-7 q-ml-sm">({{ rating.score }}/5)</span>
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const conversionStats = ref([
  { label: 'Taxa de Registro', value: 75, color: 'primary' },
  { label: 'Taxa de Conversão', value: 45, color: 'positive' },
  { label: 'Retenção', value: 60, color: 'info' },
  { label: 'Churn Rate', value: 15, color: 'warning' },
]);

const performanceMetrics = ref([
  { label: 'CPU', value: 65, color: 'primary', centerColor: 'blue-1' },
  { label: 'Memória', value: 45, color: 'positive', centerColor: 'green-1' },
  { label: 'Disco', value: 30, color: 'info', centerColor: 'cyan-1' },
  { label: 'Rede', value: 55, color: 'warning', centerColor: 'orange-1' },
]);

const resourceUsage = ref([
  { label: 'Armazenamento', value: 70, color: 'primary' },
  { label: 'Largura de Banda', value: 45, color: 'positive' },
  { label: 'Processamento', value: 60, color: 'info' },
]);

const userSatisfaction = ref([
  { category: 'Usabilidade', score: 4.5 },
  { category: 'Desempenho', score: 4.2 },
  { category: 'Suporte', score: 4.7 },
  { category: 'Funcionalidades', score: 4.3 },
]);
</script>

<style scoped>
.q-card {
  border-radius: 12px;
}

.text-subtitle2 {
  font-weight: 600;
  color: #1e293b;
}
</style>
