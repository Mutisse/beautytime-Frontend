<template>
  <div class="salon-form-container">
    <div class="salon-form-card">
      <!-- Progress Steps -->
      <div class="progress-steps">
        <div
          v-for="(step, index) in steps"
          :key="index"
          class="step"
          :class="{ active: currentStep === index + 1, completed: currentStep > index + 1 }"
          @click="goToStep(index + 1)"
        >
          <div class="step-number">{{ index + 1 }}</div>
          <div class="step-label">{{ step.label }}</div>
        </div>
      </div>

      <form @submit.prevent="submitForm">
        <!-- Step Components -->
        <BasicInformationStep
          v-show="currentStep === 1"
          :salon="basicInfoSalon"
          :errors="errors"
          @validate-field="handleValidateField"
        />

        <LocationStep
          v-show="currentStep === 2"
          :salon="locationSalon"
          :errors="errors"
          :location-details="locationDetails"
          :location-search="locationSearch"
          :map-loading="mapLoading"
          :selected-location="selectedLocation"
          @validate-field="handleValidateField"
          @search-location="handleSearchLocation"
          @locate-me="handleLocateMe"
          @clear-location="handleClearLocation"
          @update-location-search="handleUpdateLocationSearch"
          @map-mounted="handleMapMounted"
        />

        <ContactStep
          v-show="currentStep === 3"
          :salon="contactSalon"
          :errors="errors"
          @validate-field="handleValidateField"
          @handle-phone-input="handlePhoneInput"
          @handle-phone-blur="handlePhoneBlur"
          @format-facebook-input="handleFormatFacebookInput"
          @format-instagram-input="handleFormatInstagramInput"
        />

        <ServicesStep
          v-show="currentStep === 4"
          :salon="salon"
          :errors="errors"
          :service-errors="serviceErrors"
          @add-service="addService"
          @remove-service="removeService"
          @validate-service-field="handleValidateServiceField"
        />

        <AmenitiesStep v-show="currentStep === 5" :salon="salon" @remove-amenity="removeAmenity" />

        <PaymentStep
          v-show="currentStep === 6"
          :salon="salon"
          @toggle-mobile-wallets="toggleMobileWallets"
        />

        <WorkingHoursStep
          v-show="currentStep === 7"
          :salon="salon"
          :days-of-week="daysOfWeek"
          @toggle-day="toggleDay"
          @update-opening-hours="updateOpeningHours"
        />

        <FormNavigation
          :current-step="currentStep"
          :is-submitting="isSubmitting"
          @prev-step="prevStep"
          @next-step="nextStep"
          @cancel-form="cancelForm"
          @submit-form="submitForm"
        />
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useSalonStore } from '../../../stores/salon-Store';
import type {
  SalonFormData,
  OpeningHours,
  CreateSalonPayload,
  SalonService,
} from '../../../types/Salon-Types';

// Composables
import {
  getDefaultSalonData,
  getDaysOfWeek,
  getSteps,
  validatePhone,
} from '../../../composables/salon-form';
import { useSalonMap } from '../../../composables/salon-form';
import { useSalonValidation } from '../../../composables/salon-form';

// Components
import BasicInformationStep from '../../Forms/salons/step/BasicInformationStep.vue';
import LocationStep from '../../Forms/salons/step/LocationStep.vue';
import ContactStep from '../../Forms/salons/step/ContactStep.vue';
import ServicesStep from '../../Forms/salons/step/ServicesStep.vue';
import AmenitiesStep from '../../Forms/salons/step/AmenitiesStep.vue';
import PaymentStep from '../../Forms/salons/step/PaymentStep.vue';
import WorkingHoursStep from '../../Forms/salons/step/WorkingHoursStep.vue';
import FormNavigation from '../../Forms/salons/step/FormNavigation.vue';

// Interfaces específicas para cada componente
interface BasicInformationStepSalon extends SalonFormData {
  featured: boolean;
  mainImage: string;
}

interface LocationStepSalon extends SalonFormData {
  neighborhood: string;
  province: string;
  community: string;
  zipCode: string;
}

interface ContactStepSalon extends SalonFormData {
  phone: string;
  email: string;
  website: string;
  whatsapp: string;
  facebook: string;
  instagram: string;
}

// Interface compatível com o que a função addMapClickListener espera
interface SalonForMap {
  address: string;
  city: string;
  neighborhood: string;
  province: string;
  community: string;
  zipCode: string;
  latitude: number;
  longitude: number;
}

