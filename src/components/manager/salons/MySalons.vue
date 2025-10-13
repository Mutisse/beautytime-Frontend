<template>
  <div class="my-salons">
    <!-- Stats Grid -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-sm-3">
        <q-card class="stat-card primary-card">
          <q-card-section class="flex items-center">
            <q-avatar color="primary" text-color="white" class="q-mr-md">
              <q-icon name="fas fa-store" />
            </q-avatar>
            <div>
              <div class="text-h4 text-weight-bold">{{ totalSalons }}</div>
              <div class="text-caption">Total de Salões</div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-3">
        <q-card class="stat-card success-card">
          <q-card-section class="flex items-center">
            <q-avatar color="positive" text-color="white" class="q-mr-md">
              <q-icon name="fas fa-calendar-check" />
            </q-avatar>
            <div>
              <div class="text-h4 text-weight-bold">{{ totalAppointments }}</div>
              <div class="text-caption">Agendamentos Hoje</div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-3">
        <q-card class="stat-card warning-card">
          <q-card-section class="flex items-center">
            <q-avatar color="warning" text-color="white" class="q-mr-md">
              <q-icon name="fas fa-users" />
            </q-avatar>
            <div>
              <div class="text-h4 text-weight-bold">{{ totalClients }}</div>
              <div class="text-caption">Clientes Ativos</div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-3">
        <q-card class="stat-card info-card">
          <q-card-section class="flex items-center">
            <q-avatar color="info" text-color="white" class="q-mr-md">
              <q-icon name="fas fa-star" />
            </q-avatar>
            <div>
              <div class="text-h4 text-weight-bold">4.8</div>
              <div class="text-caption">Avaliação Média</div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Breadcrumb para navegação -->
    <q-breadcrumbs class="q-mb-md" v-if="currentView !== 'list'">
      <q-breadcrumbs-el
        icon="fas fa-home"
        label="Início"
        @click="backToSalons"
        class="cursor-pointer"
      />
      <q-breadcrumbs-el
        :icon="currentView === 'services' ? 'fas fa-concierge-bell' : 'fas fa-store'"
        :label="currentView === 'services' ? 'Serviços' : 'Detalhes'"
      />
      <q-breadcrumbs-el :label="currentSalon?.name || 'Salão'" />
    </q-breadcrumbs>

    <!-- Filtros e Busca (só mostra na lista de salões) -->
    <q-card class="q-mb-lg" v-if="currentView === 'list'">
      <q-card-section>
        <div class="row items-center q-col-gutter-md">
          <div class="col-12 col-sm-4">
            <q-input v-model="searchTerm" placeholder="Buscar salão..." outlined dense>
              <template v-slot:append>
                <q-icon name="fas fa-search" />
              </template>
            </q-input>
          </div>
          <div class="col-12 col-sm-3">
            <q-select
              v-model="statusFilter"
              :options="statusOptions"
              label="Status"
              outlined
              dense
            />
          </div>
          <div class="col-12 col-sm-3">
            <q-select v-model="sortBy" :options="sortOptions" label="Ordenar por" outlined dense />
          </div>
          <div class="col-12 col-sm-2">
            <q-btn
              color="primary"
              icon="fas fa-filter"
              label="Filtrar"
              class="full-width"
              @click="applyFilters"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Lista de Salões -->
    <div class="salons-grid" v-if="currentView === 'list'">
      <q-card v-for="salon in displayedSalons" :key="salon.id" class="salon-card">
        <!-- Header com Imagem -->
        <div class="salon-header" :style="`background-image: url(${salon.coverImage})`">
          <div class="header-overlay">
            <q-avatar size="80px" class="salon-logo">
              <img :src="salon.logo" :alt="salon.name" />
            </q-avatar>
            <div class="salon-badges">
              <q-badge
                :color="salon.status === 'active' ? 'positive' : 'warning'"
                class="status-badge"
              >
                <q-icon
                  :name="salon.status === 'active' ? 'fas fa-check' : 'fas fa-pause'"
                  class="q-mr-xs"
                />
                {{ salon.status === 'active' ? 'Ativo' : 'Inativo' }}
              </q-badge>
              <q-badge color="primary" class="rating-badge">
                <q-icon name="fas fa-star" class="q-mr-xs" />
                {{ salon.rating }}
              </q-badge>
            </div>
          </div>
        </div>

        <q-card-section>
          <!-- Informações Principais -->
          <div class="text-h6 text-weight-bold text-primary q-mb-xs">{{ salon.name }}</div>
          <div class="text-caption text-grey-7 q-mb-sm">
            <q-icon name="fas fa-map-marker-alt" class="q-mr-xs" />
            {{ salon.address }}
          </div>

          <!-- Métricas -->
          <div class="row metrics-grid q-mb-md">
            <div class="col-4 text-center">
              <div class="metric-value text-weight-bold">{{ salon.visits }}</div>
              <div class="metric-label text-caption">Visitas</div>
            </div>
            <div class="col-4 text-center">
              <div class="metric-value text-weight-bold">{{ salon.appointments }}</div>
              <div class="metric-label text-caption">Agend.</div>
            </div>
            <div class="col-4 text-center">
              <div class="metric-value text-weight-bold">{{ salon.ranking }}º</div>
              <div class="metric-label text-caption">Ranking</div>
            </div>
          </div>

          <!-- Serviços -->
          <div class="services-section q-mb-md">
            <div class="text-caption text-weight-medium q-mb-xs">
              Serviços ({{ salon.services.length }})
            </div>
            <div class="services-tags">
              <q-badge
                v-for="service in salon.popularServices"
                :key="service"
                color="blue-1"
                text-color="primary"
                class="service-tag"
              >
                {{ service }}
              </q-badge>
            </div>
          </div>

          <!-- Horário -->
          <div class="schedule-section">
            <div class="text-caption text-weight-medium q-mb-xs">Horário de Funcionamento</div>
            <div class="text-caption text-grey-7">
              <q-icon name="fas fa-clock" class="q-mr-xs" />
              {{ salon.schedule }}
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right" class="q-pa-md">
          <q-btn
            flat
            color="primary"
            icon="fas fa-concierge-bell"
            label="Serviços"
            size="sm"
            @click="viewServices(salon)"
          />
          <q-btn
            flat
            color="primary"
            icon="fas fa-eye"
            label="Visualizar"
            size="sm"
            @click="viewSalon(salon)"
          />
          <q-btn flat color="primary" icon="fas fa-edit" label="Editar" size="sm" />
          <q-btn flat color="grey" icon="fas fa-ellipsis-v" size="sm">
            <q-menu auto-close>
              <q-list style="min-width: 100px">
                <q-item clickable>
                  <q-item-section>Relatórios</q-item-section>
                </q-item>
                <q-item clickable>
                  <q-item-section>Duplicar</q-item-section>
                </q-item>
                <q-item clickable>
                  <q-item-section>Arquivar</q-item-section>
                </q-item>
                <q-separator />
                <q-item clickable class="text-negative">
                  <q-item-section>Desativar</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </q-card-actions>
      </q-card>
    </div>

    <!-- Visualização de Serviços usando o componente ServicesManagement -->
    <div v-if="currentView === 'services' && currentSalon" class="services-view">
      <ServicesManagement
        :salon="currentSalon"
        :services="currentSalon.services"
        @back="backToSalons"
        @service-updated="handleServiceUpdate"
        @service-added="handleServiceAdd"
        @service-deleted="handleServiceDelete"
      />
    </div>

    <!-- Visualização de Detalhes do Salão -->
    <div v-if="currentView === 'details' && currentSalon" class="salon-details-view">
      <q-card>
        <q-card-section class="bg-primary text-white">
          <div class="row items-center">
            <div class="col">
              <div class="text-h5">{{ currentSalon.name }}</div>
              <div class="text-caption">{{ currentSalon.address }}</div>
            </div>
            <div class="col-auto">
              <q-btn flat round icon="fas fa-times" color="white" @click="backToSalons" />
            </div>
          </div>
        </q-card-section>

        <q-card-section>
          <!-- Conteúdo dos detalhes do salão -->
          <div class="text-center q-my-lg">
            <q-icon name="fas fa-store" size="xl" color="primary" />
            <div class="text-h6 q-mt-md">Detalhes do Salão</div>
            <div class="text-caption text-grey-7">Visualização em desenvolvimento</div>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Navegação entre salões (quando não está na lista) -->
    <div class="row justify-between q-mt-lg" v-if="currentView !== 'list'">
      <q-btn
        color="primary"
        icon="fas fa-arrow-left"
        label="Salão Anterior"
        :disable="!hasPreviousSalon"
        @click="goToPreviousSalon"
      />
      <q-btn color="primary" icon="fas fa-store" label="Voltar para Salões" @click="backToSalons" />
      <q-btn
        color="primary"
        label="Próximo Salão"
        icon-right="fas fa-arrow-right"
        :disable="!hasNextSalon"
        @click="goToNextSalon"
      />
    </div>

    <!-- Mensagem quando não há salões -->
    <div v-if="displayedSalons.length === 0 && currentView === 'list'" class="text-center q-pa-xl">
      <q-icon name="fas fa-store" size="xl" color="grey-5" class="q-mb-md" />
      <div class="text-h6 text-grey-7">Nenhum salão encontrado</div>
      <div class="text-caption text-grey-5 q-mt-sm">
        {{
          searchTerm || statusFilter.value !== 'all'
            ? 'Tente ajustar os filtros'
            : 'Cadastre seu primeiro salão'
        }}
      </div>
      <q-btn
        v-if="!searchTerm && statusFilter.value === 'all'"
        color="primary"
        icon="fas fa-plus"
        label="Cadastrar Primeiro Salão"
        @click="handleChangeMenu('salon')"
        class="q-mt-md"
      />
    </div>

    <!-- Botão Adicionar Flutuante para Mobile -->
    <q-page-sticky position="bottom-right" :offset="[18, 18]" v-if="currentView === 'list'">
      <q-btn
        fab
        icon="fas fa-plus"
        color="primary"
        @click="handleChangeMenu('salon')"
        class="q-mb-xl"
      />
    </q-page-sticky>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import ServicesManagement from '../../../components/manager/salons/ServicesManagement.vue';

