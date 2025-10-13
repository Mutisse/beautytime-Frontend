<template>
  <div class="settings-panel">
    <q-card class="header-card q-mb-lg">
      <q-card-section>
        <div class="text-h5 text-primary">Configurações do Sistema</div>
        <div class="text-subtitle1 text-grey-7">
          Configure salões, serviços e preferências do sistema
        </div>
      </q-card-section>
    </q-card>

    <div class="row q-col-gutter-lg">
      <!-- Menu de Configurações -->
      <div class="col-12 col-md-3">
        <q-card>
          <q-list padding>
            <q-item
              v-for="item in settingsMenu"
              :key="item.id"
              clickable
              v-ripple
              :active="activeTab === item.id"
              @click="activeTab = item.id"
              active-class="active-setting"
            >
              <q-item-section avatar>
                <q-icon :name="item.icon" :color="activeTab === item.id ? 'primary' : 'grey'" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ item.label }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>

      <!-- Conteúdo das Configurações -->
      <div class="col-12 col-md-9">
        <q-card>
          <q-card-section>
            <!-- Configurações de Salões -->
            <div v-if="activeTab === 'salons'">
              <div class="text-h6 q-mb-md">Configurações de Salões</div>

              <div class="q-mb-lg">
                <div class="text-subtitle2 q-mb-sm">Salões Cadastrados</div>
                <q-list bordered separator>
                  <q-item v-for="salon in salonSettings.salons" :key="salon.id" class="q-my-xs">
                    <q-item-section avatar>
                      <q-avatar>
                        <img :src="salon.logo" :alt="salon.name" />
                      </q-avatar>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ salon.name }}</q-item-label>
                      <q-item-label caption>{{ salon.address }}</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-toggle
                        v-model="salon.active"
                        @update:model-value="toggleSalonStatus(salon)"
                      />
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>

              <q-form class="q-gutter-md">
                <div class="text-subtitle2">Configurações Gerais dos Salões</div>

                <q-input
                  v-model="salonSettings.defaultWorkHoursStart"
                  label="Horário de Abertura Padrão"
                  type="time"
                  outlined
                />

                <q-input
                  v-model="salonSettings.defaultWorkHoursEnd"
                  label="Horário de Fechamento Padrão"
                  type="time"
                  outlined
                />

                <q-input
                  v-model.number="salonSettings.maxDailyAppointments"
                  label="Máximo de Agendamentos por Dia"
                  type="number"
                  outlined
                />

                <q-toggle
                  v-model="salonSettings.autoConfirmAppointments"
                  label="Confirmação Automática de Agendamentos"
                />

                <q-toggle
                  v-model="salonSettings.allowOnlineBooking"
                  label="Permitir Agendamento Online"
                />

                <div class="row justify-end q-mt-lg">
                  <q-btn label="Salvar Configurações" color="primary" @click="saveSalonSettings" />
                </div>
              </q-form>
            </div>

            <!-- Configurações de Serviços -->
            <div v-if="activeTab === 'services'">
              <div class="text-h6 q-mb-md">Configurações de Serviços</div>

              <div class="q-mb-lg">
                <div class="text-subtitle2 q-mb-sm">Categorias de Serviços</div>
                <div class="row q-col-gutter-sm">
                  <div
                    class="col-12 col-sm-6"
                    v-for="category in serviceSettings.categories"
                    :key="category.id"
                  >
                    <q-card class="category-card">
                      <q-card-section class="flex items-center">
                        <q-avatar :color="category.color" text-color="white" class="q-mr-sm">
                          <q-icon :name="category.icon" />
                        </q-avatar>
                        <div class="flex-grow">
                          <div class="text-weight-medium">{{ category.name }}</div>
                          <div class="text-caption">{{ category.serviceCount }} serviços</div>
                        </div>
                        <q-toggle
                          v-model="category.active"
                          @update:model-value="toggleCategoryStatus(category)"
                        />
                      </q-card-section>
                    </q-card>
                  </div>
                </div>
              </div>

              <q-form class="q-gutter-md">
                <div class="text-subtitle2">Configurações de Preços e Duração</div>

                <q-input v-model="serviceSettings.defaultCurrency" label="Moeda Padrão" outlined />

                <q-input
                  v-model.number="serviceSettings.minServiceDuration"
                  label="Duração Mínima do Serviço (minutos)"
                  type="number"
                  outlined
                />

                <q-input
                  v-model.number="serviceSettings.maxServiceDuration"
                  label="Duração Máxima do Serviço (minutos)"
                  type="number"
                  outlined
                />

                <q-toggle
                  v-model="serviceSettings.allowServiceOverlap"
                  label="Permitir Sobreposição de Serviços"
                />

                <q-toggle
                  v-model="serviceSettings.showServicePrices"
                  label="Mostrar Preços dos Serviços Publicamente"
                />

                <div class="row justify-end q-mt-lg">
                  <q-btn
                    label="Salvar Configurações"
                    color="primary"
                    @click="saveServiceSettings"
                  />
                </div>
              </q-form>
            </div>

            <!-- Configurações de Agendamento -->
            <div v-if="activeTab === 'appointments'">
              <div class="text-h6 q-mb-md">Configurações de Agendamento</div>

              <q-form class="q-gutter-md">
                <q-input
                  v-model.number="appointmentSettings.advanceBookingDays"
                  label="Dias de Antecedência para Agendamento"
                  type="number"
                  outlined
                />

                <q-input
                  v-model.number="appointmentSettings.cancellationNoticeHours"
                  label="Horas de Antecedência para Cancelamento"
                  type="number"
                  outlined
                />

                <q-input
                  v-model.number="appointmentSettings.reminderHours"
                  label="Horas de Antecedência para Lembrete"
                  type="number"
                  outlined
                />

                <q-toggle
                  v-model="appointmentSettings.allowSameDayBooking"
                  label="Permitir Agendamento no Mesmo Dia"
                />

                <q-toggle
                  v-model="appointmentSettings.autoWaitlist"
                  label="Lista de Espera Automática"
                />

                <q-toggle
                  v-model="appointmentSettings.staffConfirmationRequired"
                  label="Confirmação da Equipe Obrigatória"
                />

                <div class="row justify-end q-mt-lg">
                  <q-btn
                    label="Salvar Configurações"
                    color="primary"
                    @click="saveAppointmentSettings"
                  />
                </div>
              </q-form>
            </div>

            <!-- Notificações -->
            <div v-if="activeTab === 'notifications'">
              <div class="text-h6 q-mb-md">Configurações de Notificação</div>

              <div class="q-gutter-y-md">
                <div class="text-subtitle2">Notificações de Salões</div>
                <q-toggle
                  v-model="notificationSettings.salonNewAppointments"
                  label="Novos agendamentos no salão"
                />
                <q-toggle
                  v-model="notificationSettings.salonCancellations"
                  label="Cancelamentos de agendamentos"
                />
                <q-toggle
                  v-model="notificationSettings.salonLowStock"
                  label="Estoque baixo de produtos"
                />

                <q-separator class="q-my-md" />

                <div class="text-subtitle2">Notificações de Serviços</div>
                <q-toggle
                  v-model="notificationSettings.servicePopularityAlerts"
                  label="Alertas de popularidade de serviços"
                />
                <q-toggle
                  v-model="notificationSettings.serviceRevenueGoals"
                  label="Metas de faturamento de serviços"
                />
                <q-toggle
                  v-model="notificationSettings.servicePerformance"
                  label="Desempenho dos serviços"
                />

                <q-separator class="q-my-md" />

                <div class="text-subtitle2">Notificações por Canal</div>
                <q-toggle v-model="notificationSettings.emailEnabled" label="Email" />
                <q-toggle v-model="notificationSettings.smsEnabled" label="SMS" />
                <q-toggle v-model="notificationSettings.pushEnabled" label="Notificações Push" />

                <div class="row justify-end q-mt-lg">
                  <q-btn
                    label="Salvar Configurações"
                    color="primary"
                    @click="saveNotificationSettings"
                  />
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';

