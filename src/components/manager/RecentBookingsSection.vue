<template>
  <q-card>
    <q-card-section>
      <div class="row items-center">
        <div class="col">
          <div class="text-h6">Agendamentos Recentes</div>
        </div>
        <div class="col-auto">
          <q-btn flat color="primary" label="Ver todos" no-caps @click="goToBookings" />
        </div>
      </div>
    </q-card-section>

    <q-card-section class="q-pt-none">
      <q-list separator>
        <q-item v-for="booking in recentBookings" :key="booking.id" class="q-px-none">
          <q-item-section>
            <q-item-label class="text-weight-medium">{{ booking.client }}</q-item-label>
            <q-item-label caption> {{ booking.service }} • {{ booking.time }} </q-item-label>
            <q-item-label caption>
              <q-badge :color="getStatusColor(booking.status)" :label="booking.status" />
              com {{ booking.professional }}
            </q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-btn flat round dense icon="more_vert" @click="handleBookingAction(booking)" />
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

interface Booking {
  id: number;
  client: string;
  service: string;
  time: string;
  status: 'confirmed' | 'pending' | 'completed' | 'canceled';
  professional: string;
}

const router = useRouter();

const recentBookings: Booking[] = [
  {
    id: 1,
    client: 'Maria Silva',
    service: 'Corte de Cabelo',
    time: '14:30',
    status: 'confirmed',
    professional: 'João Santos',
  },
  {
    id: 2,
    client: 'Carlos Oliveira',
    service: 'Coloração',
    time: '15:45',
    status: 'pending',
    professional: 'Ana Costa',
  },
  {
    id: 3,
    client: 'Juliana Pereira',
    service: 'Manicure',
    time: '16:30',
    status: 'completed',
    professional: 'Paula Rodrigues',
  },
];

function getStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    confirmed: 'positive',
    pending: 'warning',
    completed: 'info',
    canceled: 'negative',
  };
  return statusColors[status] || 'grey';
}

function goToBookings(): void {
  void router.push('/manager/bookings');
}

function handleBookingAction(booking: Booking): void {
  console.log('Ação no agendamento:', booking);
  // Implementar ações como cancelar, reagendar, etc.
}
</script>