// Interfaces
interface SalonService {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: number;
  available: boolean;
}

interface Salon {
  id: number;
  name: string;
  address: string;
  phone: string;
  status: 'active' | 'inactive';
  rating: number;
  visits: number;
  appointments: number;
  ranking: number;
  schedule: string;
  logo: string;
  coverImage: string;
  popularServices: string[];
  services: SalonService[];
}

interface FilterOption {
  label: string;
  value: string;
}

// Emits
const emit = defineEmits<{
  (e: 'change-menu', menu: string): void;
}>();

// Refs
const searchTerm = ref<string>('');
const statusFilter = ref<FilterOption>({ label: 'Todos', value: 'all' });
const sortBy = ref<FilterOption>({ label: 'Nome', value: 'name' });
const currentView = ref<'list' | 'services' | 'details'>('list');
const currentSalon = ref<Salon | null>(null);

const statusOptions: FilterOption[] = [
  { label: 'Todos', value: 'all' },
  { label: 'Ativos', value: 'active' },
  { label: 'Inativos', value: 'inactive' },
];

const sortOptions: FilterOption[] = [
  { label: 'Nome', value: 'name' },
  { label: 'Ranking', value: 'ranking' },
  { label: 'Visitas', value: 'visits' },
  { label: 'Avaliação', value: 'rating' },
];

