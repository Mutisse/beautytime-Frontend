<template>
  <!-- O mesmo template anterior (mantido intacto) -->
  <q-page class="services-page">
    <div class="services-container" v-if="currentSalon && !showBookingForm">
      <!-- Header -->
      <div class="page-header">
        <q-btn flat icon="arrow_back" label="Voltar" @click="goBack" class="back-button" />

        <div class="salon-info">
          <h1 class="text-h4">{{ currentSalon.salonName }}</h1>

          <div class="salon-meta">
            <q-rating
              :model-value="currentSalon.salonRating || 4.5"
              size="1.5em"
              color="warning"
              readonly
              class="q-mr-sm"
            />
            <span class="text-caption text-grey-7 q-mr-md">
              ({{ (currentSalon.salonRating || 4.5).toFixed(1) }})
            </span>

            <q-icon name="place" size="1.2em" class="q-mr-xs" />
            <span class="text-caption text-grey-7 q-mr-md">
              {{ currentSalon.salonAddress }}
            </span>

            <q-icon name="directions_walk" size="1.2em" class="q-mr-xs" />
            <span class="text-caption text-grey-7">
              {{ formatDistance(currentSalon.salonDistance) }}
              (~{{ currentSalon.salonEstimatedTime || Math.round(currentSalon.salonDistance / 80) }}
              min)
            </span>
          </div>
        </div>
      </div>

      <!-- Selected Services Bar -->
      <q-banner v-if="selectedServices.length > 0" class="bg-blue-1 selected-services-bar">
        <div class="selected-services-list">
          <q-chip
            v-for="(service, index) in selectedServices"
            :key="service.serviceId"
            removable
            @remove="removeService(index)"
            color="primary"
            text-color="white"
            class="selected-service"
          >
            <span class="q-mr-sm">{{ service.serviceName }}</span>
            <span class="selected-service-price">
              {{ formatPrice(service.servicePrice) }}
            </span>
          </q-chip>
        </div>

        <div class="selected-services-total">
          <div>
            <span class="text-weight-bold q-mr-md"> Total: {{ formatPrice(totalPrice) }} </span>
            <span class="text-caption"> Duração: {{ totalDuration }} min </span>
          </div>

          <q-btn
            color="primary"
            label="Agendar selecionados"
            @click="proceedToBooking"
            class="book-selected-btn"
          />
        </div>
      </q-banner>

      <!-- Search -->
      <div class="search-container">
        <q-input
          v-model="serviceSearch"
          placeholder="Pesquisar serviços..."
          dense
          outlined
          class="search-input"
          @keyup.enter="applySearch"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>

        <q-btn color="primary" label="Pesquisar" @click="applySearch" class="search-button" />
      </div>

      <!-- Services by Category -->
      <div
        class="services-by-category"
        v-if="currentSalon.salonServices && currentSalon.salonServices.length > 0"
      >
        <div v-for="(category, index) in serviceCategories" :key="index" class="category-section">
          <h2 class="category-title text-h5">{{ category }}</h2>

          <div class="service-cards-container">
            <q-card
              v-for="service in getServicesByCategory(category)"
              :key="service.serviceId"
              class="service-card"
              :class="{ selected: isServiceSelected(service) }"
            >
              <q-card-section class="service-content">
                <div class="service-image">
                  <q-img
                    v-if="service.serviceImage"
                    :src="service.serviceImage"
                    alt="Imagem do serviço"
                    class="service-img"
                    :ratio="16 / 9"
                  />
                  <div v-else class="image-placeholder flex flex-center">
                    {{ service.serviceName?.charAt(0) || 'S' }}
                  </div>
                </div>

                <h3 class="text-h6 q-mt-md">{{ service.serviceName || 'Serviço sem nome' }}</h3>

                <p class="service-description text-caption">
                  {{ service.serviceDescription || 'Descrição não disponível' }}
                </p>

                <div class="service-meta">
                  <span class="duration">
                    <q-icon name="schedule" size="1em" />
                    {{ service.serviceDuration || '0' }} min
                  </span>
                  <span class="price text-weight-bold">
                    {{ formatPrice(service.servicePrice) }}
                  </span>
                </div>

                <q-btn
                  :color="isServiceSelected(service) ? 'negative' : 'primary'"
                  :label="isServiceSelected(service) ? 'Remover' : 'Adicionar'"
                  @click="toggleServiceSelection(service)"
                  class="service-book-btn full-width"
                />
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>

      <!-- No Services -->
      <div v-else class="no-services-section">
        <q-banner class="no-services bg-grey-3">
          <template v-slot:avatar>
            <q-icon name="search_off" color="grey-7" />
          </template>
          <div class="text-h6">Nenhum serviço disponível</div>
          <div class="text-caption q-mt-sm">Este salão ainda não cadastrou serviços.</div>
        </q-banner>
      </div>
    </div>

    <!-- Booking Form -->
    <div v-if="showBookingForm" class="booking-form-page">
      <div class="booking-placeholder flex flex-center q-pa-xl">
        <q-card class="text-center">
          <q-card-section>
            <q-icon name="calendar_today" color="primary" size="xl" />
            <h4 class="q-mt-md">Funcionalidade de Agendamento</h4>
            <p class="q-mt-md">Em desenvolvimento...</p>
            <q-btn color="primary" label="Fechar" @click="closeBookingForm" class="q-mt-md" />
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Loading/Error -->
    <div v-else-if="!currentSalon" class="loading-container flex flex-center">
      <q-card class="text-center q-pa-xl">
        <q-card-section>
          <q-spinner v-if="isLoading" color="primary" size="3em" />
          <q-icon v-else name="error" color="negative" size="3em" />

          <div class="q-mt-md">
            <p v-if="isLoading" class="text-h6">Carregando informações do salão...</p>
            <p v-else class="error-message text-h6">
              {{ error || 'Erro ao carregar o salão' }}
            </p>
          </div>

          <q-btn
            v-if="error"
            color="primary"
            label="Tentar novamente"
            @click="loadSalonData"
            class="retry-btn q-mt-md"
          />
          <q-btn
            v-else-if="!isLoading"
            color="primary"
            label="Voltar"
            @click="goBack"
            class="retry-btn q-mt-md"
          />
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>
<script setup lang="ts">
import { ref, computed, onMounted, watch, type PropType } from 'vue';
import { useRouter } from 'vue-router'; // ✅ Removido useRoute não utilizado
import { useQuasar } from 'quasar';
import { useSalonStore } from '../../stores/salon-Store';

