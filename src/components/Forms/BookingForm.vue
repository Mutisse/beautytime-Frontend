<template>
  <q-page class="booking-form">
    <!-- Cabeçalho do formulário -->
    <q-header elevated class="header-primary">
      <q-toolbar>
        <q-btn flat round dense icon="arrow_back" @click="closeForm" />
        <q-toolbar-title>Agendar Serviços</q-toolbar-title>
      </q-toolbar>

      <div class="selected-services q-px-md q-pb-md">
        <div
          v-for="(service, index) in localBookingData.services"
          :key="service.serviceId"
          class="service-tag q-mr-sm q-mb-sm"
        >
          {{ service.serviceName }}
          <q-btn
            v-if="localBookingData.services.length > 1"
            flat
            round
            dense
            size="xs"
            icon="close"
            @click="removeService(index)"
            class="remove-service"
          />
        </div>
      </div>
    </q-header>

    <q-page-container>
      <!-- Seleção de local -->
      <q-tabs
        v-model="bookingLocation"
        dense
        class="location-tabs"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
      >
        <q-tab name="salon" icon="cut" label="No Salão" />
        <q-tab name="home" icon="home" label="Em Casa" />
      </q-tabs>

      <!-- Passos do formulário -->
      <q-stepper
        v-model="currentStep"
        ref="stepper"
        color="primary"
        animated
        class="custom-stepper"
      >
        <q-step :name="1" title="Dados" icon="person" :done="currentStep > 1">
          <!-- Passo 1: Dados Pessoais -->
          <div class="personal-data-step">
            <h5 class="step-title">Seus Dados</h5>

            <div class="row q-col-gutter-md">
              <div class="col-6">
                <q-input
                  outlined
                  v-model="userData.firstName"
                  label="Nome *"
                  placeholder="Seu nome"
                  :error="!!(showErrors && !userData.firstName)"
                  error-message="Campo obrigatório"
                  class="custom-input"
                />
              </div>
              <div class="col-6">
                <q-input
                  outlined
                  v-model="userData.lastName"
                  label="Sobrenome *"
                  placeholder="Seu sobrenome"
                  :error="!!(showErrors && !userData.lastName)"
                  error-message="Campo obrigatório"
                  class="custom-input"
                />
              </div>
            </div>

            <div class="row q-col-gutter-md q-mt-md">
              <div class="col-6">
                <q-input
                  outlined
                  v-model="userData.phone"
                  label="Telefone *"
                  placeholder="Seu telefone"
                  mask="(##) #####-####"
                  :error="!!(showErrors && !userData.phone)"
                  error-message="Campo obrigatório"
                  class="custom-input"
                />
              </div>
              <div class="col-6">
                <div class="q-field q-field--outlined">
                  <div class="q-field__label">Gênero</div>
                  <div class="q-field__inner">
                    <div class="q-field__control">
                      <div class="gender-options row q-col-gutter-xs">
                        <div class="col-4">
                          <q-btn
                            no-caps
                            outline
                            :color="userData.gender === 'male' ? 'primary' : 'grey-7'"
                            class="gender-btn full-width"
                            @click="userData.gender = 'male'"
                            label="Masculino"
                            size="sm"
                          />
                        </div>
                        <div class="col-4">
                          <q-btn
                            no-caps
                            outline
                            :color="userData.gender === 'female' ? 'primary' : 'grey-7'"
                            class="gender-btn full-width"
                            @click="userData.gender = 'female'"
                            label="Feminino"
                            size="sm"
                          />
                        </div>
                        <div class="col-4">
                          <q-btn
                            no-caps
                            outline
                            :color="userData.gender === 'undefined' ? 'primary' : 'grey-7'"
                            class="gender-btn full-width"
                            @click="userData.gender = 'undefined'"
                            label="Não definido"
                            size="sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <q-input
              outlined
              class="q-mt-md custom-input"
              v-model="userData.email"
              label="E-mail"
              placeholder="Seu e-mail"
              :error="!!(showErrors && userData.email && !validateEmail(userData.email))"
              error-message="E-mail inválido"
            />

            <!-- Seção de endereço (apenas para atendimento em casa) -->
            <div v-if="bookingLocation === 'home'" class="address-section q-mt-lg">
              <h5 class="step-title">Endereço para Atendimento</h5>

              <div class="row q-col-gutter-md">
                <div class="col-8">
                  <q-input
                    outlined
                    v-model="userAddress.road"
                    label="Avenida/Rua *"
                    placeholder="Ex: Avenida 25 de Setembro"
                    :error="!!(showErrors && !userAddress.road)"
                    error-message="Por favor, informe a avenida ou rua"
                    @update:model-value="formatStreetName"
                    class="custom-input"
                  />
                </div>
                <div class="col-4">
                  <q-input
                    outlined
                    v-model="userAddress.number"
                    label="Número *"
                    placeholder="Ex: 123"
                    :error="!!(showErrors && !userAddress.number)"
                    error-message="Informe o número do imóvel"
                    class="custom-input"
                  />
                </div>
              </div>

              <div class="row q-col-gutter-md q-mt-md">
                <div class="col-6">
                  <q-input
                    outlined
                    v-model="userAddress.block"
                    label="Quarteirão/Bloco *"
                    placeholder="Ex: Bloco A ou Quarteirão 42"
                    :error="!!(showErrors && !userAddress.block)"
                    error-message="Informe o quarteirão ou bloco"
                    class="custom-input"
                  />
                </div>
                <div class="col-6">
                  <q-input
                    outlined
                    v-model="userAddress.neighborhood"
                    label="Bairro *"
                    placeholder="Ex: Central ou Malhangalene"
                    :error="!!(showErrors && !userAddress.neighborhood)"
                    error-message="Informe o bairro"
                    class="custom-input"
                  />
                </div>
              </div>

              <q-select
                outlined
                class="q-mt-md custom-input"
                v-model="userAddress.city"
                :options="cities"
                label="Cidade *"
                :error="!!(showErrors && !userAddress.city)"
                error-message="Selecione sua cidade"
                emit-value
                map-options
              />

              <q-input
                outlined
                class="q-mt-md custom-input"
                v-model="userAddress.reference"
                label="Referência (opcional)"
                placeholder="Ex: Próximo ao mercado ou Casa com portão azul"
                hint="Nos ajude a encontrar seu endereço mais facilmente"
              />
            </div>
          </div>
        </q-step>
        <q-step :name="2" title="Horário" icon="access_time" :done="currentStep > 3">
          <!-- Passo 2: Seleção de Data/Horário -->
          <div class="datetime-step">
            <h5 class="step-title">Selecione Data e Horário</h5>

            <q-card flat bordered class="salon-card q-mb-md">
              <q-card-section>
                <div class="text-h6">{{ salon.salonName }}</div>
                <div v-if="salon.salonAddress" class="text-caption">{{ salon.salonAddress }}</div>
              </q-card-section>
            </q-card>

            <q-input
              outlined
              v-model="localBookingData.date"
              label="Data *"
              type="date"
              :min="minDate"
              :error="!!(showErrors && !localBookingData.date)"
              error-message="Selecione uma data"
              class="custom-input"
            />

            <div v-if="availableTimeSlots.length > 0" class="time-slots q-mt-md">
              <div class="row q-col-gutter-sm">
                <div v-for="slot in availableTimeSlots" :key="slot" class="col-4">
                  <q-btn
                    no-caps
                    outline
                    :color="localBookingData.time === slot ? 'primary' : 'grey-7'"
                    class="time-slot-btn full-width"
                    @click="selectTimeSlot(slot)"
                    :label="slot"
                  />
                </div>
              </div>
            </div>
            <div v-else class="no-slots text-center q-pa-md">
              <q-icon name="event_busy" size="40px" class="q-mb-sm" />
              <div>Nenhum horário disponível para esta data</div>
            </div>
          </div>
        </q-step>

        <q-step :name="3" title="Profissional" icon="groups" :done="currentStep > 2">
          <!-- Passo 3: Seleção de Profissional -->
          <div class="professional-step">
            <h5 class="step-title">Selecione um Profissional</h5>

            <q-card flat bordered class="salon-card q-mb-md">
              <q-card-section>
                <div class="text-h6">{{ salon.salonName }}</div>
                <div v-if="salon.salonAddress" class="text-caption">{{ salon.salonAddress }}</div>
              </q-card-section>
            </q-card>

            <div class="professionals-list">
              <q-card
                flat
                bordered
                class="q-mb-sm professional-card no-professional"
                :class="{ 'professional-selected': localBookingData.professional === null }"
                @click="selectProfessional(null)"
              >
                <q-card-section horizontal>
                  <q-card-section class="q-pt-xs">
                    <div class="professional-avatar">
                      <q-icon name="help" size="24px" />
                    </div>
                  </q-card-section>
                  <q-card-section>
                    <div class="text-weight-bold">Não escolher profissional</div>
                    <div class="text-caption">O salão irá designar um profissional disponível</div>
                  </q-card-section>
                </q-card-section>
              </q-card>

              <q-card
                v-for="professional in salonStaff"
                :key="professional.staffMemberId"
                flat
                bordered
                class="q-mb-sm professional-card"
                :class="{
                  'professional-selected':
                    localBookingData.professional?.staffMemberId === professional.staffMemberId,
                }"
                @click="selectProfessional(professional)"
              >
                <q-card-section horizontal>
                  <q-card-section class="q-pt-xs">
                    <div class="professional-avatar">
                      <q-avatar v-if="professional.staffMemberImage" size="50px">
                        <img
                          :src="professional.staffMemberImage"
                          :alt="professional.staffMemberName"
                        />
                      </q-avatar>
                      <q-avatar v-else size="50px" color="primary" text-color="white">
                        {{ professional.staffMemberName.charAt(0) }}
                      </q-avatar>
                    </div>
                  </q-card-section>
                  <q-card-section>
                    <div class="text-weight-bold">{{ professional.staffMemberName }}</div>
                    <div class="text-caption">
                      {{ professional.staffMemberSpecialty || 'Especialista' }}
                    </div>
                    <div class="rating">
                      <q-icon
                        v-for="i in 5"
                        :key="i"
                        :name="
                          i <= Math.round(professional.staffMemberRating) ? 'star' : 'star_border'
                        "
                        size="16px"
                        color="amber"
                      />
                      <span class="q-ml-xs">({{ professional.staffMemberRating.toFixed(1) }})</span>
                    </div>
                  </q-card-section>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </q-step>

        <q-step :name="4" title="Confirmação" icon="check" :done="currentStep > 4">
          <!-- Passo 4: Confirmação -->
          <div class="confirmation-step">
            <h4 class="confirmation-title text-center">Confirme seu Agendamento</h4>

            <q-card flat bordered class="booking-summary">
              <q-card-section>
                <div class="summary-section">
                  <h6>Detalhes do Agendamento</h6>

                  <div class="summary-item row items-center q-mb-sm">
                    <div class="col-4 text-weight-medium">Salão:</div>
                    <div class="col-8">{{ salon.salonName }}</div>
                  </div>

                  <div class="services-list q-mb-md">
                    <div class="text-weight-medium q-mb-xs">Serviços Selecionados:</div>
                    <div
                      v-for="(service, index) in localBookingData.services"
                      :key="index"
                      class="service-item row items-center q-mb-xs"
                    >
                      <div class="col-8 service-name">{{ service.serviceName }}</div>
                      <div class="col-4 text-right service-price">
                        {{ formatPrice(service.servicePrice) }}
                      </div>
                    </div>
                  </div>

                  <div class="summary-item row items-center q-mb-sm">
                    <div class="col-4 text-weight-medium">Local:</div>
                    <div class="col-8">
                      {{ bookingLocation === 'salon' ? 'No Salão' : 'Em Casa' }}
                    </div>
                  </div>
                  <div class="summary-item row items-center q-mb-sm">
                    <div class="col-4 text-weight-medium">Profissional:</div>
                    <div class="col-8">
                      {{ localBookingData.professional?.staffMemberName || 'Não especificado' }}
                    </div>
                  </div>
                  <div class="summary-item row items-center q-mb-sm">
                    <div class="col-4 text-weight-medium">Data e Hora:</div>
                    <div class="col-8">
                      {{ formatDateTime(localBookingData.date, localBookingData.time) }}
                    </div>
                  </div>
                  <div class="summary-item row items-center q-mb-sm">
                    <div class="col-4 text-weight-medium">Preço Total:</div>
                    <div class="col-8 text-weight-bold total-price">
                      {{ formatPrice(calculateTotalPrice()) }}
                    </div>
                  </div>
                  <div class="summary-item row items-center">
                    <div class="col-4 text-weight-medium">Status:</div>
                    <div class="col-8 status-pending">Pendente (aguardando confirmação)</div>
                  </div>
                </div>

                <q-separator class="summary-separator q-my-md" />

                <div class="summary-section">
                  <h6>Seus Dados</h6>
                  <div class="summary-item row items-center q-mb-sm">
                    <div class="col-4 text-weight-medium">Nome:</div>
                    <div class="col-8">{{ userData.firstName }} {{ userData.lastName }}</div>
                  </div>
                  <div class="summary-item row items-center q-mb-sm">
                    <div class="col-4 text-weight-medium">Telefone:</div>
                    <div class="col-8">{{ userData.phone }}</div>
                  </div>
                  <div v-if="userData.gender" class="summary-item row items-center q-mb-sm">
                    <div class="col-4 text-weight-medium">Gênero:</div>
                    <div class="col-8">
                      {{
                        userData.gender === 'male'
                          ? 'Masculino'
                          : userData.gender === 'female'
                            ? 'Feminino'
                            : 'Não definido'
                      }}
                    </div>
                  </div>
                  <div v-if="userData.email" class="summary-item row items-center q-mb-sm">
                    <div class="col-4 text-weight-medium">E-mail:</div>
                    <div class="col-8">{{ userData.email }}</div>
                  </div>
                  <div v-if="bookingLocation === 'home'" class="summary-item">
                    <div class="text-weight-medium q-mb-xs">Endereço:</div>
                    <div class="text-caption">
                      {{ userAddress.road }}, {{ userAddress.number }}<br />
                      Quarteirão/Bloco: {{ userAddress.block }}<br />
                      {{ userAddress.neighborhood }}<br />
                      {{ userAddress.city }}
                    </div>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </q-step>

        <template v-slot:navigation>
          <q-stepper-navigation class="stepper-navigation row justify-between">
            <q-btn
              v-if="currentStep > 1"
              flat
              color="primary"
              @click="previousStep"
              label="Voltar"
              class="nav-btn nav-btn-back"
            />
            <q-btn
              v-if="currentStep < 4"
              @click="nextStep"
              color="primary"
              :label="currentStep === 3 ? 'Confirmar' : 'Próximo'"
              :disable="isLoading"
              class="nav-btn nav-btn-next"
            />
            <q-btn
              v-if="currentStep === 4"
              @click="confirmBooking"
              color="primary"
              label="Finalizar Agendamento"
              :disable="isLoading"
              class="nav-btn nav-btn-confirm"
            />
          </q-stepper-navigation>
        </template>
      </q-stepper>
    </q-page-container>
  </q-page>
