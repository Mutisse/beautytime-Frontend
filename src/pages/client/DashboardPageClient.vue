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

          <!-- Menu de Navegação -->
          <NavigationMenu />
        </div>
      </q-scroll-area>
    </q-drawer>

    <!-- Layout Principal -->
    <q-page-container>
      <q-page padding>
        <!-- Topbar -->
        <AppHeader
          :left-drawer-open="leftDrawerOpen"
          @toggle-drawer="leftDrawerOpen = !leftDrawerOpen"
        />

        <!-- Loading State -->
        <div v-if="store.loading" class="text-center q-pa-xl">
          <q-spinner-gears size="xl" color="primary" />
          <div class="q-mt-md">Carregando dados...</div>
        </div>

        <!-- Error State -->
        <div v-else-if="store.error" class="text-center q-pa-xl">
          <q-icon name="error" size="xl" color="negative" />
          <div class="q-mt-md">{{ store.error }}</div>
          <q-btn
            class="q-mt-md"
            color="primary"
            label="Tentar Novamente"
            @click="handleReloadData"
          />
        </div>

        <!-- Conteúdo Principal -->
        <div v-else class="q-pt-xl q-px-md">
          <!-- Seção de Boas-vindas -->
          <WelcomeSection />

          <!-- Cards de Status -->
          <StatusCards />

          <!-- Próximo Agendamento -->
          <NextAppointment />

          <!-- Seção de Serviços -->
          <ServicesSection />

          <!-- Seção de Promoções -->
          <PromotionsSection />

          <!-- Seção de Feedback -->
          <FeedbackSection v-if="store.isClient" />
        </div>
      </q-page>
    </q-page-container>

    <!-- Sidebar Direito (Avaliações Recentes) -->
    <q-drawer
      v-model="rightDrawerOpen"
      side="right"
      :width="300"
      :breakpoint="700"
      bordered
      show-if-above
    >
      <RecentReviews />
    </q-drawer>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAppStore } from '../../stores/dashboard-Store';
import { useAuthStore } from '../../stores/auth-store';

// Components
import NavigationMenu from '../../components/client/layout/NavigationMenu.vue';
import AppHeader from '../../components/client/layout/AppHeader.vue';
import WelcomeSection from '../../components/client/dashboard/WelcomeSection.vue';
import StatusCards from '../../components/client/dashboard/StatusCards.vue';
import NextAppointment from '../../components/client/dashboard/NextAppointment.vue';
import ServicesSection from '../../components/client/dashboard/ServicesSection.vue';
import PromotionsSection from '../../components/client/dashboard/PromotionsSection.vue';
import FeedbackSection from '../../components/client/dashboard/FeedbackSection.vue';
import RecentReviews from '../../components/client/dashboard/RecentReviews.vue';

const store = useAppStore();
const authStore = useAuthStore();
const leftDrawerOpen = ref(false);
const rightDrawerOpen = ref(true);

const handleReloadData = async (): Promise<void> => {
  try {
    await store.loadUserData();
  } catch (error) {
    console.error('Erro ao recarregar dados:', error);
  }
};

onMounted(() => {
  // Carregar dados apenas se o usuário estiver autenticado
  if (authStore.isAuthenticated) {
    void store.loadUserData(); // Adicionar 'void' para evitar floating promise
  }
});
</script>