// Importação correta com type imports
import type {
  Service,
  Salon,
  SelectedService,
  SalonFromAPI,
} from '../../types/servicesScheduling-types';
import { ServiceCategoryEnum } from '../../types/servicesScheduling-types';

const $q = useQuasar();
const router = useRouter(); // ✅ Apenas router é usado
const salonStore = useSalonStore();

// Props
const props = defineProps({
  salonId: {
    type: [String, Number] as PropType<string | number>,
    required: true,
  },
});

// Estados reativos
const currentSalon = ref<Salon | null>(null);
const serviceSearch = ref('');
const selectedServices = ref<SelectedService[]>([]);
const showBookingForm = ref(false);
const isLoading = ref(false);
const error = ref<string | null>(null);

// Computed (mantido igual)
const serviceCategories = computed(() => {
  if (!currentSalon.value?.salonServices) return [];
  const categories = new Set(
    currentSalon.value.salonServices.map((s) => s.serviceCategory || 'Geral'),
  );
  return Array.from(categories).sort();
});

const filteredServices = computed(() => {
  if (!currentSalon.value?.salonServices) return [];
  const searchTerm = serviceSearch.value?.toLowerCase() || '';
  return currentSalon.value.salonServices.filter((service) => {
    const nameMatch = service.serviceName?.toLowerCase().includes(searchTerm) || false;
    const descriptionMatch =
      service.serviceDescription?.toLowerCase().includes(searchTerm) || false;
    const categoryMatch = service.serviceCategory?.toLowerCase().includes(searchTerm) || false;
    return nameMatch || descriptionMatch || categoryMatch;
  });
});

const totalPrice = computed(() => {
  return selectedServices.value.reduce(
    (total, service) => total + (Number(service.servicePrice) || 0),
    0,
  );
});

const totalDuration = computed(() => {
  return selectedServices.value.reduce(
    (total, service) => total + (Number(service.serviceDuration) || 0),
    0,
  );
});

// Métodos
const getServicesByCategory = (category: string): Service[] => {
  return filteredServices.value.filter(
    (service) => (service.serviceCategory || 'Geral') === category,
  );
};