// Inicializa composables
const router = useRouter();
const $q = useQuasar();
const salonStore = useSalonStore();

// Estados reativos
const currentStep = ref<number>(1);
const isSubmitting = ref<boolean>(false);
const mapContainer = ref<HTMLElement | null>(null);

// Dados do formulário
const defaultSalonData = getDefaultSalonData();
const salon = reactive<SalonFormData>({
  // Informações básicas
  nameSalon: defaultSalonData.nameSalon,
  description: defaultSalonData.description,
  category: defaultSalonData.category,
  priceRange: defaultSalonData.priceRange,
  featured: defaultSalonData.featured,
  mainImage: defaultSalonData.mainImage || '',

  // Localização
  address: defaultSalonData.address,
  city: defaultSalonData.city,
  neighborhood: defaultSalonData.neighborhood,
  province: defaultSalonData.province,
  community: defaultSalonData.community || '',
  zipCode: defaultSalonData.zipCode || '',
  latitude: defaultSalonData.latitude,
  longitude: defaultSalonData.longitude,

  // Contato
  phone: defaultSalonData.phone,
  email: defaultSalonData.email,
  website: defaultSalonData.website || '',
  whatsapp: defaultSalonData.whatsapp || '',
  facebook: defaultSalonData.facebook || '',
  instagram: defaultSalonData.instagram || '',

  // Serviços
  services: defaultSalonData.services,

  // Horário de funcionamento
  openingHours: defaultSalonData.openingHours,

  // Comodidades
  amenities: defaultSalonData.amenities,

  // Métodos de pagamento
  paymentMethods: defaultSalonData.paymentMethods,
  mobileWallets: defaultSalonData.mobileWallets,

  // Políticas
  cancellationPolicy: defaultSalonData.cancellationPolicy,
  lateArrivalPolicy: defaultSalonData.lateArrivalPolicy,
  childrenPolicy: defaultSalonData.childrenPolicy,

  // Status e metadados
  status: defaultSalonData.status,
  isOpen: defaultSalonData.isOpen,
  metadata: defaultSalonData.metadata || {
    createdBy: 'temp-user-id',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  employees_owner: defaultSalonData.employees_owner,
});

// Criar um objeto compatível para o mapa
const salonForMap = computed<SalonForMap>(() => ({
  address: salon.address,
  city: salon.city,
  neighborhood: salon.neighborhood,
  province: salon.province,
  community: salon.community || '',
  zipCode: salon.zipCode || '',
  latitude: salon.latitude,
  longitude: salon.longitude,
}));

// Computed properties para cada componente
const basicInfoSalon = computed<BasicInformationStepSalon>(() => ({
  ...salon,
  featured: salon.featured,
  mainImage: salon.mainImage || '',
}));

const locationSalon = computed<LocationStepSalon>(() => ({
  ...salon,
  neighborhood: salon.neighborhood,
  province: salon.province,
  community: salon.community || '',
  zipCode: salon.zipCode || '',
}));

const contactSalon = computed<ContactStepSalon>(() => ({
  ...salon,
  phone: salon.phone,
  email: salon.email,
  website: salon.website || '',
  whatsapp: salon.whatsapp || '',
  facebook: salon.facebook || '',
  instagram: salon.instagram || '',
}));

// Composables
const { errors, serviceErrors, validateField, validateServiceField, validateCurrentStep } =
  useSalonValidation();

const {
  mapLoading,
  selectedLocation,
  locationSearch,
  locationDetails,
  initMap,
  searchLocation,
  locateMe,
  clearLocation,
  addMapClickListener,
} = useSalonMap();

const daysOfWeek = ref(getDaysOfWeek());
const steps = ref(getSteps());

// Métodos do componente
const handleValidateField = (
  fieldName: string,
  value: unknown,
  validatorFn: (value: unknown) => string | true,
) => {
  return validateField(fieldName, value, validatorFn);
};

const handleValidateServiceField = (
  index: number,
  field: string,
  value: unknown,
  validatorFn: (value: unknown) => string | true,
) => {
  return validateServiceField(index, field, value, validatorFn);
};

const handleSearchLocation = () => {
  void searchLocation();
};

const handleLocateMe = () => {
  void locateMe();
};

const handleClearLocation = () => {
  clearLocation();
};

const handleUpdateLocationSearch = (value: string) => {
  locationSearch.value = value;
};

// ✅ CORREÇÃO: A função addMapClickListener agora só aceita 1 argumento
const handleMapMounted = (element: HTMLElement) => {
  mapContainer.value = element;
  void initMap(element).then(() => {
    // ✅ CHAMADA CORRETA: apenas 1 argumento
    addMapClickListener(salonForMap.value);
  });
};

const handlePhoneInput = (event: Event, field: keyof SalonFormData): void => {
  const input = event.target as HTMLInputElement;
  const digits = input.value.replace(/\D/g, '').substring(0, 12);
  (salon as Record<string, unknown>)[field] = digits;
};

const handlePhoneBlur = (field: keyof SalonFormData): void => {
  if (field === 'phone' || field === 'whatsapp') {
    validateField(field, (salon as Record<string, unknown>)[field], validatePhone);
  }
};

const handleFormatFacebookInput = (event: Event): void => {
  const input = event.target as HTMLInputElement;
  let value = input.value;
  value = value.replace(/[^a-zA-Z0-9.-]/g, '').toLowerCase();
  salon.facebook = value;
};

const handleFormatInstagramInput = (event: Event): void => {
  const input = event.target as HTMLInputElement;
  let value = input.value;
  value = value.replace(/[^a-zA-Z0-9._]/g, '').toLowerCase();
  value = value.replace('@', '');
  salon.instagram = value;
};

// Navegação
const nextStep = (): void => {
  if (validateCurrentStep(currentStep.value, salon)) {
    currentStep.value++;
  } else {
    $q.notify({
      type: 'negative',
      message: 'Por favor, corrija os erros antes de continuar',
      position: 'top',
    });
  }
};

const prevStep = (): void => {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
};

const goToStep = (step: number): void => {
  if (step < currentStep.value) {
    currentStep.value = step;
  }
};

// Serviços
const addService = (): void => {
  const newService: SalonService = {
    _id: undefined,
    name: '',
    description: '',
    price: 0,
    duration: 30,
    category: '',
    type: 'standard',
    difficulty: 'medium',
    materials: [],
    professionalsRequired: 1,
    isActive: true,
    image: undefined,
    createdAt: undefined,
  };
  salon.services.push(newService);
};

const removeService = (index: number): void => {
  if (salon.services.length > 1) {
    salon.services.splice(index, 1);
  } else {
    $q.notify({
      type: 'warning',
      message: 'É necessário ter pelo menos um serviço',
      position: 'top',
    });
  }
};

const removeAmenity = (amenity: string): void => {
  const index = salon.amenities.indexOf(amenity);
  if (index > -1) {
    salon.amenities.splice(index, 1);
  }
};

// Pagamento
const toggleMobileWallets = (): void => {
  const hasMobileWallet = salon.paymentMethods.includes('mobile_wallet');
  if (!hasMobileWallet) {
    salon.mobileWallets = [];
  }
};

const updateOpeningHours = (dayName: string, field: 'open' | 'close', value: string): void => {
  if (!salon.openingHours) {
    salon.openingHours = [];
  }

  const existingIndex = salon.openingHours.findIndex(
    (hours: OpeningHours) => hours.day === dayName,
  );

  if (existingIndex !== -1) {
    const existingHours = salon.openingHours[existingIndex];
    if (existingHours) {
      salon.openingHours[existingIndex] = {
        day: existingHours.day,
        open: field === 'open' ? value : existingHours.open,
        close: field === 'close' ? value : existingHours.close,
        isClosed: existingHours.isClosed,
      };
    }
  } else {
    salon.openingHours.push({
      day: dayName,
      open: field === 'open' ? value : '08:00',
      close: field === 'close' ? value : '18:00',
      isClosed: false,
    });
  }
};

const toggleDay = (dayName: string, isOpen: boolean): void => {
  if (!salon.openingHours) {
    salon.openingHours = [];
  }

  const existingIndex = salon.openingHours.findIndex(
    (hours: OpeningHours) => hours.day === dayName,
  );

  if (existingIndex !== -1) {
    const existingHours = salon.openingHours[existingIndex];
    if (existingHours) {
      salon.openingHours[existingIndex] = {
        day: existingHours.day,
        open: existingHours.open,
        close: existingHours.close,
        isClosed: !isOpen,
      };
    }
  } else {
    salon.openingHours.push({
      day: dayName,
      open: '08:00',
      close: '18:00',
      isClosed: !isOpen,
    });
  }
};

const initializeWorkingHours = (): void => {
  if (!salon.openingHours) {
    salon.openingHours = [];
  }

  Object.keys(daysOfWeek.value).forEach((day) => {
    const existingHours = salon.openingHours.find((hours: OpeningHours) => hours.day === day);
    if (!existingHours) {
      salon.openingHours.push({
        day: day,
        open: '08:00',
        close: '18:00',
        isClosed: day === 'sunday',
      });
    }
  });
};

// ✅ CORREÇÃO: Adicionar void para promises flutuantes
const cancelForm = (): void => {
  $q.dialog({
    title: 'Cancelar Cadastro',
    message: 'Tem certeza que deseja cancelar? Todas as informações serão perdidas.',
    cancel: true,
    persistent: true,
  }).onOk(() => {
    void router.push('/ownerManager/add/new-salon');
  });
};

// Função para converter SalonFormData para CreateSalonPayload
const convertToCreateSalonPayload = (salonData: SalonFormData): CreateSalonPayload => {
  const getDayHours = (day: string) => {
    const hours = salonData.openingHours?.find((h: OpeningHours) => h.day === day);
    const isOpen = !hours?.isClosed;
    return {
      isOpen: isOpen,
      open: isOpen ? hours?.open || '08:00' : '08:00',
      close: isOpen ? hours?.close || '18:00' : '18:00',
      breaks: [],
    };
  };

  const services = salonData.services.map((service: SalonService) => ({
    name: service.name,
    description: service.description || '',
    price: Number(service.price) || 0,
    duration: Number(service.duration) || 30,
    category: service.category,
    type: service.type || 'standard',
    difficulty: service.difficulty || 'medium',
  }));

  const payload: CreateSalonPayload = {
    nameSalon: salonData.nameSalon,
    description: salonData.description,
    featured: salonData.featured || false,
    location: {
      address: salonData.address,
      coordinates: [salonData.longitude, salonData.latitude] as [number, number],
      city: salonData.city,
      neighborhood: salonData.neighborhood,
      province: salonData.province,
      community: salonData.community || '',
      zipCode: salonData.zipCode || '',
      fullAddress: salonData.address,
    },
    contact: {
      email: salonData.email,
      phone: salonData.phone,
      website: salonData.website || undefined,
      whatsapp: salonData.whatsapp || undefined,
      socialMedia: {
        facebook: salonData.facebook || undefined,
        instagram: salonData.instagram || undefined,
      },
    },
    category: salonData.category,
    priceRange: salonData.priceRange,
    services: services,
    workingHours: {
      monday: getDayHours('monday'),
      tuesday: getDayHours('tuesday'),
      wednesday: getDayHours('wednesday'),
      thursday: getDayHours('thursday'),
      friday: getDayHours('friday'),
      saturday: getDayHours('saturday'),
      sunday: getDayHours('sunday'),
    },
    amenities: salonData.amenities || [],
    images: [],
    mainImage: salonData.mainImage || undefined,
    paymentMethods: salonData.paymentMethods || [],
    mobileWallets: salonData.mobileWallets || [],
    policies: {
      cancellation: salonData.cancellationPolicy,
      lateArrival: salonData.lateArrivalPolicy,
      children: salonData.childrenPolicy,
    },
    employees_owner: salonData.employees_owner,
    metadata: {
      createdBy: salonData.metadata?.createdBy || 'temp-user-id',
      createdAt: salonData.metadata?.createdAt || new Date(),
    },
  };

  return payload;
};

// ✅ CORREÇÃO: Remover async desnecessário
const submitForm = (): void => {
  let allStepsValid = true;
  for (let step = 1; step <= steps.value.length; step++) {
    if (!validateCurrentStep(step, salon)) {
      allStepsValid = false;
      currentStep.value = step;
      break;
    }
  }

  if (!allStepsValid) {
    $q.notify({
      type: 'negative',
      message: 'Por favor, corrija todos os erros antes de enviar',
      position: 'top',
    });
    return;
  }

  void handleFormSubmission();
};

// ✅ CORREÇÃO: Extrair a lógica assíncrona para uma função separada
const handleFormSubmission = async (): Promise<void> => {
  isSubmitting.value = true;

  try {
    const backendData = convertToCreateSalonPayload(salon);

    if (!backendData.nameSalon?.trim()) {
      throw new Error('Nome do salão é obrigatório');
    }

    if (!backendData.location.address?.trim()) {
      throw new Error('Endereço é obrigatório');
    }

    if (!backendData.location.city?.trim()) {
      throw new Error('Cidade é obrigatória');
    }

    if (backendData.location.coordinates[0] === 0 || backendData.location.coordinates[1] === 0) {
      throw new Error('Localização não definida. Por favor, selecione um local no mapa.');
    }

    const salonDataForStore: SalonFormData = {
      ...salon,
      community: salon.community || '',
      zipCode: salon.zipCode || '',
      website: salon.website || '',
      whatsapp: salon.whatsapp || '',
      facebook: salon.facebook || '',
      instagram: salon.instagram || '',
      mainImage: salon.mainImage || '',
    };

    await salonStore.createSalon(salonDataForStore);

    $q.notify({
      type: 'positive',
      message: 'Salão cadastrado com sucesso!',
      position: 'top',
      timeout: 5000,
    });

    setTimeout(() => {
      void router.push('/ownerManager/salons');
    }, 2000);
  } catch (error: unknown) {
    console.error('Erro ao cadastrar salão:', error);

    let errorMessage = 'Erro ao cadastrar salão. Tente novamente.';
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'object' && error !== null && 'response' in error) {
      const errorObj = error as { response?: { data?: { message?: string } } };
      errorMessage = errorObj.response?.data?.message || errorMessage;
    }

    $q.notify({
      type: 'negative',
      message: errorMessage,
      position: 'top',
      timeout: 7000,
      actions: [{ icon: 'close', color: 'white', round: true }],
    });
  } finally {
    isSubmitting.value = false;
  }
};

