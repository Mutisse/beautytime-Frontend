<template>
  <q-card>
    <q-card-section>
      <div class="text-h6">Clientes Atendidos Hoje</div>
    </q-card-section>

    <q-card-section class="q-pt-none">
      <q-list separator>
        <q-item v-for="client in todaysClients" :key="client.id" class="q-mb-sm">
          <q-item-section avatar>
            <q-avatar size="lg">
              <img :src="client.avatar" />
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <div class="text-weight-medium">{{ client.name }}</div>
            <div class="text-caption">
              <q-icon name="phone" size="xs" class="q-mr-xs" />
              {{ client.phone }}
            </div>
            <div class="text-caption">
              <q-icon name="email" size="xs" class="q-mr-xs" />
              {{ client.email }}
            </div>
          </q-item-section>

          <q-item-section side>
            <div class="column items-end">
              <q-badge
                v-for="app in client.appointments"
                :key="app.id"
                :color="app.status === 'completed' ? 'positive' : 'primary'"
                class="q-mb-xs"
              >
                {{ app.service }} ({{ app.time }})
              </q-badge>
            </div>
          </q-item-section>
        </q-item>

        <q-item v-if="todaysClients.length === 0">
          <q-item-section class="text-center text-grey">
            <q-icon name="people" size="xl" />
            <div class="q-mt-md">Nenhum cliente atendido hoje</div>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Client } from '../../types/staff-Type';

interface ClientAppointment {
  id: number;
  service: string;
  time: string;
  status: string;
}

interface TodayClient extends Client {
  appointments: ClientAppointment[];
}

const todaysClients = ref<TodayClient[]>([]);

onMounted(() => {
  // Simular dados
  todaysClients.value = [
    {
      id: 1,
      name: 'Ana Pereira',
      phone: '(11) 98765-4321',
      email: 'ana@example.com',
      avatar: 'https://randomuser.me/api/portraits/women/33.jpg',
      appointments: [{ id: 1, service: 'Manicure', time: '10:00', status: 'completed' }],
    },
  ];
});
</script>