const allSalons = ref<Salon[]>([
  {
    id: 1,
    name: 'Beauty Time Matola',
    address: 'Matola, Shoprite - próximo ao mercado',
    phone: '+258 84 123 4567',
    status: 'active',
    rating: 4.8,
    visits: 1247,
    appointments: 156,
    ranking: 1,
    schedule: '08:00 - 18:00 (Seg-Sab)',
    logo: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=100&h=100&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1600948836101-f9ffda59de50?w=400&h=150&fit=crop',
    popularServices: ['Corte', 'Barba', 'Manicure'],
    services: [
      {
        id: 1,
        name: 'Corte de Cabelo',
        description: 'Corte moderno e estilizado',
        price: 250,
        duration: 30,
        available: true,
      },
      {
        id: 2,
        name: 'Barba',
        description: 'Aparar e modelar barba',
        price: 150,
        duration: 20,
        available: true,
      },
      {
        id: 3,
        name: 'Manicure',
        description: 'Cuidados com as unhas',
        price: 200,
        duration: 45,
        available: true,
      },
      {
        id: 4,
        name: 'Pedicure',
        description: 'Cuidados com os pés',
        price: 250,
        duration: 60,
        available: false,
      },
    ],
  },
  {
    id: 2,
    name: 'Beauty Time Maputo',
    address: 'Maputo, Baixa - centro da cidade',
    phone: '+258 84 234 5678',
    status: 'active',
    rating: 4.6,
    visits: 892,
    appointments: 98,
    ranking: 2,
    schedule: '07:30 - 19:00 (Seg-Dom)',
    logo: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=100&h=100&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1584438784894-089fe97d7f49?w=400&h=150&fit=crop',
    popularServices: ['Massagem', 'Pedicure', 'Spa'],
    services: [
      {
        id: 1,
        name: 'Massagem Relaxante',
        description: 'Massagem completa para relaxamento',
        price: 500,
        duration: 60,
        available: true,
      },
      {
        id: 2,
        name: 'Tratamento Facial',
        description: 'Limpeza e hidratação facial',
        price: 350,
        duration: 45,
        available: true,
      },
      {
        id: 3,
        name: 'Spa Completo',
        description: 'Pacote completo de spa',
        price: 800,
        duration: 120,
        available: true,
      },
    ],
  },
  {
    id: 3,
    name: 'Beauty Time Costa do Sol',
    address: 'Costa do Sol, praia principal',
    phone: '+258 84 345 6789',
    status: 'inactive',
    rating: 4.9,
    visits: 567,
    appointments: 45,
    ranking: 3,
    schedule: '09:00 - 17:00 (Seg-Sab)',
    logo: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=100&h=100&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1595475207225-428b62bda831?w=400&h=150&fit=crop',
    popularServices: ['Tratamento', 'Limpeza', 'Hidratação'],
    services: [
      {
        id: 1,
        name: 'Hidratação Capilar',
        description: 'Tratamento intensivo para cabelos',
        price: 300,
        duration: 40,
        available: true,
      },
      {
        id: 2,
        name: 'Limpeza de Pele',
        description: 'Limpeza profunda facial',
        price: 400,
        duration: 50,
        available: false,
      },
    ],
  },
]);

