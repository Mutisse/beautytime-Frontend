<template>
  <q-layout view="hHh Lpr lff" class="bg-grey-2">
    <!-- Sidebar Esquerdo -->
    <q-drawer v-model="leftDrawerOpen" :width="280" :breakpoint="700" bordered show-if-above>
      <q-scroll-area class="fit">
        <div class="q-pa-md">
          <!-- Logo -->
          <div class="row items-center q-mb-md">
            <div class="col">
              <div class="row items-center">
                <q-icon name="spa" size="xl" color="primary" />
                <span class="text-h6 text-weight-bold q-ml-sm">BeautyTime</span>
              </div>
            </div>
            <div class="col-auto">
              <q-btn flat round dense icon="chevron_left" @click="leftDrawerOpen = false" />
            </div>
          </div>

          <!-- Menu de Navegação para Manager -->
          <ManagerNavigationMenu />
        </div>
      </q-scroll-area>
    </q-drawer>

    <!-- Layout Principal -->
    <q-page-container>
      <q-page padding>
        <!-- Topbar -->
        <ManagerHeader
          :left-drawer-open="leftDrawerOpen"
          @toggle-drawer="leftDrawerOpen = !leftDrawerOpen"
        />

        <!-- Conteúdo do Dashboard -->
        <div class="q-pt-xl q-px-md">
          <!-- Seção de Métricas -->
          <ManagerMetricsSection />

          <!-- Ações Rápidas -->
          <QuickActionsSection />

          <!-- Seção Dupla (Agendamentos e Equipe) -->
          <div class="row q-col-gutter-lg q-mb-lg">
            <div class="col-12 col-md-6">
              <RecentBookingsSection />
            </div>
            <div class="col-12 col-md-6">
              <TeamHighlightSection />
            </div>
          </div>

          <!-- Feedback e Análises -->
          <div class="row q-col-gutter-lg q-mb-lg">
            <div class="col-12 col-md-6">
              <CustomerFeedbackSection />
            </div>
            <div class="col-12 col-md-6">
              <ChartsDashboardSection />
            </div>
          </div>

          <!-- Estoque Crítico -->
          <CriticalInventorySection />
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ManagerNavigationMenu from '../../components/manager/ManagerNavigationMenu.vue';
import ManagerHeader from '../../components/manager/ManagerHeader.vue';
import ManagerMetricsSection from '../../components/manager/ManagerMetricsSection.vue';
import QuickActionsSection from '../../components/manager/QuickActionsSection.vue';
import RecentBookingsSection from '../../components/manager/RecentBookingsSection.vue';
import TeamHighlightSection from '../../components/manager/TeamHighlightSection.vue';
import CustomerFeedbackSection from '../../components/manager/CustomerFeedbackSection.vue';
import ChartsDashboardSection from '../../components/manager/ChartsDashboardSection.vue';
import CriticalInventorySection from '../../components/manager/CriticalInventorySection.vue';

const leftDrawerOpen = ref(false);
</script>
