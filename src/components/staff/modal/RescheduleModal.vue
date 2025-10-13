<template>
  <q-dialog v-model="showModal" persistent>
    <q-card style="min-width: 400px">
      <q-card-section>
        <div class="text-h6">Reagendar Atendimento</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-input v-model="selectedDate" label="Nova Data" type="date" outlined class="q-mb-md" />

        <q-select
          v-model="selectedTime"
          :options="availableTimeSlots"
          label="Novo Horário"
          outlined
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancelar" color="primary" v-close-popup />
        <q-btn flat label="Reagendar" color="primary" @click="reschedule" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { Appointment } from '../../../types/staff-Type';

const props = defineProps<{
  appointment: Appointment | null;
}>();

const emit = defineEmits<{
  (e: 'reschedule', data: { appointment: Appointment; newDate: Date; newTime: string }): void;
}>();

const showModal = ref(false);
const selectedDate = ref('');
const selectedTime = ref('');

const availableTimeSlots = ref(['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00']);

function openModal() {
  showModal.value = true;
  selectedDate.value = new Date().toISOString().split('T')[0] || '';
  selectedTime.value = '';
}

function reschedule() {
  if (props.appointment && selectedDate.value && selectedTime.value) {
    const newDate = new Date(selectedDate.value);
    emit('reschedule', {
      appointment: props.appointment,
      newDate,
      newTime: selectedTime.value,
    });
    showModal.value = false;
  }
}

defineExpose({
  openModal,
});
</script>