</template>

<script lang="ts">
import { useQuasar } from 'quasar';
import { ref, computed, onMounted } from 'vue';
import { useBookingStore } from '../../stores/booking-Store';
import type {
  BookingData,
  UserData,
  UserAddress,
  Professional,
  Service,
  Salon,
} from '../../types/booking-Type';

interface LocalBookingData {
  salon: Salon;
  services: Service[];
  professional: Professional | null;
  date: string;
  time: string | null;
  total: number;
  duration: number;
  status: string;
}

export default {
  name: 'BookingForm',
  props: {
    bookingData: {
      type: Object as () => BookingData,
      required: true,
      default: () => ({
        salon: {} as Salon,
        services: [] as Service[],
        total: 0,
        duration: 0,
      }),
    },
  },
  setup(props, { emit }) {
    const $q = useQuasar();
    const bookingStore = useBookingStore();

    const bookingLocation = ref<'salon' | 'home'>('salon');
    const currentStep = ref(1);
    const showErrors = ref(false);
    const isLoading = ref(false);

    const userData = ref<UserData>({
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      gender: null,
    });

    const userAddress = ref<UserAddress>({
      road: '',
      number: '',
      block: '',
      neighborhood: '',
      city: 'Maputo',
      reference: '',
    });

    const localBookingData = ref<LocalBookingData>({
      ...props.bookingData,
      professional: null,
      date: new Date().toISOString().split('T')[0] || '',
      time: null,
      status: 'pending',
    } as LocalBookingData);

    const cities = [
      'Maputo',
      'Matola',
      'Xai-Xai',
      'Inhambane',
      'Beira',
      'Chimoio',
      'Tete',
      'Quelimane',
      'Nampula',
      'Lichinga',
      'Pemba',
    ];

    const minDate = computed(() => new Date().toISOString().split('T')[0]);
    const salonStaff = computed(() => props.bookingData.salon.salonStaff || []);
    const salon = computed(() => props.bookingData.salon);

    const availableTimeSlots = computed(() => {
      if (!localBookingData.value.date) return [];

      const today = new Date().toISOString().split('T')[0];
      const selectedDate = localBookingData.value.date;
      const isToday = selectedDate === today;
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();

      const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
      const dateObj = new Date(selectedDate);
      const dayOfWeek = days[dateObj.getDay()];

      const availableSlots = props.bookingData.salon.salonAvailableSlots || {};
      const dayOfWeekKey = dayOfWeek as keyof typeof availableSlots;
      let slots =
        availableSlots[dayOfWeekKey] ||
        generateTimeSlots(
          bookingLocation.value === 'salon' ? 9 : 10,
          bookingLocation.value === 'salon' ? 18 : 17,
        );

      if (isToday) {
        slots = slots.filter((slot: string) => {
          const [hourStr, minuteStr] = slot.split(':');
          const hour = hourStr ? parseInt(hourStr, 10) : 0;
          const minute = minuteStr ? parseInt(minuteStr, 10) : 0;

          return hour > currentHour || (hour === currentHour && minute > currentMinute);
        });
      }

      return slots;
    });

    const isStepValid = computed(() => {
      let basicValid = false;
      switch (currentStep.value) {
        case 1:
          basicValid = Boolean(
            userData.value.firstName && userData.value.lastName && userData.value.phone,
          );
          if (bookingLocation.value === 'home') {
            return (
              basicValid &&
              userAddress.value.road &&
              userAddress.value.number &&
              userAddress.value.neighborhood &&
              userAddress.value.city
            );
          }
          return basicValid;
        case 2:
          return true;
        case 3:
          return Boolean(localBookingData.value.date && localBookingData.value.time);
        case 4:
          return true;
        default:
          return false;
      }
    });

    function generateTimeSlots(startHour: number, endHour: number): string[] {
      const slots: string[] = [];
      for (let hour = startHour; hour < endHour; hour++) {
        const time = `${hour.toString().padStart(2, '0')}:00`;
        slots.push(time);
      }
      return slots;
    }

    function formatStreetName() {
      if (userAddress.value.road) {
        const road = userAddress.value.road;
        const roadParts = road.split(',')[0]?.trim() || '';
        userAddress.value.road = roadParts
          .toLowerCase()
          .split(' ')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');

        if (
          userAddress.value.reference &&
          userAddress.value.reference.trim().toLowerCase() !== roadParts.trim().toLowerCase()
        ) {
          userAddress.value.road = `${userAddress.value.road}, ${userAddress.value.reference.trim()}`;
        }
      }
    }

    function selectProfessional(professional: Professional | null) {
      localBookingData.value.professional = professional;
      localBookingData.value.time = null;
    }

    function selectTimeSlot(time: string) {
      localBookingData.value.time = time;
    }

    function validateEmail(email: string): boolean {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    }

    function formatDateTime(date: string, time: string | null): string {
      if (!date || !time) return 'Não especificado';
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      };
      const dateStr = new Date(date).toLocaleDateString('pt-BR', options);
      return `${dateStr} às ${time}`;
    }

    function formatPrice(price: number): string {
      if (isNaN(price)) return 'Preço sob consulta';
      return new Intl.NumberFormat('pt-MZ', {
        style: 'currency',
        currency: 'MZN',
      }).format(price);
    }

    function calculateTotalPrice(): number {
      return localBookingData.value.services.reduce(
        (total, service) => total + (service.servicePrice || 0),
        0,
      );
    }

    function removeService(index: number) {
      if (localBookingData.value.services.length > 1) {
        localBookingData.value.services.splice(index, 1);
      } else {
        $q.notify({
          type: 'warning',
          message: 'Você deve selecionar pelo menos um serviço',
        });
      }
    }

    function previousStep() {
      if (currentStep.value > 1) {
        currentStep.value--;
        showErrors.value = false;
      }
    }

    function nextStep() {
      showErrors.value = true;

      if (bookingLocation.value === 'home') {
        formatStreetName();
      }

      if (isStepValid.value) {
        currentStep.value++;
        showErrors.value = false;
      } else {
        $q.notify({
          type: 'negative',
          message: 'Por favor, preencha todos os campos obrigatórios',
        });
      }
    }

    async function confirmBooking() {
      isLoading.value = true;
      try {
        const totalPrice = calculateTotalPrice();

        if (bookingLocation.value === 'home') {
          formatStreetName();
        }

        const payload = {
          salonId: localBookingData.value.salon.salonId || '',
          salonName: localBookingData.value.salon.salonName || '',
          services: localBookingData.value.services.map((service) => ({
            serviceId: service.serviceId,
            serviceName: service.serviceName,
            servicePrice: service.servicePrice,
            duration: service.duration,
          })),
          professional: localBookingData.value.professional
            ? {
                staffMemberId: localBookingData.value.professional.staffMemberId,
                staffMemberName: localBookingData.value.professional.staffMemberName,
                staffMemberSpecialty:
                  localBookingData.value.professional.staffMemberSpecialty || '',
                staffMemberRating: localBookingData.value.professional.staffMemberRating,
              }
            : null,
          date: localBookingData.value.date ?? new Date().toISOString().split('T')[0],
          time: localBookingData.value.time ?? '09:00',
          clientData: {
            firstName: userData.value.firstName,
            lastName: userData.value.lastName,
            phone: userData.value.phone,
            email: userData.value.email || '', // ← ADICIONE valor padrão aqui
            gender: userData.value.gender,
          },
          locationType: bookingLocation.value,
          address:
            bookingLocation.value === 'home'
              ? {
                  road: userAddress.value.road,
                  number: userAddress.value.number,
                  block: userAddress.value.block,
                  neighborhood: userAddress.value.neighborhood,
                  city: userAddress.value.city,
                }
              : undefined,
          totalPrice: totalPrice,
          status: 'pending',
          notes: '',
        } as const;

        await bookingStore.createBooking(payload);

        emit('booking-confirmed', payload);
        $q.notify({
          type: 'positive',
          message: 'Agendamento realizado com sucesso!',
        });
      } catch (error) {
        console.error('❌ Erro ao confirmar agendamento:', error);
        $q.notify({
          type: 'negative',
          message: error instanceof Error ? error.message : 'Erro ao confirmar agendamento',
        });
        throw error;
      } finally {
        isLoading.value = false;
      }
    }

    function closeForm() {
      emit('close');
    }

    onMounted(() => {
      userData.value = {
        firstName: 'João',
        lastName: 'Silva',
        phone: '(21) 99999-9999',
        email: 'joao.silva@email.com',
        gender: 'male',
      };
    });

    return {
      bookingLocation,
      currentStep,
      showErrors,
      isLoading,
      userData,
      userAddress,
      localBookingData,
      cities,
      minDate,
      salonStaff,
      salon,
      availableTimeSlots,
      isStepValid,
      generateTimeSlots,
      formatStreetName,
      selectProfessional,
      selectTimeSlot,
      validateEmail,
      formatDateTime,
      formatPrice,
      calculateTotalPrice,
      removeService,
      previousStep,
      nextStep,
      confirmBooking,
      closeForm,
    };
  },
};
</script>
<style scoped>
.booking-form {
  font-family: 'Inter', 'Segoe UI', Roboto, sans-serif;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 100vh;
  padding-bottom: 40px;
  animation: fadeIn 0.8s ease;
}

