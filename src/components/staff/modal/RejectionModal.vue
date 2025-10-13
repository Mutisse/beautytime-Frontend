<template>
  <q-dialog v-model="showModal" persistent>
    <q-card style="min-width: 450px">
      <q-card-section>
        <div class="text-h6">Rejeitar Atendimento</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div v-if="currentAppointment" class="q-mb-md">
          <div class="text-weight-medium">{{ currentAppointment.client.name }}</div>
          <div class="text-caption">
            {{ currentAppointment.service }} - {{ formatDateTime(currentAppointment) }}
          </div>
        </div>

        <q-select
          v-model="rejectionReason"
          :options="rejectionReasons"
          label="Motivo da rejeição"
          outlined
          class="q-mb-md"
          :rules="[(val) => !!val || 'Selecione um motivo']"
        />

        <q-input
          v-if="rejectionReason === 'other'"
          v-model="customReason"
          label="Especificar motivo"
          type="textarea"
          outlined
          rows="2"
          :rules="[(val) => val.length > 0 || 'Digite o motivo da rejeição']"
        />

        <q-input
          v-model="additionalNotes"
          label="Observações adicionais"
          type="textarea"
          outlined
          rows="2"
          class="q-mt-md"
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancelar" color="primary" v-close-popup />
        <q-btn
          flat
          label="Confirmar Rejeição"
          color="negative"
          @click="confirmRejection"
          :disable="!canSubmit"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Appointment } from '../../../types/staff-Type';

interface RejectionData {
  appointment: Appointment;
  reason: string;
  notes: string;
}

const emit = defineEmits<{
  (e: 'reject', data: RejectionData): void;
}>();

const showModal = ref(false);
const rejectionReason = ref('');
const customReason = ref('');
const additionalNotes = ref('');
const currentAppointment = ref<Appointment | null>(null);

const rejectionReasons = [
  'Conflito de horário',
  'Cliente não confirmou',
  'Serviço não disponível',
  'Problemas técnicos',
  'other',
];

const canSubmit = computed(() => {
  if (!rejectionReason.value) return false;
  if (rejectionReason.value === 'other' && !customReason.value) return false;
  return true;
});

const finalReason = computed(() => {
  return rejectionReason.value === 'other' ? customReason.value : rejectionReason.value;
});

function openModal(appointment: Appointment) {
  showModal.value = true;
  currentAppointment.value = appointment;
  rejectionReason.value = '';
  customReason.value = '';
  additionalNotes.value = '';
}

function formatDateTime(appointment: Appointment): string {
  const date = new Date(appointment.date).toLocaleDateString('pt-BR');
  return `${date} às ${appointment.startTime}`;
}

function confirmRejection() {
  if (!currentAppointment.value || !canSubmit.value) return;

  const rejectionData: RejectionData = {
    appointment: currentAppointment.value,
    reason: finalReason.value,
    notes: additionalNotes.value,
  };

  emit('reject', rejectionData);
  showModal.value = false;
}

defineExpose({
  openModal,
});
</script>
