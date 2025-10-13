<template>
  <q-card>
    <q-card-section>
      <div class="text-h6">Análises e Estatísticas</div>
    </q-card-section>

    <q-card-section class="q-pt-none">
      <div class="row q-col-gutter-md">
        <div class="col-12">
          <div class="text-subtitle2 q-mb-sm">Receita Semanal</div>
          <div class="chart-placeholder bg-grey-3 rounded-borders q-pa-md text-center">
            <q-icon name="bar_chart" size="xl" color="grey-5" />
            <div class="text-caption text-grey-7 q-mt-sm">Gráfico de Receita</div>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <div class="text-subtitle2 q-mb-sm">Serviços Mais Populares</div>
          <div class="chart-placeholder bg-grey-3 rounded-borders q-pa-md text-center">
            <q-icon name="pie_chart" size="xl" color="grey-5" />
            <div class="text-caption text-grey-7 q-mt-sm">Gráfico de Serviços</div>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <div class="text-subtitle2 q-mb-sm">Satisfação do Cliente</div>
          <div class="chart-placeholder bg-grey-3 rounded-borders q-pa-md text-center">
            <q-icon name="show_chart" size="xl" color="grey-5" />
            <div class="text-caption text-grey-7 q-mt-sm">Gráfico de Satisfação</div>
          </div>
        </div>
      </div>
    </q-card-section>

    <q-card-actions align="right">
      <q-btn flat color="primary" label="Ver relatórios completos" no-caps @click="goToReports" />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

function goToReports(): void {
  void router.push('/manager/reports');
}
</script>

<style scoped>
.chart-placeholder {
  height: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