.header-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  animation: slideDown 0.5s ease;
}

.selected-services {
  display: flex;
  flex-wrap: wrap;
  padding-top: 8px;
  gap: 8px;
}

.service-tag {
  display: inline-flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.25);
  padding: 8px 16px;
  border-radius: 24px;
  font-size: 0.875rem;
  color: white;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  animation: scaleIn 0.3s ease;
  transition: all 0.3s ease;
}

.service-tag:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.remove-service {
  margin-left: 8px;
  color: white !important;
  transition: transform 0.2s ease;
}

.remove-service:hover {
  transform: scale(1.2);
}

.location-tabs {
  background: white !important;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin: 16px 0;
  overflow: hidden;
  animation: fadeIn 0.6s ease;
}

.custom-stepper {
  background: transparent !important;
  box-shadow: none !important;
}

.custom-stepper :deep(.q-stepper__tab) {
  padding: 20px;
  transition: all 0.3s ease;
  border-radius: 12px;
  margin: 0 4px;
}

.custom-stepper :deep(.q-stepper__tab--active) {
  color: #667eea !important;
  background: rgba(102, 126, 234, 0.1);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

.custom-stepper :deep(.q-stepper__tab--done) {
  color: #667eea !important;
}

.custom-stepper :deep(.q-stepper__step-inner) {
  padding: 28px;
  animation: fadeIn 0.5s ease;
}

.step-title {
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 28px;
  font-size: 1.5rem;
  position: relative;
  padding-bottom: 12px;
  animation: slideInLeft 0.5s ease;
}

.step-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 60px;
  height: 4px;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  border-radius: 2px;
}

