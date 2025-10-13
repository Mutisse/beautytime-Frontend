<template>
  <q-page class="services-page bg-grey-1">
    <!-- Hero Section -->
    <div class="hero-section bg-primary text-white">
      <div class="container">
        <div class="row items-center q-col-gutter-xl">
          <div class="col-12 col-md-6">
            <h1 class="hero-title text-h2 text-weight-bold">Serviços da Plataforma</h1>
            <p class="hero-subtitle text-h6 q-mt-md">
              Descubra todos os recursos e funcionalidades que o BeautyTime oferece para
              revolucionar sua experiência em beleza e bem-estar
            </p>
            <div class="hero-features row q-mt-xl">
              <div class="col-6 text-center" v-for="(feature, index) in heroFeatures" :key="index">
                <q-icon :name="feature.icon" size="md" />
                <div class="feature-label q-mt-sm">{{ feature.label }}</div>
              </div>
            </div>
          </div>
          <div class="col-12 col-md-6">
            <q-img
              src="https://images.unsplash.com/photo-1551650975-87deedd944c3?w=600&h=400&fit=crop"
              alt="Plataforma BeautyTime"
              class="hero-image"
              :style="imageStyle"
            >
              <template v-slot:error>
                <div class="flex flex-center column text-white">
                  <q-icon name="dashboard" size="xl" />
                  <div class="text-h6 q-mt-md">BeautyTime Platform</div>
                </div>
              </template>
            </q-img>
          </div>
        </div>
      </div>
    </div>

    <!-- Platform Features -->
    <section class="features-section q-pa-xl">
      <div class="container">
        <div class="text-center q-mb-xl">
          <h2 class="section-title text-h3 text-weight-bold text-primary">
            Recursos da Plataforma
          </h2>
          <p class="text-h6 text-grey-7">Tudo que você precisa em uma única solução</p>
        </div>

        <div class="row q-col-gutter-xl">
          <div
            class="col-12 col-sm-6 col-md-4"
            v-for="(feature, index) in platformFeatures"
            :key="index"
          >
            <q-card class="feature-card text-center">
              <q-card-section>
                <div class="feature-icon-wrapper">
                  <q-icon :name="feature.icon" size="xl" :color="feature.color" />
                </div>
                <h3 class="text-h6 q-mt-md text-weight-bold">{{ feature.name }}</h3>
                <p class="text-caption">{{ feature.description }}</p>
                <div class="q-mt-md">
                  <q-chip
                    v-for="(tag, tagIndex) in feature.tags"
                    :key="tagIndex"
                    size="sm"
                    :color="feature.color"
                    text-color="white"
                  >
                    {{ tag }}
                  </q-chip>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works -->
    <section class="how-it-works-section bg-grey-2 q-pa-xl">
      <div class="container">
        <div class="text-center q-mb-xl">
          <h2 class="section-title text-h3 text-weight-bold text-primary">Como Funciona</h2>
          <p class="text-h6 text-grey-7">Uma experiência simples e eficiente para todos</p>
        </div>

        <div class="row q-col-gutter-xl">
          <div class="col-12 col-md-6" v-for="(step, index) in howItWorks" :key="index">
            <q-card class="step-card">
              <q-card-section class="row items-center">
                <div class="step-number col-auto">
                  {{ index + 1 }}
                </div>
                <div class="col">
                  <h3 class="text-h6 text-weight-bold">{{ step.title }}</h3>
                  <p class="text-caption">{{ step.description }}</p>
                  <div class="q-mt-sm">
                    <q-badge
                      v-for="(benefit, benefitIndex) in step.benefits"
                      :key="benefitIndex"
                      color="primary"
                      class="q-mr-xs q-mb-xs"
                    >
                      {{ benefit }}
                    </q-badge>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing Plans -->
    <section class="pricing-section q-pa-xl" v-if="pricingPlans.length > 0">
      <div class="container">
        <div class="text-center q-mb-xl">
          <h2 class="section-title text-h3 text-weight-bold text-primary">Planos e Preços</h2>
          <p class="text-h6 text-grey-7">Escolha o plano ideal para suas necessidades</p>
        </div>

        <div class="row q-col-gutter-xl justify-center">
          <div class="col-12 col-md-4" v-for="(plan, index) in pricingPlans" :key="index">
            <q-card class="pricing-card text-center" :class="{ 'popular-plan': plan.popular }">
              <q-card-section>
                <div class="plan-header">
                  <h3 class="text-h5 text-weight-bold">{{ plan.name }}</h3>
                  <p class="text-caption">{{ plan.description }}</p>
                </div>

                <div class="plan-price q-my-lg">
                  <span class="text-h3 text-weight-bold text-primary">{{ plan.price }}</span>
                  <span class="text-caption text-grey-7">/mês</span>
                </div>

                <q-list dense class="text-left">
                  <q-item v-for="(feature, featureIndex) in plan.features" :key="featureIndex">
                    <q-item-section avatar>
                      <q-icon name="check" color="positive" size="sm" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label class="text-caption">{{ feature }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>

                <div class="q-mt-xl">
                  <q-btn
                    :color="plan.popular ? 'primary' : 'grey-7'"
                    :label="plan.buttonText"
                    class="full-width"
                    no-caps
                    :outline="!plan.popular"
                  />
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </section>

    <!-- Integration Section -->
    <section class="integration-section bg-primary text-white q-pa-xl">
      <div class="container">
        <div class="row items-center q-col-gutter-xl">
          <div class="col-12 col-md-6">
            <h2 class="text-h3 text-weight-bold q-mb-md">Integração Perfeita</h2>
            <p class="text-h6 q-mb-lg">
              Conecte o BeautyTime com suas ferramentas favoritas e otimize seu fluxo de trabalho
            </p>
            <div class="row q-col-gutter-sm">
              <div class="col-6" v-for="(integration, index) in integrations" :key="index">
                <q-card class="integration-card text-center">
                  <q-card-section>
                    <q-icon :name="integration.icon" size="md" />
                    <div class="text-caption q-mt-sm">{{ integration.name }}</div>
                  </q-card-section>
                </q-card>
              </div>
            </div>
          </div>
          <div class="col-12 col-md-6">
            <q-img
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=400&fit=crop"
              alt="Integrações"
              class="integration-image"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section bg-dark text-white text-center q-pa-xl">
      <div class="container">
        <h2 class="text-h3 text-weight-bold q-mb-md">Pronto para começar?</h2>
        <p class="text-h6 q-mb-xl">
          Junte-se a milhares de profissionais e clientes que já transformaram sua experiência com o
          BeautyTime
        </p>
        <div class="q-gutter-md">
          <q-btn color="primary" label="Experimentar Gratuitamente" to="/auth" size="lg" no-caps />
          <q-btn
            outline
            color="white"
            label="Agendar Demonstração"
            @click="scheduleDemo"
            size="lg"
            no-caps
          />
        </div>
        <div class="q-mt-lg">
          <p class="text-caption">
            Sem compromisso • Cancelamento a qualquer momento • Suporte 24/7
          </p>
        </div>
      </div>
    </section>

    <!-- Demo Dialog -->
    <q-dialog v-model="demoDialog">
      <q-card style="width: 400px; max-width: 80vw">
        <q-toolbar class="bg-primary text-white">
          <q-toolbar-title> Agendar Demonstração </q-toolbar-title>
          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>

        <q-card-section>
          <q-form @submit="submitDemoRequest">
            <q-input v-model="demoForm.name" label="Seu Nome" class="q-mb-md" required />
            <q-input
              v-model="demoForm.email"
              label="E-mail"
              type="email"
              class="q-mb-md"
              required
            />
            <q-input v-model="demoForm.company" label="Empresa/Salão" class="q-mb-md" />
            <q-select
              v-model="demoForm.interestedIn"
              :options="demoInterests"
              label="Interessado em"
              class="q-mb-md"
            />
            <q-btn
              color="primary"
              label="Solicitar Demonstração"
              type="submit"
              class="full-width"
              no-caps
            />
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';

const $q = useQuasar();

interface PlatformFeature {
  name: string;
  description: string;
  icon: string;
  color: string;
  tags: string[];
}

interface HowItWorks {
  title: string;
  description: string;
  benefits: string[];
}

interface PricingPlan {
  name: string;
  description: string;
  price: string;
  features: string[];
  popular: boolean;
  buttonText: string;
}

interface Integration {
  name: string;
  icon: string;
}

interface DemoForm {
  name: string;
  email: string;
  company: string;
  interestedIn: string;
}

const imageStyle = ref({
  maxWidth: '100%',
  height: 'auto',
  borderRadius: '16px',
});

const demoDialog = ref(false);
const demoForm = ref<DemoForm>({
  name: '',
  email: '',
  company: '',
  interestedIn: '',
});

const heroFeatures = [
  { icon: 'dashboard', label: 'Painel Inteligente' },
  { icon: 'schedule', label: 'Agendamento 24/7' },
  { icon: 'payments', label: 'Pagamentos Seguros' },
  { icon: 'analytics', label: 'Relatórios Avançados' },
];

const platformFeatures: PlatformFeature[] = [
  {
    name: 'Sistema de Agendamento',
    description: 'Agendamentos online com confirmação automática e lembretes inteligentes',
    icon: 'calendar_today',
    color: 'blue',
    tags: ['Online', 'Automático', 'Lembretes'],
  },
  {
    name: 'Gestão de Clientes',
    description: 'CRM completo com histórico de serviços, preferências e ficha técnica',
    icon: 'people',
    color: 'green',
    tags: ['CRM', 'Histórico', 'Preferências'],
  },
  {
    name: 'Pagamentos Digitais',
    description: 'Múltiplas formas de pagamento com segurança e relatórios financeiros',
    icon: 'credit_card',
    color: 'purple',
    tags: ['MPesa', 'EMola', 'Cartões'],
  },
  {
    name: 'Marketing Digital',
    description: 'Ferramentas de marketing para fidelização e captação de clientes',
    icon: 'campaign',
    color: 'orange',
    tags: ['Promoções', 'Fidelidade', 'Email'],
  },
  {
    name: 'Relatórios Avançados',
    description: 'Dashboard com métricas de performance e insights de negócio',
    icon: 'analytics',
    color: 'red',
    tags: ['Dashboard', 'Métricas', 'Insights'],
  },
  {
    name: 'App Móvel',
    description: 'Aplicativo nativo para iOS e Android para gestão em qualquer lugar',
    icon: 'phone_iphone',
    color: 'teal',
    tags: ['iOS', 'Android', 'Offline'],
  },
];

const howItWorks: HowItWorks[] = [
  {
    title: 'Cadastro e Configuração',
    description: 'Configure sua conta em minutos e personalize conforme suas necessidades',
    benefits: ['Cadastro Rápido', 'Configuração Personalizada', 'Onboarding'],
  },
  {
    title: 'Integração com Seu Negócio',
    description: 'Conecte seus serviços, profissionais e fluxo de trabalho atual',
    benefits: ['Importação de Dados', 'Integração de Serviços', 'Migração Assistida'],
  },
  {
    title: 'Treinamento da Equipe',
    description: 'Capacite sua equipe com treinamentos especializados e suporte contínuo',
    benefits: ['Treinamento Online', 'Documentação', 'Suporte Dedicado'],
  },
  {
    title: 'Go-Live e Otimização',
    description: 'Inicie as operações e otimize continuamente com nossos insights',
    benefits: ['Implementação', 'Otimização', 'Melhoria Contínua'],
  },
];

const pricingPlans: PricingPlan[] = [
  {
    name: 'Básico',
    description: 'Perfeito para profissionais autônomos',
    price: 'MT 500',
    features: [
      'Até 2 profissionais',
      'Agendamento online',
      'Gestão de clientes básica',
      'Relatórios mensais',
      'Suporte por email',
    ],
    popular: false,
    buttonText: 'Começar Gratuitamente',
  },
  {
    name: 'Profissional',
    description: 'Ideal para pequenos e médios salões',
    price: 'MT 1.200',
    features: [
      'Até 10 profissionais',
      'Todos os recursos do Básico',
      'Pagamentos digitais',
      'Marketing automation',
      'Relatórios avançados',
      'Suporte prioritário',
    ],
    popular: true,
    buttonText: 'Testar 14 Dias Grátis',
  },
  {
    name: 'Enterprise',
    description: 'Para redes de salões e grandes negócios',
    price: 'MT 2.500',
    features: [
      'Profissionais ilimitados',
      'Todos os recursos do Profissional',
      'API personalizada',
      'Treinamento dedicado',
      'Relatórios customizados',
      'Suporte 24/7',
    ],
    popular: false,
    buttonText: 'Falar com Vendas',
  },
];

const integrations: Integration[] = [
  { name: 'WhatsApp', icon: 'chat' },
  { name: 'Instagram', icon: 'camera_alt' },
  { name: 'Google Calendar', icon: 'event' },
  { name: 'MPesa', icon: 'payments' },
  { name: 'EMola', icon: 'account_balance' },
  { name: 'Email Marketing', icon: 'email' },
];

const demoInterests = [
  'Sistema de Agendamento',
  'Gestão de Clientes',
  'Pagamentos Digitais',
  'Marketing Digital',
  'Relatórios Avançados',
  'App Móvel',
  'Todos os Recursos',
];

const scheduleDemo = () => {
  demoDialog.value = true;
};

const submitDemoRequest = () => {
  $q.notify({
    type: 'positive',
    message: 'Demonstração solicitada!',
    caption: 'Nossa equipe entrará em contato em até 24 horas.',
    icon: 'event_available',
  });
  demoDialog.value = false;
  // Reset form
  demoForm.value = {
    name: '',
    email: '',
    company: '',
    interestedIn: '',
  };
};
</script>

<style lang="scss" scoped>
.services-page {
  padding: 0;
}

.hero-section {
  padding: 80px 0;
  background: linear-gradient(135deg, #1976d2 0%, #0d47a1 100%);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}

.hero-title {
  font-size: clamp(2rem, 5vw, 3.5rem);
  line-height: 1.2;
}

.hero-subtitle {
  opacity: 0.9;
  font-weight: 400;
}

.hero-features {
  .feature-label {
    font-size: 0.8rem;
    opacity: 0.9;
    margin-top: 8px;
  }
}

.hero-image {
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.feature-card {
  transition: all 0.3s ease;
  height: 100%;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  }

  .feature-icon-wrapper {
    padding: 20px;
    border-radius: 50%;
    background: rgba(25, 118, 210, 0.1);
    display: inline-block;
  }
}

.step-card {
  transition: all 0.3s ease;

  &:hover {
    transform: translateX(5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }

  .step-number {
    width: 40px;
    height: 40px;
    background: #1976d2;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    margin-right: 16px;
  }
}

.pricing-card {
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  }

  &.popular-plan {
    border: 2px solid #1976d2;
    transform: scale(1.05);

    &::before {
      content: 'MAIS POPULAR';
      position: absolute;
      top: 0;
      right: 0;
      background: #1976d2;
      color: white;
      padding: 4px 12px;
      font-size: 0.7rem;
      font-weight: bold;
      border-bottom-left-radius: 8px;
    }
  }

  .plan-price {
    .text-h3 {
      font-size: 2.5rem;
    }
  }
}

.integration-section {
  background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
}

.integration-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }
}

.integration-image {
  border-radius: 16px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
}

.cta-section.bg-dark {
  background: linear-gradient(135deg, #1a237e 0%, #283593 100%);
}

// Responsividade
@media (max-width: 768px) {
  .hero-section {
    padding: 60px 0;
    text-align: center;
  }

  .features-section,
  .how-it-works-section,
  .pricing-section,
  .integration-section {
    padding: 40px 0;
  }

  .pricing-card.popular-plan {
    transform: none;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 12px;
  }

  .hero-title {
    font-size: 2rem;
  }
}
</style>
