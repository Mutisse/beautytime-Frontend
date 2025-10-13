<template>
  <q-card>
    <q-card-section>
      <div class="row items-center">
        <div class="col">
          <div class="text-h6">Materiais de Trabalho</div>
        </div>
        <div class="col-auto">
          <q-btn
            color="primary"
            label="Solicitar Material"
            icon="add"
            @click="() => openMaterialRequestModal()"
          />
        </div>
      </div>
    </q-card-section>

    <q-card-section class="q-pt-none">
      <!-- Alertas de Estoque Baixo -->
      <q-banner v-if="lowStockMaterials.length > 0" class="bg-warning text-dark q-mb-md">
        <template v-slot:avatar>
          <q-icon name="warning" />
        </template>
        Estoque baixo para {{ lowStockMaterials.length }} material(is)
      </q-banner>

      <!-- Lista de Materiais -->
      <div class="row q-col-gutter-md">
        <div v-for="material in myMaterials" :key="material.id" class="col-12 col-sm-6 col-md-4">
          <q-card flat bordered>
            <q-card-section>
              <div class="text-weight-medium">{{ material.name }}</div>
              <div class="row items-center q-mt-sm">
                <div class="col">
                  <div class="text-h6">{{ material.quantity }}</div>
                  <div class="text-caption">{{ material.unit }}</div>
                </div>
                <div class="col-auto">
                  <q-badge
                    :color="getMaterialStatusColor(material)"
                    :label="getMaterialStatus(material)"
                  />
                </div>
              </div>
            </q-card-section>

            <q-card-actions>
              <q-btn
                flat
                color="primary"
                label="Solicitar"
                icon="add"
                @click="(evt) => openMaterialRequestModal(material, evt)"
              />
              <q-btn
                flat
                color="grey"
                label="Usar"
                icon="remove"
                @click="(evt) => openMaterialUseModal(material, evt)"
              />
            </q-card-actions>
          </q-card>
        </div>
      </div>

      <!-- Histórico de Solicitações -->
      <div class="q-mt-lg">
        <div class="text-subtitle2 q-mb-sm">Histórico de Solicitações</div>
        <q-list separator>
          <q-item v-for="request in materialRequests" :key="request.id">
            <q-item-section>
              <div class="text-weight-medium">{{ request.materialName }}</div>
              <div class="text-caption">
                {{ request.quantity }} {{ request.unit }} •
                {{ formatDate(request.date) }}
              </div>
            </q-item-section>
            <q-item-section side>
              <q-badge :color="request.status === 'approved' ? 'positive' : 'warning'">
                {{ request.statusLabel }}
              </q-badge>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { Material, MaterialRequest } from '../../types/staff-Type';

const myMaterials = ref<Material[]>([]);
const materialRequests = ref<MaterialRequest[]>([]);

const lowStockMaterials = computed(() => {
  return myMaterials.value.filter((m) => m.quantity <= m.minQuantity);
});

function getMaterialStatus(material: Material): string {
  if (material.quantity <= material.minQuantity) {
    return 'Crítico';
  } else if (material.quantity <= material.minQuantity * 1.5) {
    return 'Baixo';
  } else {
    return 'Suficiente';
  }
}

function getMaterialStatusColor(material: Material): string {
  if (material.quantity <= material.minQuantity) {
    return 'negative';
  } else if (material.quantity <= material.minQuantity * 1.5) {
    return 'warning';
  } else {
    return 'positive';
  }
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('pt-BR');
}

function openMaterialRequestModal(material: Material | null = null, evt?: Event): void {
  evt?.stopPropagation();
  console.log('Abrir modal de solicitação:', material);
}

function openMaterialUseModal(material: Material, evt?: Event): void {
  evt?.stopPropagation();
  console.log('Abrir modal de uso:', material);
}

onMounted(() => {
  // Simular dados
  myMaterials.value = [
    { id: 1, name: 'Shampoo', quantity: 2, unit: 'litros', minQuantity: 3 },
    { id: 2, name: 'Condicionador', quantity: 1, unit: 'litros', minQuantity: 2 },
  ];

  materialRequests.value = [
    {
      id: 1,
      materialName: 'Shampoo',
      quantity: 2,
      unit: 'litros',
      date: new Date(),
      status: 'approved',
      statusLabel: 'Aprovado',
      materialId: 123, // ← Adicionar
      reason: 'Reposição de estoque', // ← Adicionar
      urgent: false, // ← Adicionar
    },
  ];
});
</script>
