<template>
  <q-dialog v-model="showModal" persistent>
    <q-card style="min-width: 500px">
      <q-card-section>
        <div class="text-h6">Solicitar Material</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-select
          v-model="selectedMaterialId"
          :options="materialOptions"
          label="Material"
          option-label="name"
          option-value="id"
          emit-value
          map-options
          outlined
          class="q-mb-md"
          :rules="[(val) => !!val || 'Selecione um material']"
        />

        <div v-if="selectedMaterial" class="q-mb-md">
          <div class="text-caption">
            Estoque atual: {{ selectedMaterial.quantity }} {{ selectedMaterial.unit }}
          </div>
        </div>

        <q-input
          v-model="requestQuantity"
          label="Quantidade"
          type="number"
          min="1"
          outlined
          class="q-mb-md"
          :rules="[(val) => val > 0 || 'Quantidade deve ser maior que zero']"
        />

        <q-input v-model="requestNotes" label="Observações" type="textarea" outlined rows="3" />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancelar" color="primary" v-close-popup />
        <q-btn flat label="Solicitar" color="primary" @click="submitRequest" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Material } from '../../../types/staff-Type';
import type { MaterialRequest } from '../../../types/modal-Type';

const props = defineProps<{
  materials: Material[];
}>();

const emit = defineEmits<{
  (e: 'request', data: MaterialRequest): void;
}>();

const showModal = ref(false);
const selectedMaterialId = ref<number | null>(null);
const requestQuantity = ref(1);
const requestNotes = ref('');

const materialOptions = computed(() => {
  return props.materials.map((material) => ({
    ...material,
    label: `${material.name} (${material.unit}) - Estoque: ${material.quantity}`,
  }));
});

const selectedMaterial = computed(() => {
  return props.materials.find((m) => m.id === selectedMaterialId.value) || null;
});

function openModal() {
  showModal.value = true;
  selectedMaterialId.value = null;
  requestQuantity.value = 1;
  requestNotes.value = '';
}

function submitRequest() {
  if (!selectedMaterialId.value || !requestQuantity.value || !selectedMaterial.value) return;

  const requestData: MaterialRequest = {
    materialId: selectedMaterialId.value,
    materialName: selectedMaterial.value.name,
    quantity: requestQuantity.value,
    unit: selectedMaterial.value.unit,
    notes: requestNotes.value,
  };

  emit('request', requestData);
  showModal.value = false;
}

defineExpose({
  openModal,
});
</script>