.custom-input :deep(.q-field__control) {
  border-radius: 14px;
  border: 2px solid #e2e8f0;
  transition: all 0.3s ease;
  background: white;
  animation: fadeInUp 0.5s ease;
}

.custom-input :deep(.q-field__control:hover) {
  border-color: #cbd5e0;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.custom-input :deep(.q-field--focused .q-field__control) {
  border-color: #667eea !important;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.15);
  transform: translateY(-2px);
}

.custom-input :deep(.q-field__label) {
  color: #718096;
  font-weight: 500;
  transition: all 0.3s ease;
}

.custom-input :deep(.q-field__native) {
  color: #2d3748;
  font-weight: 500;
}

.gender-options {
  margin-top: 12px;
  animation: fadeIn 0.6s ease;
}

.gender-btn {
  border-radius: 12px !important;
  padding: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
  border: 2px solid #e2e8f0;
}

.gender-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  border-color: #667eea;
}

.address-section {
  border-top: 1px solid #e2e8f0;
  padding-top: 24px;
  animation: fadeIn 0.7s ease;
}

.salon-card {
  border-radius: 20px;
  border: 2px solid #e2e8f0;
  transition: all 0.4s ease;
  overflow: hidden;
  animation: fadeInUp 0.6s ease;
}

.salon-card:hover {
  border-color: #667eea;
  transform: translateY(-5px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
}

.time-slots {
  margin-top: 24px;
  animation: fadeIn 0.7s ease;
}

.time-slot-btn {
  border-radius: 14px;
  padding: 14px;
  font-weight: 600;
  border: 2px solid #e2e8f0;
  transition: all 0.3s ease;
}

.time-slot-btn:hover {
  transform: translateY(-3px);
  border-color: #667eea;
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.2);
}