const displayedSalons = ref<Salon[]>([]);

// Computed properties para navegação
const currentSalonIndex = computed(() => {
  if (!currentSalon.value) return -1;
  return displayedSalons.value.findIndex((salon) => salon.id === currentSalon.value?.id);
});

const hasPreviousSalon = computed(() => currentSalonIndex.value > 0);
const hasNextSalon = computed(() => currentSalonIndex.value < displayedSalons.value.length - 1);

const viewServices = (salon: Salon): void => {
  currentSalon.value = salon;
  currentView.value = 'services';
};

const viewSalon = (salon: Salon): void => {
  currentSalon.value = salon;
  currentView.value = 'details';
};

const backToSalons = (): void => {
  currentView.value = 'list';
  currentSalon.value = null;
};

// ✅ CORREÇÃO: Verificação de undefined nas funções de navegação
const goToPreviousSalon = (): void => {
  if (hasPreviousSalon.value) {
    const previousIndex = currentSalonIndex.value - 1;
    const previousSalon = displayedSalons.value[previousIndex];
    if (previousSalon) {
      currentSalon.value = previousSalon;
    }
  }
};

const goToNextSalon = (): void => {
  if (hasNextSalon.value) {
    const nextIndex = currentSalonIndex.value + 1;
    const nextSalon = displayedSalons.value[nextIndex];
    if (nextSalon) {
      currentSalon.value = nextSalon;
    }
  }
};

const applyFilters = (): void => {
  let filtered = [...allSalons.value];

  // Filtro por busca
  if (searchTerm.value) {
    filtered = filtered.filter(
      (salon) =>
        salon.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
        salon.address.toLowerCase().includes(searchTerm.value.toLowerCase()),
    );
  }

  // Filtro por status
  if (statusFilter.value.value !== 'all') {
    filtered = filtered.filter((salon) => salon.status === statusFilter.value.value);
  }

  // Ordenação
  filtered.sort((a, b) => {
    switch (sortBy.value.value) {
      case 'ranking':
        return a.ranking - b.ranking;
      case 'visits':
        return b.visits - a.visits;
      case 'rating':
        return b.rating - a.rating;
      default:
        return a.name.localeCompare(b.name);
    }
  });

  displayedSalons.value = filtered;
};

// ✅ CORREÇÃO: Verificações de undefined nos handlers
const handleServiceUpdate = (updatedService: SalonService): void => {
  if (!currentSalon.value) return;

  const salonIndex = allSalons.value.findIndex((s) => s.id === currentSalon.value?.id);
  if (salonIndex !== -1 && allSalons.value[salonIndex]) {
    const salon = allSalons.value[salonIndex];
    const serviceIndex = salon.services.findIndex((s) => s.id === updatedService.id);
    if (serviceIndex !== -1) {
      salon.services[serviceIndex] = updatedService;
      updatePopularServices(salon);
    }
  }
};

