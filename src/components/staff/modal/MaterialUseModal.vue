<template>
  <q-dialog v-model="showModal" persistent>
    <q-card style="min-width: 400px">
      <q-card-section>
        <div class="text-h6">Registrar Uso de Material</div>
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
          v-model="useQuantity"
          label="Quantidade utilizada"
          type="number"
          :min="0.1"
          :max="selectedMaterial?.quantity || 0"
          step="0.1"
          outlined
          :suffix="selectedMaterial?.unit || ''"
          :rules="[
            (val) => val > 0 || 'Quantidade deve ser maior que zero',
            (val) =>
              val <= (selectedMaterial?.quantity || 0) || 'Quantidade não pode exceder o estoque',
          ]"
        />

        <q-input
          v-model="useNotes"
          label="Observações"
          type="textarea"
          outlined
          rows="2"
          class="q-mt-md"
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancelar" color="primary" v-close-popup />
        <q-btn flat label="Registrar" color="primary" @click="submitUse" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Material } from '../../../types/staff-Type';
import type { MaterialUse } from '../../../types/modal-Type';

const props = defineProps<{
  materials: Material[];
}>();

const emit = defineEmits<{
  (e: 'use', data: MaterialUse): void;
}>();

const showModal = ref(false);
const selectedMaterialId = ref<number | null>(null);
const useQuantity = ref(1);
const useNotes = ref('');

const materialOptions = computed(() => {
  return props.materials.map((material) => ({
    ...material,
    label: `${material.name} (${material.unit}) - Estoque: ${material.quantity}`,
  }));
});

const selectedMaterial = computed(() => {
  return props.materials.find((m) => m.id === selectedMaterialId.value) || null;
});

function openModal(materialId?: number) {
  showModal.value = true;
  selectedMaterialId.value = materialId || null;
  useQuantity.value = 1;
  useNotes.value = '';
}

function submitUse() {
  if (!selectedMaterialId.value || !useQuantity.value || !selectedMaterial.value) return;

  const useData: MaterialUse = {
    materialId: selectedMaterialId.value,
    quantity: useQuantity.value,
    notes: useNotes.value,
  };

  emit('use', useData);
  showModal.value = false;
}

defineExpose({
  openModal,
});
</script>