.time-slot-btn:active {
  transform: translateY(0);
}

.no-slots {
  color: #a0aec0;
  padding: 48px 24px;
  background: #f8fafc;
  border-radius: 20px;
  border: 2px dashed #e2e8f0;
  text-align: center;
  animation: pulse 2s infinite;
}

.professionals-list {
  margin-top: 24px;
  animation: fadeIn 0.7s ease;
}

.professional-card {
  border-radius: 20px;
  border: 2px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.4s ease;
  overflow: hidden;
  animation: fadeInUp 0.6s ease;
}

.professional-card:hover {
  border-color: #667eea;
  transform: translateY(-5px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
}

.professional-selected {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white !important;
  border-color: #667eea !important;
  transform: scale(1.02);
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
}

.professional-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.professional-card:hover .professional-avatar {
  transform: scale(1.05);
}

.rating {
  display: flex;
  align-items: center;
  margin-top: 6px;
}

.confirmation-title {
  font-weight: 800;
  color: #2d3748;
  margin-bottom: 36px;
  font-size: 1.8rem;
  text-align: center;
  animation: fadeIn 0.6s ease;
}

.booking-summary {
  border-radius: 24px;
  border: 2px solid #e2e8f0;
  overflow: hidden;
  animation: zoomIn 0.6s ease;
  background: white;
}

.summary-section {
  margin-bottom: 28px;
  animation: fadeIn 0.7s ease;
}

.summary-section h6 {
  font-weight: 700;
  color: #4a5568;
  margin-bottom: 20px;
  font-size: 1.2rem;
  position: relative;
  padding-bottom: 8px;
}

.summary-section h6::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 40px;
  height: 3px;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  border-radius: 2px;
}