// Interfaces
interface SettingsMenuItem {
  id: string;
  label: string;
  icon: string;
}

interface Salon {
  id: number;
  name: string;
  address: string;
  logo: string;
  active: boolean;
}

interface SalonSettings {
  salons: Salon[];
  defaultWorkHoursStart: string;
  defaultWorkHoursEnd: string;
  maxDailyAppointments: number;
  autoConfirmAppointments: boolean;
  allowOnlineBooking: boolean;
}

interface ServiceCategory {
  id: number;
  name: string;
  icon: string;
  color: string;
  serviceCount: number;
  active: boolean;
}

interface ServiceSettings {
  categories: ServiceCategory[];
  defaultCurrency: string;
  minServiceDuration: number;
  maxServiceDuration: number;
  allowServiceOverlap: boolean;
  showServicePrices: boolean;
}

interface AppointmentSettings {
  advanceBookingDays: number;
  cancellationNoticeHours: number;
  reminderHours: number;
  allowSameDayBooking: boolean;
  autoWaitlist: boolean;
  staffConfirmationRequired: boolean;
}

interface NotificationSettings {
  // Salões
  salonNewAppointments: boolean;
  salonCancellations: boolean;
  salonLowStock: boolean;

  // Serviços
  servicePopularityAlerts: boolean;
  serviceRevenueGoals: boolean;
  servicePerformance: boolean;

