<template>
  <q-card class="q-mb-lg">
    <q-card-section>
      <div class="text-h6">
        <q-icon name="trending_up" class="q-mr-sm" />
        Métricas Principais
      </div>
    </q-card-section>

    <q-card-section class="q-pt-none">
      <div class="row q-col-gutter-md">
        <!-- Métrica 1: Usuários -->
        <div class="col-12 col-sm-6 col-md-3">
          <MetricCard
            title="Usuários Registrados"
            :value="userCount"
            :change="12.5"
            icon="people"
            color="primary"
          />
        </div>

        <!-- Métrica 2: Salões -->
        <div class="col-12 col-sm-6 col-md-3">
          <MetricCard
            title="Salões Cadastrados"
            :value="15"
            :change="8.3"
            icon="store"
            color="positive"
          />
        </div>

        <!-- Métrica 3: Agendamentos -->
        <div class="col-12 col-sm-6 col-md-3">
          <MetricCard title="Agendamentos" :value="120" :change="-3.2" icon="event" color="info" />
        </div>

        <!-- Métrica 4: Pendências -->
        <div class="col-12 col-sm-6 col-md-3">
          <MetricCard title="Pendências" :value="4" :change="0" icon="warning" color="warning" />
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import MetricCard from './MetricCard.vue';

const userCount = ref(254);
</script>