const loadSalonData = async (): Promise<void> => {
  console.log('🔄 Iniciando carregamento do salão...');
  isLoading.value = true;
  error.value = null;
  selectedServices.value = [];

  try {
    const id = props.salonId;
    console.log('📋 SalonId recebido:', id);

    if (!id) {
      throw new Error('ID do salão não fornecido');
    }

    console.log('📦 Buscando da store...');
    await loadSalonFromStore(id.toString());
  } catch (err) {
    console.error('❌ Erro ao carregar salão:', err);
    error.value = (err as Error).message || 'Erro ao carregar os dados do salão.';
    currentSalon.value = null;

    $q.notify({
      type: 'negative',
      message: error.value,
      position: 'top',
      timeout: 4000,
    });
  } finally {
    isLoading.value = false;
  }
};

// ✅ CORREÇÃO: Promise com reject de Error
const loadSalonFromStore = (salonId: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      console.log('🏪 Buscando salão na store:', salonId);

      const allSalons = salonStore.salons || [];
      console.log('🔍 Total de salões na store:', allSalons.length);

      // Buscar salão sem any
      const salon = allSalons.find((s: unknown) => {
        const salonData = s as SalonFromAPI;
        return salonData._id === salonId || (salonData as { id?: string }).id === salonId;
      });

      if (!salon) {
        // ✅ CORREÇÃO: Reject com Error object
        reject(new Error(`Salão com ID ${salonId} não encontrado`));
        return;
      }

      console.log('✅ Salão encontrado:', salon);

      // Converter dados usando a interface SalonFromAPI
      currentSalon.value = convertSalonFromAPI(salon as SalonFromAPI);
      console.log('📦 Dados convertidos do salão:', currentSalon.value);

      $q.notify({
        type: 'positive',
        message: 'Salão carregado com sucesso!',
        position: 'top',
        timeout: 2000,
      });

      resolve();
    } catch (err) {
      console.error('❌ Erro ao carregar da store:', err);
      // ✅ CORREÇÃO: Reject com Error object
      const error = err instanceof Error ? err : new Error('Erro desconhecido ao carregar salão');
      reject(error);
    }
  });
};

// Interface para serviços da API
interface ApiService {
  _id?: string;
  id?: string;
  name: string;
  price: number;
  duration: number;
  category: string;
  description: string;
}

// Converter dados da API para Salon
const convertSalonFromAPI = (salon: SalonFromAPI): Salon => {
  // Converter serviços da API
  const salonServices: Service[] = Array.isArray(salon.services)
    ? salon.services.map(
        (service: ApiService): Service => ({
          serviceId: service._id || service.id || Math.random().toString(),
          serviceName: service.name || 'Serviço',
          servicePrice: service.price || 0,
          serviceDuration: service.duration || 30,
          serviceCategory: service.category || ServiceCategoryEnum.OTHER,
          serviceDescription: service.description || 'Descrição não disponível',
        }),
      )
    : getDefaultServices();

  // Converter amenidades da API
  const salonAmenities: string[] = Array.isArray(salon.amenities)
    ? salon.amenities
    : ['Wi-Fi Gratuito', 'Ar Condicionado', 'Estacionamento'];

  return {
    salonId: salon._id,
    salonName: salon.nameSalon,
    salonAddress: salon.location?.fullAddress || 'Endereço não disponível',
    salonDistance: 1500,
    salonRating: 4.5,
    salonEstimatedTime: 18,
    salonServices,
    salonAmenities,
    isOpen: salon.isOpen !== false,
    salonLatitude: salon.location?.coordinates?.[1] || -25.9689,
    salonLongitude: salon.location?.coordinates?.[0] || 32.5699,
  };
};

// Serviços padrão usando enum
const getDefaultServices = (): Service[] => {
  return [
    {
      serviceId: '1',
      serviceName: 'Corte de Cabelo',
      servicePrice: 250,
      serviceDuration: 45,
      serviceCategory: ServiceCategoryEnum.HAIR,
      serviceDescription: 'Corte profissional e estilizado',
    },
    {
      serviceId: '2',
      serviceName: 'Manicure',
      servicePrice: 150,
      serviceDuration: 40,
      serviceCategory: ServiceCategoryEnum.NAILS,
      serviceDescription: 'Cuidados completos para as unhas',
    },
    {
      serviceId: '3',
      serviceName: 'Pedicure',
      servicePrice: 180,
      serviceDuration: 50,
      serviceCategory: ServiceCategoryEnum.NAILS,
      serviceDescription: 'Tratamento completo para os pés',
    },
  ];
};