  // Canais
  emailEnabled: boolean;
  smsEnabled: boolean;
  pushEnabled: boolean;
}

const $q = useQuasar();
const activeTab = ref<string>('salons');

const settingsMenu: SettingsMenuItem[] = [
  { id: 'salons', label: 'Salões', icon: 'fas fa-store' },
  { id: 'services', label: 'Serviços', icon: 'fas fa-concierge-bell' },
  { id: 'appointments', label: 'Agendamentos', icon: 'fas fa-calendar-check' },
  { id: 'notifications', label: 'Notificações', icon: 'fas fa-bell' },
];

const salonSettings = ref<SalonSettings>({
  salons: [
    {
      id: 1,
      name: 'Beauty Time Matola',
      address: 'Matola, Shoprite - próximo ao mercado',
      logo: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=100&h=100&fit=crop',
      active: true,
    },
    {
      id: 2,
      name: 'Beauty Time Maputo',
      address: 'Maputo, Baixa - centro da cidade',
      logo: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=100&h=100&fit=crop',
      active: true,
    },
    {
      id: 3,
      name: 'Beauty Time Costa do Sol',
      address: 'Costa do Sol, praia principal',
      logo: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=100&h=100&fit=crop',
      active: false,
    },
  ],
  defaultWorkHoursStart: '08:00',
  defaultWorkHoursEnd: '18:00',
  maxDailyAppointments: 50,
  autoConfirmAppointments: true,
  allowOnlineBooking: true,
});

const serviceSettings = ref<ServiceSettings>({
  categories: [
    { id: 1, name: 'Cabelo', icon: 'fas fa-cut', color: 'primary', serviceCount: 8, active: true },
    {
      id: 2,
      name: 'Unhas',
      icon: 'fas fa-hand-sparkles',
      color: 'pink',
      serviceCount: 6,
      active: true,
    },
    { id: 3, name: 'Barba', icon: 'fas fa-user', color: 'teal', serviceCount: 4, active: true },
    { id: 4, name: 'Pele', icon: 'fas fa-spa', color: 'orange', serviceCount: 5, active: true },
    {
      id: 5,
      name: 'Massagem',
      icon: 'fas fa-spa',
      color: 'purple',
      serviceCount: 3,
      active: false,
    },
    { id: 6, name: 'Estética', icon: 'fas fa-spa', color: 'cyan', serviceCount: 7, active: true },
  ],
  defaultCurrency: 'MT',
  minServiceDuration: 15,
  maxServiceDuration: 180,
  allowServiceOverlap: false,
  showServicePrices: true,
});

const appointmentSettings = ref<AppointmentSettings>({
  advanceBookingDays: 30,
  cancellationNoticeHours: 24,
  reminderHours: 2,
  allowSameDayBooking: true,
  autoWaitlist: true,
  staffConfirmationRequired: false,
});

const notificationSettings = ref<NotificationSettings>({
  // Salões
  salonNewAppointments: true,
  salonCancellations: true,
  salonLowStock: true,

  // Serviços
  servicePopularityAlerts: true,
  serviceRevenueGoals: true,
  servicePerformance: false,

  // Canais
  emailEnabled: true,
  smsEnabled: false,
  pushEnabled: true,
});

const toggleSalonStatus = (salon: Salon): void => {
  $q.notify({
    message: `Salão ${salon.active ? 'ativado' : 'desativado'} com sucesso!`,
    color: salon.active ? 'positive' : 'warning',
    position: 'top',
  });
};

const toggleCategoryStatus = (category: ServiceCategory): void => {
  $q.notify({
    message: `Categoria ${category.active ? 'ativada' : 'desativada'} com sucesso!`,
    color: category.active ? 'positive' : 'warning',
    position: 'top',
  });
};

const saveSalonSettings = (): void => {
  $q.notify({
    message: 'Configurações de salões salvas com sucesso!',
    color: 'positive',
    position: 'top',
  });
};

const saveServiceSettings = (): void => {
  $q.notify({
    message: 'Configurações de serviços salvas com sucesso!',
    color: 'positive',
    position: 'top',
  });
};

const saveAppointmentSettings = (): void => {
  $q.notify({
    message: 'Configurações de agendamento salvas com sucesso!',
    color: 'positive',
    position: 'top',
  });
};

const saveNotificationSettings = (): void => {
  $q.notify({
    message: 'Configurações de notificação salvas com sucesso!',
    color: 'positive',
    position: 'top',
  });
};
</script>

<style lang="scss" scoped>
.settings-panel {
  .header-card {
    border-left: 4px solid $primary;
  }

  .active-setting {
    background: $blue-1;
    border-right: 3px solid $primary;
  }

  .category-card {
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: $shadow-4;
    }
  }
}
</style>