.summary-item {
  padding: 10px 0;
  border-bottom: 1px solid #f1f5f9;
  transition: all 0.3s ease;
}

.summary-item:hover {
  background: #f8fafc;
  padding-left: 8px;
  border-radius: 8px;
}

.services-list {
  background: #f8fafc;
  padding: 20px;
  border-radius: 16px;
  animation: fadeIn 0.8s ease;
}

.service-item {
  padding: 10px 0;
  animation: fadeInUp 0.6s ease;
}

.service-name {
  color: #4a5568;
  font-weight: 500;
}

.service-price {
  color: #667eea;
  font-weight: 700;
}

.total-price {
  color: #667eea !important;
  font-size: 1.4rem;
  font-weight: 800;
  animation: pulse 2s infinite;
}

.status-pending {
  color: #ed8936 !important;
  font-weight: 600;
  animation: pulse 2s infinite;
}

.summary-separator {
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  height: 3px;
  border-radius: 2px;
  margin: 20px 0;
  opacity: 0.6;
}

.stepper-navigation {
  padding: 28px;
  background: white;
  border-top: 1px solid #e2e8f0;
  margin-top: 24px;
  border-radius: 0 0 20px 20px;
  animation: fadeInUp 0.6s ease;
}

.nav-btn {
  border-radius: 14px;
  padding: 14px 28px;
  font-weight: 700;
  text-transform: none;
  transition: all 0.4s ease;
  font-size: 1rem;
}