const handleServiceAdd = (newService: SalonService): void => {
  if (!currentSalon.value) return;

  const salonIndex = allSalons.value.findIndex((s) => s.id === currentSalon.value?.id);
  if (salonIndex !== -1 && allSalons.value[salonIndex]) {
    const salon = allSalons.value[salonIndex];
    const maxId = salon.services.length > 0 ? Math.max(...salon.services.map((s) => s.id)) : 0;
    newService.id = maxId + 1;
    salon.services.push(newService);
    updatePopularServices(salon);
  }
};

const handleServiceDelete = (serviceId: number): void => {
  if (!currentSalon.value) return;

  const salonIndex = allSalons.value.findIndex((s) => s.id === currentSalon.value?.id);
  if (salonIndex !== -1 && allSalons.value[salonIndex]) {
    const salon = allSalons.value[salonIndex];
    salon.services = salon.services.filter((s) => s.id !== serviceId);
    updatePopularServices(salon);
  }
};

const updatePopularServices = (salon: Salon): void => {
  const availableServices = salon.services.filter((s) => s.available);
  salon.popularServices = availableServices.slice(0, 3).map((service) => service.name);
};

// ✅ CORREÇÃO: Função para emitir evento corretamente
const handleChangeMenu = (menu: string): void => {
  emit('change-menu', menu);
};

const totalSalons = computed(() => allSalons.value.length);
const totalAppointments = computed(() =>
  allSalons.value.reduce((sum, salon) => sum + salon.appointments, 0),
);
const totalClients = computed(() => allSalons.value.reduce((sum, salon) => sum + salon.visits, 0));

onMounted(() => {
  applyFilters();
});
</script>

<style lang="scss" scoped>
.my-salons {
  .stats-card {
    border-left: 4px solid $primary;
  }

  .stat-card {
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-4px);
      box-shadow: $shadow-4;
    }
  }

  .primary-card {
    border-left: 4px solid $primary;
  }

  .success-card {
    border-left: 4px solid $positive;
  }

  .warning-card {
    border-left: 4px solid $warning;
  }

  .info-card {
    border-left: 4px solid $info;
  }

  .salons-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
    gap: 20px;
  }

  .salon-card {
    transition: all 0.3s ease;
    overflow: hidden;

    &:hover {
      transform: translateY(-4px);
      box-shadow: $shadow-6;
    }
  }

  .salon-header {
    height: 120px;
    background-size: cover;
    background-position: center;
    position: relative;

    .header-overlay {
      position: absolute;
      bottom: -40px;
      left: 0;
      right: 0;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      padding: 0 20px;
    }

    .salon-logo {
      border: 4px solid white;
      box-shadow: $shadow-2;
    }

    .salon-badges {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .status-badge,
    .rating-badge {
      font-size: 0.7rem;
      padding: 4px 8px;
    }
  }

  .metrics-grid {
    border: 1px solid $blue-1;
    border-radius: 8px;
    padding: 12px 0;
    background: $grey-1;

    .metric-value {
      font-size: 1.2rem;
      color: $primary;
    }

    .metric-label {
      color: $grey-7;
    }
  }

  .services-section {
    .services-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .service-tag {
      font-size: 0.7rem;
      padding: 4px 8px;
    }
  }

  .schedule-section {
    padding: 8px;
    background: $green-1;
    border-radius: 6px;
    border-left: 3px solid $positive;
  }

  .service-card {
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: $shadow-4;
    }
  }

  .services-view {
    .services-management-wrapper {
      min-height: 400px;
    }
  }

  @media (max-width: 768px) {
    .salons-grid {
      grid-template-columns: 1fr;
    }

    .salon-header {
      height: 100px;

      .header-overlay {
        padding: 0 15px;
        bottom: -30px;
      }

      .salon-logo {
        width: 60px;
        height: 60px;
      }
    }
  }

  @media (max-width: 480px) {
    .salon-card {
      .q-card__actions {
        flex-wrap: wrap;
        justify-content: center;

        .q-btn {
          margin: 4px;
        }
      }
    }
  }
}
</style>