// Lifecycle hooks
onMounted(() => {
  initializeWorkingHours();

  if (salon.services.length === 0) {
    addService();
  }
});
</script>

<style lang="scss" scoped>
.salon-form-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;

  @media (max-width: 768px) {
    padding: 10px;
  }
}

.salon-form-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 24px;

  @media (max-width: 768px) {
    padding: 16px;
    border-radius: 8px;
  }
}

.progress-steps {
  display: flex;
  justify-content: space-between;
  margin-bottom: 32px;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 20px;
    left: 0;
    right: 0;
    height: 2px;
    background: #e0e0e0;
    z-index: 1;
  }

  @media (max-width: 768px) {
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 24px;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 15px;
  }
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 2;
  cursor: pointer;
  transition: all 0.3s ease;

  @media (max-width: 480px) {
    flex-direction: row;
    gap: 10px;
  }

  &:hover {
    transform: translateY(-2px);

    .step-number {
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    }
  }

  &.active {
    .step-number {
      background: #1976d2;
      color: white;
      box-shadow: 0 4px 12px rgba(25, 118, 210, 0.3);
    }

    .step-label {
      color: #1976d2;
      font-weight: bold;
    }
  }

  &.completed {
    .step-number {
      background: #4caf50;
      color: white;
      box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
    }

    .step-label {
      color: #4caf50;
      font-weight: 500;
    }
  }
}

