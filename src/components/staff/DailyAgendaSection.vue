<template>
  <q-card class="agenda-card">
    <q-card-section class="bg-primary text-white">
      <div class="row items-center q-mb-md">
        <div class="col">
          <div class="text-h6">Agenda do Dia</div>
          <div class="text-caption">{{ currentDate }}</div>
        </div>
        <div class="col-auto">
          <q-btn-group flat>
            <q-btn icon="chevron_left" @click="changeDate(-1)" dense />
            <q-btn icon="today" @click="goToToday" dense />
            <q-btn icon="chevron_right" @click="changeDate(1)" dense />
          </q-btn-group>
        </div>
      </div>
    </q-card-section>

    <q-card-section class="q-pt-none">
      <div class="row q-col-gutter-md">
        <!-- Colunas para as marcações -->
        <div v-for="(column, columnIndex) in timeSlotColumns" :key="columnIndex" class="col-4">
          <div class="time-slots-column">
            <q-item
              v-for="slot in column"
              :key="slot.time"
              class="time-slot q-mb-sm"
              :class="getSlotClasses(slot)"
              clickable
              @click="handleSlotClick(slot)"
            >
              <q-item-section>
                <div class="column items-center">
                  <div class="time-label text-weight-bold q-mb-sm">{{ slot.time }}</div>

                  <template v-if="slot.appointment">
                    <q-avatar size="md" class="q-mb-xs">
                      <img :src="slot.appointment.client.avatar" />
                    </q-avatar>
                    <div class="client-name text-center text-weight-medium q-mt-xs">
                      {{ slot.appointment.client.name }}
                    </div>
                    <div class="service-type text-caption text-center">
                      {{ slot.appointment.service }}
                    </div>

                    <div
                      v-if="slot.appointment.notes"
                      class="notes text-caption text-grey text-center q-mt-xs"
                    >
                      {{ slot.appointment.notes }}
                    </div>

                    <div class="actions q-mt-sm">
                      <q-btn
                        v-if="slot.status === 'booked'"
                        icon="check"
                        color="positive"
                        round
                        dense
                        size="sm"
                        @click.stop="confirmAppointment(slot)"
                      />
                      <q-btn
                        v-else-if="slot.status === 'confirmed' && !slot.isExpired"
                        icon="play_arrow"
                        color="primary"
                        round
                        dense
                        size="sm"
                        @click.stop="startAppointment(slot)"
                      />
                      <q-btn
                        v-else-if="slot.status === 'attending'"
                        icon="stop"
                        color="primary"
                        round
                        dense
                        size="sm"
                        @click.stop="completeAppointment(slot)"
                      />
                      <q-icon
                        v-else-if="slot.status === 'completed'"
                        name="check_circle"
                        color="positive"
                        size="md"
                      />
                      <q-btn
                        v-else-if="slot.isExpired"
                        icon="schedule"
                        color="grey"
                        round
                        dense
                        size="sm"
                        @click.stop="rescheduleAppointment(slot)"
                      />
                    </div>
                  </template>
                  <template v-else>
                    <div class="available-label text-caption text-grey text-center">Disponível</div>
                    <q-icon name="event_available" color="green" size="md" class="q-mt-xs" />
                  </template>
                </div>
              </q-item-section>
            </q-item>
          </div>
        </div>
      </div>
    </q-card-section>

    <!-- Diálogo de remarcação -->
    <q-dialog v-model="showRescheduleDialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Remarcar Atendimento</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="text-body1 q-mb-md">
            Deseja remarcar o atendimento de <strong>{{ selectedAppointment?.client.name }}</strong
            >?
          </div>
          <q-select
            v-model="newDate"
            label="Nova data"
            :options="availableDates"
            option-label="label"
            option-value="value"
            emit-value
            map-options
            filled
          />
          <q-select
            v-model="newTime"
            label="Novo horário"
            :options="availableTimes"
            filled
            class="q-mt-md"
          />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancelar" v-close-popup />
          <q-btn flat label="Remarcar" @click="confirmReschedule" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import type { TimeSlot, Appointment, Client } from '../../types/staff-Type';

const $q = useQuasar();

const selectedDate = ref(new Date());
const timeSlots = ref<TimeSlot[]>([]);
const showRescheduleDialog = ref(false);
const selectedAppointment = ref<Appointment | null>(null);
const newDate = ref('');
const newTime = ref('');

const currentDate = computed(() => {
  return selectedDate.value.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
});

// Dividir os timeSlots em 3 colunas
const timeSlotColumns = computed(() => {
  const columns: TimeSlot[][] = [[], [], []];
  timeSlots.value.forEach((slot, index) => {
    const columnIndex = index % 3;
    // Garante que a coluna existe
    if (!columns[columnIndex]) {
      columns[columnIndex] = [];
    }
    columns[columnIndex].push(slot);
  });
  return columns;
});

// Datas disponíveis para remarcação (próximos 7 dias)
const availableDates = computed(() => {
  const dates = [];
  const today = new Date();

  for (let i = 1; i <= 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    dates.push({
      label: date.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'short' }),
      value: date.toISOString().split('T')[0],
    });
  }

  return dates;
});

// Horários disponíveis para remarcação
const availableTimes = computed(() => {
  return ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];
});

function getSlotClasses(slot: TimeSlot) {
  return {
    'booked-slot': slot.status === 'booked',
    'confirmed-slot': slot.status === 'confirmed',
    'attending-slot': slot.status === 'attending',
    'completed-slot': slot.status === 'completed',
    'expired-slot': slot.isExpired,
    'available-slot': !slot.appointment,
  };
}

