<!-- components/client/layout/FooterMenu.vue -->
<template>
  <q-footer elevated class="bg-white text-primary footer-menu">
    <div class="text-center q-py-sm bg-yellow-2 text-red">
      ⚠️ RODAPÉ VISÍVEL - Tamanho da tela: {{ $q.screen.name }}
    </div>

    <q-tabs
      v-model="selectedTab"
      active-color="primary"
      indicator-color="primary"
      class="text-grey-8"
      dense
    >
      <!-- Agendar Rápido -->
      <q-route-tab name="quick-book" icon="add_circle" :to="{ name: 'quick-booking' }" exact>
        <div class="column items-center q-py-xs">
          <q-icon name="add_circle" size="24px" color="positive" />
          <div class="text-caption q-mt-xs">Agendar</div>
        </div>
      </q-route-tab>

      <!-- Salões Próximos -->
      <q-route-tab name="nearby" icon="location_on" :to="{ name: 'saloes-proximos' }" exact>
        <div class="column items-center q-py-xs">
          <q-icon name="location_on" size="20px" color="primary" />
          <div class="text-caption q-mt-xs">Salões</div>
        </div>
      </q-route-tab>

      <!-- Agendamentos -->
      <q-route-tab name="appointments" icon="event" :to="{ name: 'meus-agendamentos' }" exact>
        <div class="column items-center q-py-xs">
          <q-badge v-if="upcomingAppointmentsCount > 0" color="blue" floating rounded>
            {{ upcomingAppointmentsCount }}
          </q-badge>
          <q-icon name="event" size="20px" color="blue" />
          <div class="text-caption q-mt-xs">Agendamentos</div>
        </div>
      </q-route-tab>

      <!-- Favoritos -->
      <q-route-tab name="favorites" icon="favorite" :to="{ name: 'favoritos' }" exact>
        <div class="column items-center q-py-xs">
          <q-icon name="favorite" size="20px" color="red" />
          <div class="text-caption q-mt-xs">Favoritos</div>
        </div>
      </q-route-tab>

      <!-- Perfil -->
      <q-route-tab name="profile" icon="person" :to="{ name: 'perfil' }" exact>
        <div class="column items-center q-py-xs">
          <q-icon name="person" size="20px" color="grey-7" />
          <div class="text-caption q-mt-xs">Perfil</div>
        </div>
      </q-route-tab>
    </q-tabs>
  </q-footer>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useAppStore } from '../../../stores/dashboard-Store';

const $q = useQuasar();
const store = useAppStore();
const selectedTab = ref('home');

// Apenas propriedades que EXISTEM na store
const upcomingAppointmentsCount = computed(() => {
  return store.upcomingAppointments?.length || 0;
});

onMounted(() => {
  console.log('🔍 FooterMenu montado - Tamanho da tela:', $q.screen.name);
  console.log('🔍 Screen lt.md:', $q.screen.lt.md);
  console.log('🔍 Screen lt.lg:', $q.screen.lt.lg);
});
</script>

<style scoped>
.footer-menu {
  border-top: 1px solid #e0e0e0;
  height: 70px; /* Aumentei um pouco para melhor visualização */
}

:deep(.q-tabs) {
  min-height: 70px;
  height: 70px;
}

:deep(.q-tab) {
  min-height: 70px;
  padding: 6px 8px;
}

:deep(.q-tab__icon) {
  margin-bottom: 2px;
  font-size: 20px;
}

:deep(.q-tab__indicator) {
  height: 3px;
}

:deep(.text-caption) {
  font-size: 11px;
  line-height: 1.2;
  font-weight: 500;
}
</style>