// Resto dos métodos (mantidos iguais)
const formatPrice = (value: number): string => {
  const number = Number(value);
  return isNaN(number) ? 'MTn 0,00' : `MTn ${number.toFixed(2).replace('.', ',')}`;
};

const formatDistance = (distance: number): string => {
  if (!distance) return '0 m';
  if (distance >= 1000) {
    return `${(distance / 1000).toFixed(1)} km`;
  }
  return `${Math.round(distance)} m`;
};

const isServiceSelected = (service: Service): boolean => {
  return selectedServices.value.some((s) => s.serviceId === service.serviceId);
};

const toggleServiceSelection = (service: Service): void => {
  const exists = selectedServices.value.find((s) => s.serviceId === service.serviceId);
  if (exists) {
    selectedServices.value = selectedServices.value.filter(
      (s) => s.serviceId !== service.serviceId,
    );
    $q.notify({
      type: 'info',
      message: 'Serviço removido da seleção',
      position: 'top',
      timeout: 1500,
    });
  } else {
    if (!currentSalon.value) {
      $q.notify({
        type: 'negative',
        message: 'Erro: Salão não carregado',
        position: 'top',
        timeout: 2000,
      });
      return;
    }

    const selectedService: SelectedService = {
      ...service,
      salonId: currentSalon.value.salonId,
    };
    selectedServices.value.push(selectedService);

    $q.notify({
      type: 'positive',
      message: 'Serviço adicionado à seleção!',
      position: 'top',
      timeout: 1500,
    });
  }
};

const removeService = (index: number): void => {
  if (index < 0 || index >= selectedServices.value.length) {
    console.error('Índice inválido para remover serviço:', index);
    return;
  }

  const service = selectedServices.value[index];
  if (!service) return;

  const serviceName = service.serviceName;
  selectedServices.value.splice(index, 1);
  $q.notify({
    type: 'warning',
    message: `Serviço "${serviceName}" removido`,
    position: 'top',
    timeout: 1500,
  });
};

const proceedToBooking = (): void => {
  if (selectedServices.value.length === 0) {
    $q.notify({
      type: 'warning',
      message: 'Selecione pelo menos um serviço para agendar',
      position: 'top',
      timeout: 2000,
    });
    return;
  }
  showBookingForm.value = true;
};

const closeBookingForm = (): void => {
  showBookingForm.value = false;
};

const applySearch = (): void => {
  if (serviceSearch.value.trim() === '') {
    $q.notify({
      type: 'info',
      message: 'Digite um termo para pesquisar serviços',
      position: 'top',
      timeout: 2000,
    });
  } else {
    const resultsCount = filteredServices.value.length;
    if (resultsCount === 0) {
      $q.notify({
        type: 'warning',
        message: `Nenhum serviço encontrado com o termo: ${serviceSearch.value}`,
        position: 'top',
        timeout: 3000,
      });
    } else {
      $q.notify({
        type: 'positive',
        message: `Encontrados ${resultsCount} serviço(s)`,
        position: 'top',
        timeout: 2000,
      });
    }
  }
};

const goBack = (): void => {
  router.go(-1);
};

// Watchers e Lifecycle
watch(
  () => props.salonId,
  (newId) => {
    if (newId) {
      void loadSalonData();
    }
  },
);

onMounted(() => {
  console.log('🚀 ServicesSchedulingPage montada');
  void loadSalonData();
});
</script>

