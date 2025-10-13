<template>
  <q-layout view="hHh Lpr lFf" class="bg-grey-2">
    <!-- Header -->
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
       
        <q-toolbar-title>
          <div class="row items-center">
            <q-icon name="bar_chart" size="28px" class="q-mr-sm" />
            Painel Administrativo
          </div>
        </q-toolbar-title>

        <div class="system-status q-mr-md">
          <q-badge color="positive" rounded>
            <q-icon name="circle" size="8px" class="q-mr-xs" />
            Sistema Online
          </q-badge>
        </div>

        <q-btn flat round dense icon="notifications">
          <q-badge color="red" floating transparent>3</q-badge>
        </q-btn>

        <q-btn flat round dense>
          <q-avatar size="42px">
            <q-icon name="account_circle" size="42px" />
            <q-badge floating rounded color="positive" />
          </q-avatar>

          <q-menu>
            <q-list style="min-width: 200px">
              <q-item-label header>Administrador Silva</q-item-label>
              <q-separator />
              <q-item clickable v-close-popup>
                <q-item-section avatar>
                  <q-icon name="account_circle" />
                </q-item-section>
                <q-item-section>Meu Perfil</q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="handleLogout">
                <q-item-section avatar>
                  <q-icon name="logout" />
                </q-item-section>
                <q-item-section>Sair</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <!-- Sidebar Esquerdo -->
    
    <!-- Conteúdo Principal - COM OS COMPONENTES DIRETAMENTE -->
    <q-page-container>
      <div class="q-pa-md">
        <div class="text-h4 q-mb-md">Visão Geral</div>

        <!-- Metrics Section -->
        <MetricsSection />
        <div class="row q-mt-md">
          <!-- Quick Actions Section -->
          <div class="col-12 col-md-8 q-pr-md">
            <QuickActionsSection />
          </div>

          <!-- Activity Section -->
          <div class="col-12 col-md-4">
            <ActivitySection />
          </div>
        </div>
        <!-- Charts Section -->
        <ChartsSection class="q-mt-md" />
        <!-- Fim dos Componentes DIRETAMENTE -->
        <Estatisticas class="q-mt-md" />
      </div>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useAuthStore } from '../../stores/auth-store';

// Importar os componentes DIRECTAMENTE aqui
import ActivitySection from '../../components/admin/ActivitySection.vue';
import ChartsSection from '../../components/admin/ChartsSection.vue';
import MetricsSection from '../../components/admin/MetricsSection.vue';
import QuickActionsSection from '../../components/admin/QuickActionsSection.vue';
import Estatisticas  from '../../components/admin/AdminEstatisticas.vue';


const router = useRouter();
const $q = useQuasar();
const authStore = useAuthStore();

async function handleLogout(): Promise<void> {
  try {
    await authStore.logout();
    await router.push('/auth');
    $q.notify({
      type: 'positive',
      message: 'Logout realizado com sucesso!',
      timeout: 2000,
    });
  } catch (error) {
    console.error('Logout error in component:', error);
    $q.notify({
      type: 'negative',
      message: 'Erro ao fazer logout. Tente novamente.',
      timeout: 3000,
    });
  }
}
</script>

<style scoped>
.active-menu {
  background-color: #e3f2fd;
  color: #1976d2;
  border-right: 3px solid #1976d2;
}

.system-status {
  font-size: 0.875rem;
}
</style>
