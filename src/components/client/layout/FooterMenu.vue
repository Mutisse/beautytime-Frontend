<!-- components/client/layout/FooterMenu.vue -->
<template>
  <q-footer elevated class="bg-white text-primary footer-menu">
    <q-tabs
      v-model="selectedTab"
      active-color="primary"
      indicator-color="primary"
      class="text-grey-8 footer-tabs"
      dense
    >
      <!-- Agendar Rápido -->
      <q-route-tab
        name="quick-book"
        icon="add_circle"
        :to="{ name: 'novo-agendamento' }"
        exact
      >
        <div class="column items-center q-py-xs">
          <q-icon name="add_circle" size="24px" color="positive" />
          <div class="text-caption q-mt-xs">Agendar</div>
        </div>
      </q-route-tab>

      <!-- Salões Próximos -->
      <q-route-tab
        name="nearby"
        icon="location_on"
        :to="{ name: 'saloes-proximos' }"
        exact
      >
        <div class="column items-center q-py-xs">
          <q-icon name="location_on" size="20px" color="primary" />
          <div class="text-caption q-mt-xs">Salões</div>
        </div>
      </q-route-tab>

      <!-- Agendamentos -->
      <q-route-tab
        name="appointments"
        icon="event"
        :to="{ name: 'proximos-agendamentos' }"
        exact
      >
        <div class="column items-center q-py-xs">
          <q-badge
            v-if="upcomingAppointmentsCount > 0"
            color="blue"
            floating
            rounded
          >
            {{ upcomingAppointmentsCount }}
          </q-badge>
          <q-icon name="event" size="20px" color="blue" />
          <div class="text-caption q-mt-xs">Agendamentos</div>
        </div>
      </q-route-tab>

      <!-- Favoritos -->
      <q-route-tab
        name="favorites"
        icon="favorite"
        :to="{ name: 'saloes-favoritos' }"
        exact
      >
        <div class="column items-center q-py-xs">
          <q-icon name="favorite" size="20px" color="red" />
          <div class="text-caption q-mt-xs">Favoritos</div>
        </div>
      </q-route-tab>

      <!-- Perfil -->
      <q-route-tab
        name="profile"
        icon="person"
        :to="{ name: 'client-profile' }"
        exact
      >
        <div class="column items-center q-py-xs">
          <q-icon name="person" size="20px" color="grey-7" />
          <div class="text-caption q-mt-xs">Perfil</div>
        </div>
      </q-route-tab>
    </q-tabs>
  </q-footer>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAppStore } from '../../../stores/dashboard-Store';

const store = useAppStore();
const selectedTab = ref('home');

// Apenas propriedades que EXISTEM na store
const upcomingAppointmentsCount = computed(() => {
  return store.upcomingAppointments?.length || 0;
});
</script>

<style scoped>
.footer-menu {
  border-top: 1px solid #e0e0e0;
  height: 70px;
  position: fixed !important;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
}

/* Garantir que as tabs ocupem todo o espaço */
:deep(.footer-tabs) {
  min-height: 70px;
  height: 70px;
  width: 100%;
}

:deep(.footer-tabs .q-tab) {
  min-height: 70px;
  padding: 6px 8px;
  flex: 1;
  max-width: none;
}

:deep(.footer-tabs .q-tab__icon) {
  margin-bottom: 2px;
  font-size: 20px;
}

:deep(.footer-tabs .q-tab__indicator) {
  height: 3px;
}

:deep(.footer-tabs .text-caption) {
  font-size: 11px;
  line-height: 1.2;
  font-weight: 500;
}

/* Ajustar o badge de notificação */
:deep(.q-badge--floating) {
  top: 8px;
  right: 50%;
  transform: translateX(50%);
}
</style>