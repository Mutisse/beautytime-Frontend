<template>
  <q-tabs
    v-model="activeTab"
    dense
    class="bg-white text-primary q-mb-lg"
    active-color="primary"
    indicator-color="primary"
    align="justify"
    narrow-indicator
  >
    <q-tab
      v-for="tab in tabs"
      :key="tab.name"
      :name="tab.name"
      :icon="tab.icon"
      :label="tab.label"
    />
  </q-tabs>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const activeTab = ref('agenda');

const tabs = [
  { name: 'agenda', icon: 'event', label: 'Agenda' },
  { name: 'pending', icon: 'schedule', label: 'Pendentes' },
  { name: 'clients', icon: 'people', label: 'Clientes' },
  { name: 'stats', icon: 'analytics', label: 'Estatísticas' },
  { name: 'materials', icon: 'inventory', label: 'Materiais' },
];
</script>
