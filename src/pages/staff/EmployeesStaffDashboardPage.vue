<template>
  <q-layout view="hHh Lpr lFf" class="bg-grey-2">
    <!-- Sidebar Esquerdo -->
    <q-drawer v-model="leftDrawerOpen" :width="280" :breakpoint="700" bordered show-if-above>
      <q-scroll-area class="fit">
        <div class="q-pa-md">
          <!-- Logo -->
          <div class="row items-center q-mb-md">
            <div class="col">
              <div class="row items-center">
                <q-icon name="spa" size="xl" color="primary" />
                <span class="text-h6 text-weight-bold q-ml-sm">BeautyTime</span>
              </div>
            </div>
            <div class="col-auto">
              <q-btn flat round dense icon="chevron_left" @click="leftDrawerOpen = false" />
            </div>
          </div>

          <!-- Menu de Navegação para Staff -->
          <StaffNavigationMenu />
        </div>
      </q-scroll-area>
    </q-drawer>

    <!-- Layout Principal -->
    <q-page-container>
      <q-page padding>
        <!-- Topbar -->
        <StaffHeader
          :left-drawer-open="leftDrawerOpen"
          @toggle-drawer="leftDrawerOpen = !leftDrawerOpen"
        />

        <!-- Conteúdo do Dashboard -->
        <div class="q-pt-xl q-px-md">
          <!-- Tabs de Navegação -->
          <StaffTabs v-model="activeTab" />

          <!-- Conteúdo das Tabs -->
          <div class="tab-content">
            <!-- Agenda Diária -->
            <DailyAgendaSection v-if="activeTab === 'agenda'" />

            <!-- Marcações Pendentes -->
            <PendingAppointmentsSection
              v-if="activeTab === 'pending'"
              @reject-appointment="openRejectionModal"
              @reschedule-appointment="openRescheduleModal"
            />

            <!-- Clientes Atendidos -->
            <ClientsSection v-if="activeTab === 'clients'" />

            <!-- Estatísticas -->
            <StatisticsSection v-if="activeTab === 'stats'" />

            <!-- Materiais de Trabalho -->
            <MaterialsSection
              v-if="activeTab === 'materials'"
              @request-material="openMaterialRequestModal"
              @use-material="openMaterialUseModal"
            />
          </div>
        </div>
      </q-page>
    </q-page-container>

    <!-- Modais -->
    <RejectionModal
      ref="rejectionModal"
      :appointment="selectedAppointment"
      @reject="handleAppointmentRejection"
    />

    <RescheduleModal
      ref="rescheduleModal"
      :appointment="selectedAppointment"
      @reschedule="handleAppointmentReschedule"
    />

    <MaterialRequestModal
      ref="materialRequestModal"
      :materials="materials"
      @request="handleMaterialRequest"
    />

    <MaterialUseModal ref="materialUseModal" :materials="materials" @use="handleMaterialUse" />
  </q-layout>
</template>

<script setup lang="ts">
import { ref, provide } from 'vue';

// Components
import StaffNavigationMenu from '../../components/staff/StaffNavigationMenu.vue';
import StaffHeader from '../../components/staff/StaffHeader.vue';
import StaffTabs from '../../components/staff/StaffTabs.vue';
import DailyAgendaSection from '../../components/staff/DailyAgendaSection.vue';
import PendingAppointmentsSection from '../../components/staff/PendingAppointmentsSection.vue';
import ClientsSection from '../../components/staff/ClientsSection.vue';
import StatisticsSection from '../../components/staff/StatisticsSection.vue';
import MaterialsSection from '../../components/staff/MaterialsSection.vue';

// Modals
import RejectionModal from '../../components/staff/modal/RejectionModal.vue';
import RescheduleModal from '../../components/staff/modal/RescheduleModal.vue';
import MaterialRequestModal from '../../components/staff/modal/MaterialRequestModal.vue';
import MaterialUseModal from '../../components/staff/modal/MaterialUseModal.vue';

// Importar tipos
import type {
  Appointment,
  Material,
  RejectionData,
  RescheduleData,
  MaterialRequest,
  MaterialUseData,
  MaterialRequestData,
} from '../../types/staff-Type';

const leftDrawerOpen = ref(false);
const activeTab = ref('agenda');

// Dados para os modais
const materials = ref<Material[]>([
  { id: 1, name: 'Shampoo', quantity: 2, unit: 'litros', minQuantity: 3 },
  { id: 2, name: 'Condicionador', quantity: 1, unit: 'litros', minQuantity: 2 },
  { id: 3, name: 'Esmalte', quantity: 15, unit: 'unidades', minQuantity: 10 },
]);

const selectedAppointment = ref<Appointment | null>(null);

// Refs para os modais
const rejectionModal = ref<{ openModal: (appointment: Appointment) => void } | null>(null);
const rescheduleModal = ref<{ openModal: (appointment: Appointment) => void } | null>(null);
const materialRequestModal = ref<{ openModal: () => void } | null>(null);
const materialUseModal = ref<{ openModal: (materialId: number) => void } | null>(null);

// Funções para abrir modais
function openRejectionModal(appointment: Appointment) {
  selectedAppointment.value = appointment;
  rejectionModal.value?.openModal(appointment);
}

function openRescheduleModal(appointment: Appointment) {
  selectedAppointment.value = appointment;
  rescheduleModal.value?.openModal(appointment);
}

function openMaterialRequestModal() {
  materialRequestModal.value?.openModal();
}

function openMaterialUseModal(material: Material) {
  materialUseModal.value?.openModal(material.id);
}

// Handlers para os eventos dos modais
function handleAppointmentRejection(rejectionData: RejectionData) {
  console.log('Atendimento rejeitado:', rejectionData);
  // Implementar lógica de rejeição
}

function handleAppointmentReschedule(rescheduleData: RescheduleData) {
  console.log('Atendimento reagendado:', rescheduleData);
  // Implementar lógica de reagendamento
}

// ✅ CORREÇÃO: Usar tipo específico MaterialRequestData
function handleMaterialRequest(requestData: MaterialRequestData) {
  console.log('📦 Solicitação de material recebida:', requestData);

  // Processamento seguro dos dados
  try {
    const materialId = parseInt(String(requestData.materialId || requestData.id));
    const quantity = parseInt(String(requestData.quantity));
    const reason = requestData.reason || '';
    const urgent = Boolean(requestData.urgent);

    if (isNaN(materialId) || isNaN(quantity) || quantity <= 0) {
      throw new Error('Dados inválidos na solicitação');
    }

    const material = materials.value.find((m) => m.id === materialId);
    if (!material) {
      throw new Error('Material não encontrado');
    }

    // Criar objeto completo para o backend
    const completeRequest: MaterialRequest = {
      id: Date.now(), // ID temporário
      materialId,
      materialName: material.name,
      quantity,
      unit: material.unit,
      date: new Date(),
      status: 'pending',
      statusLabel: 'Pendente',
      reason,
      urgent,
    };

    console.log('✅ Solicitação processada:', completeRequest);

    // Aqui você enviaria para a API:
    // await api.materialRequest.create(completeRequest);
  } catch (error) {
    console.error('❌ Erro ao processar solicitação:', error);
  }
}

function handleMaterialUse(useData: MaterialUseData) {
  console.log('Uso de material:', useData);
  // Implementar lógica de uso de material
}

// Prover funções para componentes filhos se necessário
provide('openRejectionModal', openRejectionModal);
provide('openRescheduleModal', openRescheduleModal);
</script>

<style scoped>
.tab-content {
  margin-top: 20px;
}

.q-page {
  background-color: #f8f9fa;
}
</style>
