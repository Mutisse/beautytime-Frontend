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
      <q-page padding class="page-with-footer">
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

    <!-- Menu de Rodapé para Mobile -->
    <FooterMenu v-if="$q.screen.lt.md" />

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
import { useQuasar } from 'quasar';
import { useAppStore } from '../../stores/dashboard-Store';
import { useAuthStore } from '../../stores/auth-store';

// Components - Agora dentro da pasta layout
import NavigationMenu from '../../components/client/layout/NavigationMenu.vue';
import AppHeader from '../../components/client/layout/AppHeader.vue';
import FooterMenu from '../../components/client/layout/FooterMenu.vue';
import WelcomeSection from '../../components/client/layout/dashboard/WelcomeSection.vue';
import StatusCards from '../../components/client/layout/dashboard/StatusCards.vue';
import NextAppointment from '../../components/client/layout/dashboard/NextAppointment.vue';
import ServicesSection from '../../components/client/layout/dashboard/ServicesSection.vue';
import PromotionsSection from '../../components/client/layout/dashboard/PromotionsSection.vue';
import FeedbackSection from '../../components/client/layout/dashboard/FeedbackSection.vue';
import RecentReviews from '../../components/client/layout/dashboard/RecentReviews.vue';

const $q = useQuasar();
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
    void store.loadUserData();
  }
});
</script>

<style scoped>
/* Ajustar padding para acomodar o footer em mobile */
.page-with-footer {
  padding-bottom: 70px !important;
}

/* Em telas maiores, remover o padding extra */
@media (min-width: 768px) {
  .page-with-footer {
    padding-bottom: 0 !important;
  }
}
</style>