.nav-btn-back {
  background: #f7fafc;
  color: #4a5568;
  border: 2px solid #e2e8f0;
}

.nav-btn-back:hover {
  background: #edf2f7;
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}

.nav-btn-next,
.nav-btn-confirm {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.nav-btn-next:hover,
.nav-btn-confirm:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.5);
  background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
}

.nav-btn-next:active,
.nav-btn-confirm:active {
  transform: translateY(0);
}

/* Responsividade */
@media (max-width: 600px) {
  .stepper-navigation {
    flex-direction: column;
    gap: 16px;
    padding: 20px;
  }

  .nav-btn {
    width: 100%;
    justify-content: center;
  }

  .gender-options .col-4 {
    width: 100%;
    margin-bottom: 12px;
  }

  .professional-card {
    flex-direction: column;
    text-align: center;
  }

  .time-slot-btn {
    font-size: 0.9rem;
    padding: 12px;
  }

  .step-title {
    font-size: 1.3rem;
  }
}

/* Animações personalizadas */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes zoomIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
  100% {
    transform: scale(1);
  }
}

/* Estados de loading */
.nav-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  animation: pulse 2s infinite;
}

/* Melhorias de acessibilidade */
.q-btn:focus,
.q-input:focus,
.q-select:focus {
  outline: 2px solid #667eea;
  outline-offset: 2px;
}

/* Estilos para validação */
.q-field--error .q-field__control {
  border-color: #e53e3e !important;
  animation: shake 0.5s ease;
}

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

.error-message {
  color: #e53e3e;
  font-size: 0.85rem;
  margin-top: 6px;
  animation: fadeIn 0.3s ease;
}
</style>