.step-number {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: #757575;
  margin-bottom: 8px;
  transition: all 0.3s ease;
  border: 2px solid transparent;

  @media (max-width: 480px) {
    margin-bottom: 0;
    width: 36px;
    height: 36px;
    font-size: 14px;
  }
}

.step-label {
  font-size: 12px;
  text-align: center;
  color: #757575;
  transition: all 0.3s ease;
  font-weight: 500;

  @media (max-width: 768px) {
    font-size: 10px;
  }

  @media (max-width: 480px) {
    font-size: 12px;
    text-align: left;
  }
}

// Animações para transição entre steps
.step-transition-enter-active,
.step-transition-leave-active {
  transition: all 0.3s ease;
}

.step-transition-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.step-transition-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

// Estados de loading
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  z-index: 10;
}

// Responsividade adicional
@media (max-width: 1024px) {
  .salon-form-container {
    max-width: 100%;
    padding: 15px;
  }
}

@media (max-width: 600px) {
  .progress-steps {
    &::before {
      top: 18px;
    }
  }

  .step-number {
    width: 32px;
    height: 32px;
    font-size: 12px;
  }

  .step-label {
    font-size: 10px;
  }
}

// Dark mode support
@media (prefers-color-scheme: dark) {
  .salon-form-card {
    background: #1e1e1e;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  }

  .progress-steps::before {
    background: #333;
  }

  .step-number {
    background: #333;
    color: #b0b0b0;
  }

  .step-label {
    color: #b0b0b0;
  }
}

// Acessibilidade
.step {
  &:focus-visible {
    outline: 2px solid #1976d2;
    outline-offset: 4px;
    border-radius: 8px;
  }
}

// Animações de sucesso/erro
@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5px);
  }
  75% {
    transform: translateX(5px);
  }
}

.error-shake {
  animation: shake 0.3s ease-in-out;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

.success-pulse {
  animation: pulse 0.5s ease-in-out;
}
</style>