function handleSlotClick(slot: TimeSlot) {
  if (slot.isExpired && slot.appointment) {
    selectedAppointment.value = slot.appointment;
    showRescheduleDialog.value = true;
  }
}

function changeDate(days: number) {
  selectedDate.value = new Date(selectedDate.value);
  selectedDate.value.setDate(selectedDate.value.getDate() + days);
  generateTimeSlots();
}

function goToToday() {
  selectedDate.value = new Date();
  generateTimeSlots();
}

function generateTimeSlots() {
  const slots: TimeSlot[] = [];
  const startHour = 8;
  const endHour = 18;
  const now = new Date();
  const currentTime = now.getHours() * 100 + now.getMinutes();
  const today = new Date().toDateString();
  const selectedDay = selectedDate.value.toDateString();

  for (let hour = startHour; hour <= endHour; hour++) {
    const time = `${hour}:00`;
    const timeValue = hour * 100;
    const isToday = today === selectedDay;
    const isPast = isToday && timeValue < currentTime;

    // Simular alguns slots ocupados
    const isBooked = hour % 3 === 0 || hour % 5 === 0;
    const isConfirmed = hour % 4 === 0;

    let status = 'available';
    if (isBooked) {
      status = isConfirmed ? 'confirmed' : 'booked';
    }

    let appointment: Appointment | null = null;
    if (isBooked) {
      const client: Client = {
        id: hour,
        name: isConfirmed ? 'Maria Santos' : 'Carlos Oliveira',
        phone: '(11) 99999-9999',
        email: 'cliente@example.com',
        avatar: isConfirmed
          ? 'https://randomuser.me/api/portraits/women/44.jpg'
          : 'https://randomuser.me/api/portraits/men/22.jpg',
      };

      appointment = {
        id: hour,
        date: selectedDate.value,
        startTime: time,
        endTime: `${hour + 1}:00`,
        client,
        service: isConfirmed ? 'Corte de Cabelo' : 'Consulta',
        notes: isConfirmed ? 'Prefere cadeira perto da janela' : 'Primeira visita',
        status: 'pending',
      };
    }

    slots.push({
      time,
      status,
      isCurrent: isToday && timeValue <= currentTime && currentTime < timeValue + 100,
      isExpired: isPast && isBooked && !isConfirmed,
      appointment,
    });
  }

  timeSlots.value = slots;
}

function confirmAppointment(slot: TimeSlot) {
  if (slot.appointment) {
    slot.status = 'confirmed';
    slot.appointment.status = 'confirmed';
    $q.notify({
      type: 'positive',
      message: 'Atendimento confirmado',
      position: 'top',
    });
  }
}

function startAppointment(slot: TimeSlot) {
  if (slot.appointment) {
    slot.status = 'attending';
    slot.appointment.status = 'attending';
    $q.notify({
      type: 'info',
      message: 'Atendimento iniciado',
      position: 'top',
    });
  }
}

function completeAppointment(slot: TimeSlot) {
  if (slot.appointment) {
    slot.status = 'completed';
    slot.appointment.status = 'completed';
    $q.notify({
      type: 'positive',
      message: 'Atendimento concluído',
      position: 'top',
    });
  }
}

function rescheduleAppointment(slot: TimeSlot) {
  if (slot.appointment) {
    selectedAppointment.value = slot.appointment;
    showRescheduleDialog.value = true;
  }
}

function confirmReschedule() {
  if (selectedAppointment.value && newDate.value && newTime.value) {
    $q.notify({
      type: 'positive',
      message: `Atendimento remarcado para ${newDate.value} às ${newTime.value}`,
      position: 'top',
    });

    // Aqui você implementaria a lógica real de remarcação
    showRescheduleDialog.value = false;
    selectedAppointment.value = null;
    newDate.value = '';
    newTime.value = '';
  } else {
    $q.notify({
      type: 'warning',
      message: 'Selecione uma data e horário para remarcar',
      position: 'top',
    });
  }
}

onMounted(() => {
  generateTimeSlots();
});
</script>

<style scoped>
.agenda-card {
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.time-slots-column {
  border-right: 1px solid #e0e0e0;
  padding-right: 8px;
}

.time-slots-column:last-child {
  border-right: none;
}

.time-slot {
  border-radius: 10px;
  border: 1px solid #e0e0e0;
  transition: all 0.3s ease;
}

.time-slot:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.booked-slot {
  border-left: 4px solid #ff9800;
  background-color: rgba(255, 152, 0, 0.05);
}

.confirmed-slot {
  border-left: 4px solid #4caf50;
  background-color: rgba(76, 175, 80, 0.05);
}

.attending-slot {
  border-left: 4px solid #2196f3;
  background-color: rgba(33, 150, 243, 0.05);
}

.completed-slot {
  border-left: 4px solid #9e9e9e;
  background-color: rgba(158, 158, 158, 0.05);
}

.expired-slot {
  border-left: 4px solid #f44336;
  background-color: rgba(244, 67, 54, 0.05);
}

.available-slot {
  border-left: 4px solid #9c27b0;
  background-color: rgba(156, 39, 176, 0.05);
}

.time-label {
  font-size: 1.1em;
  color: #424242;
}

.client-name {
  font-size: 0.9em;
  line-height: 1.2;
}

.service-type {
  color: #616161;
}

.notes {
  font-style: italic;
  line-height: 1.3;
}

.available-label {
  padding: 8px 0;
}

.actions {
  display: flex;
  justify-content: center;
}
</style>
