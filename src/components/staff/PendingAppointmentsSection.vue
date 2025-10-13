<template>
  <q-card>
    <q-card-section>
      <div class="row items-center q-mb-md">
        <div class="col">
          <div class="text-h6">Marcações Pendentes</div>
        </div>
        <div class="col-auto">
          <q-btn
            flat
            color="primary"
            label="Filtrar"
            icon="filter_list"
            @click="showFilters = !showFilters"
          />
        </div>
      </div>

      <!-- Filtros -->
      <div v-if="showFilters" class="row q-col-gutter-md q-mb-md">
        <div class="col-12 col-md-6">
          <q-input
            v-model="pendingFilterDate"
            label="Filtrar por data"
            type="date"
            outlined
            dense
          />
        </div>
        <div class="col-12 col-md-6">
          <q-select
            v-model="pendingFilterService"
            :options="servicesList"
            label="Filtrar por serviço"
            outlined
            dense
            emit-value
            map-options
          />
        </div>
      </div>
    </q-card-section>

    <q-card-section class="q-pt-none">
      <q-list separator>
        <q-item
          v-for="appointment in filteredPendingAppointments"
          :key="appointment.id"
          class="q-mb-sm"
          :class="{ 'bg-red-1': isAppointmentExpired(appointment) }"
        >
          <q-item-section>
            <div class="row items-center">
              <div class="col-3">
                <div class="text-weight-bold">{{ formatTime(appointment.startTime) }}</div>
                <div class="text-caption">{{ formatDate(appointment.date) }}</div>
              </div>

              <div class="col-6">
                <div class="row items-center">
                  <q-avatar size="md" class="q-mr-sm">
                    <img :src="appointment.client.avatar" />
                  </q-avatar>
                  <div>
                    <div class="text-weight-medium">{{ appointment.client.name }}</div>
                    <div class="text-caption">{{ appointment.service }}</div>
                    <div class="text-caption text-grey">
                      <q-icon name="phone" size="xs" />
                      {{ appointment.client.phone }}
                    </div>
                  </div>
                </div>

                <div v-if="appointment.notes" class="text-caption text-grey q-mt-xs">
                  {{ appointment.notes }}
                </div>
              </div>

              <div class="col-3 text-right">
                <q-btn-group flat>
                  <q-btn
                    icon="check"
                    color="positive"
                    round
                    dense
                    :disable="isAppointmentExpired(appointment)"
                    @click="() => confirmAppointment(appointment)"
                  />
                  <q-btn
                    icon="schedule"
                    color="warning"
                    round
                    dense
                    :disable="isAppointmentExpired(appointment)"
                    @click="() => openRescheduleModal(appointment)"
                  />
                  <q-btn
                    icon="close"
                    color="negative"
                    round
                    dense
                    @click="() => openRejectionModal(appointment)"
                  />
                </q-btn-group>
              </div>
            </div>
          </q-item-section>
        </q-item>

        <q-item v-if="filteredPendingAppointments.length === 0">
          <q-item-section class="text-center text-grey">
            <q-icon name="event_available" size="xl" />
            <div class="q-mt-md">Nenhuma marcação pendente</div>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { Appointment } from '../../types/staff-Type';

const showFilters = ref(false);
const pendingFilterDate = ref('');
const pendingFilterService = ref('');
const pendingAppointments = ref<Appointment[]>([]);
const servicesList = ref<string[]>([]);

const filteredPendingAppointments = computed(() => {
  let filtered = pendingAppointments.value;

  if (pendingFilterDate.value) {
    filtered = filtered.filter(
      (app) =>
        new Date(app.date).toDateString() === new Date(pendingFilterDate.value).toDateString(),
    );
  }

  if (pendingFilterService.value) {
    filtered = filtered.filter((app) => app.service === pendingFilterService.value);
  }

  return filtered;
});

function isAppointmentExpired(appointment: Appointment): boolean {
  const now = new Date();
  const appDate = new Date(appointment.date);
  const timeParts = appointment.endTime.split(':');
  const hours = parseInt(timeParts[0] || '0');
  const minutes = parseInt(timeParts[1] || '0');

  appDate.setHours(hours, minutes);
  return appDate < now;
}

function formatTime(time: string): string {
  return time;
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('pt-BR');
}

function confirmAppointment(appointment: Appointment): void {
  console.log('Confirmar agendamento:', appointment);
}

function openRescheduleModal(appointment: Appointment): void {
  console.log('Reagendar agendamento:', appointment);
}

function openRejectionModal(appointment: Appointment): void {
  console.log('Rejeitar agendamento:', appointment);
}

onMounted(() => {
  // Simular dados
  pendingAppointments.value = [
    {
      id: 1,
      date: new Date(),
      startTime: '10:00',
      endTime: '11:00',
      client: {
        id: 1,
        name: 'Ana Pereira',
        phone: '(11) 98765-4321',
        email: 'ana@example.com',
        avatar: 'https://randomuser.me/api/portraits/women/33.jpg',
      },
      service: 'Manicure',
      notes: 'Alergia a esmaltes com formol',
    },
  ];

  servicesList.value = ['Corte de Cabelo', 'Barba', 'Manicure', 'Pedicure', 'Massagem'];
});
</script>