<style lang="scss" scoped>
.services-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;

  .page-header {
    margin-bottom: 30px;
    background: white;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

    .back-button {
      margin-bottom: 15px;
      color: #1976d2;
      font-weight: 500;

      &:hover {
        background: rgba(25, 118, 210, 0.1);
      }
    }

    .salon-info {
      h1 {
        margin: 0 0 10px 0;
        color: #1976d2;
        font-weight: 700;
      }

      .salon-meta {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 15px;
        color: #666;

        .q-icon {
          opacity: 0.7;
        }
      }
    }
  }

  .selected-services-bar {
    position: sticky;
    top: 0;
    border-bottom: 2px solid #1976d2;
    padding: 20px;
    z-index: 100;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(25, 118, 210, 0.2);
    margin-bottom: 25px;

    .selected-services-list {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-bottom: 15px;

      .selected-service {
        padding: 8px 12px;
        border-radius: 20px;
        transition: all 0.3s ease;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }

        .selected-service-price {
          margin-left: 5px;
          font-weight: bold;
          font-size: 0.9em;
        }
      }
    }

    .selected-services-total {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 15px;
      padding-top: 15px;
      border-top: 1px solid rgba(25, 118, 210, 0.2);

      .book-selected-btn {
        padding: 10px 24px;
        font-weight: 600;
        border-radius: 25px;
        box-shadow: 0 4px 15px rgba(25, 118, 210, 0.3);
        transition: all 0.3s ease;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(25, 118, 210, 0.4);
        }
      }
    }
  }

  .search-container {
    display: flex;
    gap: 15px;
    margin-bottom: 30px;
    background: white;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

    .search-input {
      flex: 1;

      :deep(.q-field__control) {
        border-radius: 8px;
      }
    }

    .search-button {
      padding: 10px 20px;
      border-radius: 8px;
      font-weight: 600;
    }

    @media (max-width: 599px) {
      flex-direction: column;
    }
  }

  .services-by-category {
    margin-bottom: 50px;

    .category-section {
      margin-bottom: 40px;
      background: white;
      padding: 25px;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

      .category-title {
        margin-bottom: 20px;
        padding-bottom: 10px;
        border-bottom: 2px solid #1976d2;
        color: #1976d2;
        font-weight: 700;
        font-size: 1.5em;
      }

      .service-cards-container {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
        gap: 25px;

        @media (max-width: 1023px) {
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
        }

        @media (max-width: 599px) {
          grid-template-columns: 1fr;
          gap: 15px;
        }

        .service-card {
          transition: all 0.3s ease;
          border-radius: 12px;
          overflow: hidden;
          border: 2px solid transparent;
          position: relative;

          &:hover {
            transform: translateY(-8px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
          }

          &.selected {
            border-color: #1976d2;
            background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);

            &::before {
              content: '✓ SELECIONADO';
              position: absolute;
              top: 10px;
              right: 10px;
              background: #1976d2;
              color: white;
              padding: 4px 8px;
              border-radius: 12px;
              font-size: 0.7em;
              font-weight: bold;
              z-index: 2;
            }
          }

          .service-content {
            padding: 20px;

            .service-image {
              margin-bottom: 15px;

              .image-placeholder {
                height: 180px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                font-size: 3em;
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
              }
            }

            h3 {
              margin: 0 0 10px 0;
              color: #2c3e50;
              font-weight: 600;
              font-size: 1.3em;
            }

            .service-description {
              color: #666;
              margin: 0 0 20px 0;
              line-height: 1.5;
              font-size: 0.9em;
            }

            .service-meta {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 20px;
              padding: 12px 0;
              border-top: 1px solid #eee;
              border-bottom: 1px solid #eee;

              .duration {
                color: #666;
                display: flex;
                align-items: center;
                gap: 6px;
                font-weight: 500;
              }

              .price {
                color: #1976d2;
                font-size: 1.3em;
                font-weight: 700;
              }
            }

            .service-book-btn {
              padding: 12px;
              border-radius: 8px;
              font-weight: 600;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              transition: all 0.3s ease;

              &:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
              }
            }
          }
        }
      }
    }
  }

  .no-services-section {
    margin: 40px 0;

    .no-services {
      border-radius: 12px;
      padding: 30px;
      text-align: center;

      .q-icon {
        font-size: 3em;
      }
    }
  }

  .loading-container {
    min-height: 400px;

    .error-message {
      color: #f44336;
    }

    .retry-btn {
      border-radius: 8px;
      padding: 10px 20px;
    }
  }

  .booking-form-page {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;

    .booking-placeholder {
      background: white;
      border-radius: 16px;
      padding: 40px;
      max-width: 500px;
      width: 100%;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);

      .q-icon {
        margin-bottom: 10px;
      }

      h4 {
        color: #1976d2;
        margin-bottom: 10px;
      }
    }
  }
}

// Animações
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.service-card {
  animation: fadeIn 0.5s ease-out;
}

// Responsividade adicional
@media (max-width: 768px) {
  .services-page {
    padding: 15px;

    .page-header {
      padding: 15px;

      .salon-meta {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
      }
    }

    .selected-services-bar {
      padding: 15px;

      .selected-services-total {
        flex-direction: column;
        align-items: flex-start;
      }
    }
  }
}
</style>
