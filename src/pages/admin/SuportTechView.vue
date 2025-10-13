<template>
  <q-layout view="hHh Lpr lFf">
    <q-page-container>
      <q-page class="support-page bg-grey-1">
        <!-- Botão Voltar -->
        <div class="back-button-container q-pa-md">
          <q-btn
            icon="arrow_back"
            label="Voltar"
            color="primary"
            @click="goBack"
            flat
            rounded
            class="q-mb-sm"
          />
        </div>

        <!-- Hero Section -->
        <div class="hero-section bg-primary text-white">
          <div class="container">
            <div class="row items-center q-col-gutter-xl">
              <div class="col-12 col-md-6">
                <h1 class="hero-title text-h2 text-weight-bold">Suporte Técnico</h1>
                <p class="hero-subtitle text-h6 q-mt-md">
                  Estamos aqui para ajudar você! Entre em contato com nossa equipe especializada
                </p>
                <div class="hero-stats row q-mt-xl">
                  <div class="col-4 text-center">
                    <div class="stat-number text-h4 text-weight-bold">24/7</div>
                    <div class="stat-label">Suporte</div>
                  </div>
                  <div class="col-4 text-center">
                    <div class="stat-number text-h4 text-weight-bold">98%</div>
                    <div class="stat-label">Satisfação</div>
                  </div>
                  <div class="col-4 text-center">
                    <div class="stat-number text-h4 text-weight-bold">15min</div>
                    <div class="stat-label">Resposta</div>
                  </div>
                </div>
              </div>
              <div class="col-12 col-md-6">
                <q-img
                  src="../../assets/err/Privacy_policy_amico.png"
                  alt="Suporte Técnico"
                  class="hero-image"
                  :style="imageStyle"
                >
                  <template v-slot:error>
                    <div class="flex flex-center column text-white">
                      <q-icon name="support_agent" size="xl" />
                      <div class="text-h6 q-mt-md">Suporte BeautyTime</div>
                    </div>
                  </template>
                </q-img>
              </div>
            </div>
          </div>
        </div>

        <!-- Contact Options -->
        <section class="contact-options q-pa-xl">
          <div class="container">
            <div class="text-center q-mb-xl">
              <h2 class="section-title text-h3 text-weight-bold text-primary">
                Como podemos ajudar?
              </h2>
              <p class="text-h6 text-grey-7">Escolha a melhor forma de entrar em contato conosco</p>
            </div>

            <div class="row q-col-gutter-xl">
              <div class="col-12 col-md-4" v-for="(option, index) in contactOptions" :key="index">
                <q-card class="contact-card text-center" flat bordered>
                  <q-card-section>
                    <q-icon :name="option.icon" size="xl" :color="option.color" />
                    <h3 class="text-h6 q-mt-md text-weight-bold">{{ option.title }}</h3>
                    <p class="q-mt-sm text-grey-7">{{ option.description }}</p>
                    <q-btn
                      :color="option.color"
                      :label="option.buttonText"
                      unelevated
                      class="q-mt-md"
                      @click="selectOption(option)"
                    />
                  </q-card-section>
                </q-card>
              </div>
            </div>
          </div>
        </section>

        <!-- FAQ Section -->
        <section class="faq-section bg-grey-2 q-pa-xl">
          <div class="container">
            <div class="text-center q-mb-xl">
              <h2 class="section-title text-h3 text-weight-bold text-primary">
                Perguntas Frequentes
              </h2>
              <p class="text-h6 text-grey-7">Encontre respostas para as dúvidas mais comuns</p>
            </div>

            <div class="faq-list">
              <q-expansion-item
                v-for="(faq, index) in faqs"
                :key="index"
                :label="faq.question"
                :caption="faq.category"
                class="q-mb-md"
                header-class="bg-grey-3"
              >
                <template v-slot:header>
                  <q-item-section>
                    <q-item-label class="text-weight-bold">{{ faq.question }}</q-item-label>
                    <q-item-label caption>{{ faq.category }}</q-item-label>
                  </q-item-section>
                </template>

                <q-card>
                  <q-card-section>
                    <p class="q-mb-sm">{{ faq.answer }}</p>
                    <div v-if="faq.related" class="q-mt-sm">
                      <q-chip size="sm" color="blue" text-color="white">
                        Relacionado: {{ faq.related }}
                      </q-chip>
                    </div>
                  </q-card-section>
                </q-card>
              </q-expansion-item>
            </div>
          </div>
        </section>

        <!-- Contact Form -->
        <section class="contact-form-section q-pa-xl" v-if="selectedOption">
          <div class="container">
            <div class="text-center q-mb-xl">
              <h2 class="section-title text-h3 text-weight-bold text-primary">
                {{ selectedOption.formTitle }}
              </h2>
              <p class="text-h6 text-grey-7">
                Preencha o formulário abaixo e entraremos em contato em breve
              </p>
            </div>

            <q-form @submit="submitForm" class="form-container">
              <div class="row q-col-gutter-md">
                <div class="col-12 col-md-6">
                  <q-input
                    v-model="formData.name"
                    label="Nome completo *"
                    outlined
                    :rules="[(val) => !!val || 'Nome é obrigatório']"
                  />
                </div>
                <div class="col-12 col-md-6">
                  <q-input
                    v-model="formData.email"
                    label="Email *"
                    type="email"
                    outlined
                    :rules="[
                      (val) => !!val || 'Email é obrigatório',
                      (val) => /.+@.+\..+/.test(val) || 'Email inválido',
                    ]"
                  />
                </div>
                <div class="col-12 col-md-6" v-if="selectedOption.requiresPhone">
                  <q-input
                    v-model="formData.phone"
                    label="Telefone *"
                    mask="(##) #####-####"
                    outlined
                    :rules="[(val) => !!val || 'Telefone é obrigatório']"
                  />
                </div>
                <div class="col-12 col-md-6" v-if="selectedOption.requiresSubject">
                  <q-input
                    v-model="formData.subject"
                    label="Assunto *"
                    outlined
                    :rules="[(val) => !!val || 'Assunto é obrigatório']"
                  />
                </div>
                <div class="col-12">
                  <q-select
                    v-model="formData.priority"
                    :options="priorityOptions"
                    label="Prioridade"
                    outlined
                    emit-value
                    map-options
                  />
                </div>
                <div class="col-12">
                  <q-input
                    v-model="formData.message"
                    label="Mensagem *"
                    type="textarea"
                    rows="5"
                    outlined
                    :rules="[(val) => !!val || 'Mensagem é obrigatória']"
                  />
                </div>
                <div class="col-12">
                  <q-file
                    v-model="formData.attachments"
                    label="Anexos (opcional)"
                    multiple
                    outlined
                    counter
                    accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                    :max-files="3"
                    :max-total-size="10485760"
                  >
                    <template v-slot:append>
                      <q-icon name="attach_file" />
                    </template>
                  </q-file>
                </div>
                <div class="col-12">
                  <q-btn
                    label="Enviar Solicitação"
                    type="submit"
                    color="primary"
                    size="lg"
                    :loading="loading"
                    class="full-width"
                  >
                    <template v-slot:loading>
                      <q-spinner-hourglass class="on-left" />
                      Enviando...
                    </template>
                  </q-btn>
                </div>
              </div>
            </q-form>
          </div>
        </section>

        <!-- Live Chat Button -->
        <q-btn fab color="primary" icon="chat" class="fixed-bottom-right q-ma-md" @click="openChat">
          <q-badge color="red" floating v-if="unreadMessages > 0">
            {{ unreadMessages }}
          </q-badge>
          <q-tooltip>Chat de suporte ao vivo</q-tooltip>
        </q-btn>

        <!-- Status Indicator -->
        <div class="status-indicator fixed-top-right q-ma-md">
          <q-chip color="green" text-color="white" icon="circle"> Suporte Online </q-chip>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';

const $q = useQuasar();
const router = useRouter();

interface ContactOption {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  buttonText: string;
  formTitle: string;
  requiresPhone: boolean;
  requiresSubject: boolean;
}

interface FAQ {
  question: string;
  answer: string;
  category: string;
  related?: string;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  priority: string;
  message: string;
  attachments: File[] | null;
}

const imageStyle = ref({
  maxWidth: '100%',
  height: 'auto',
  borderRadius: '16px',
});

const selectedOption = ref<ContactOption | null>(null);
const loading = ref(false);
const unreadMessages = ref(0);

const formData = reactive<FormData>({
  name: '',
  email: '',
  phone: '',
  subject: '',
  priority: 'medium',
  message: '',
  attachments: null,
});

const priorityOptions = [
  { label: 'Baixa', value: 'low' },
  { label: 'Média', value: 'medium' },
  { label: 'Alta', value: 'high' },
  { label: 'Urgente', value: 'urgent' },
];

const contactOptions: ContactOption[] = [
  {
    id: 'technical',
    title: 'Suporte Técnico',
    description: 'Problemas com a plataforma, bugs ou erros técnicos',
    icon: 'bug_report',
    color: 'red',
    buttonText: 'Reportar Problema',
    formTitle: 'Suporte Técnico',
    requiresPhone: false,
    requiresSubject: true,
  },
  {
    id: 'billing',
    title: 'Suporte Financeiro',
    description: 'Dúvidas sobre pagamentos, faturas ou cobranças',
    icon: 'payments',
    color: 'green',
    buttonText: 'Ajuda Financeira',
    formTitle: 'Suporte Financeiro',
    requiresPhone: true,
    requiresSubject: true,
  },
  {
    id: 'account',
    title: 'Suporte de Conta',
    description: 'Problemas com login, recuperação de conta ou acesso',
    icon: 'account_circle',
    color: 'blue',
    buttonText: 'Ajuda com Conta',
    formTitle: 'Suporte de Conta',
    requiresPhone: true,
    requiresSubject: false,
  },
];

const faqs: FAQ[] = [
  {
    question: 'Como resetar minha senha?',
    answer:
      'Você pode resetar sua senha clicando em "Esqueci minha senha" na página de login. Um email com instruções será enviado para você.',
    category: 'Conta',
    related: 'Recuperação de acesso',
  },
  {
    question: 'Quais formas de pagamento são aceitas?',
    answer:
      'Aceitamos cartão de crédito (Visa, Mastercard, American Express), PIX, transferência bancária e boleto.',
    category: 'Pagamento',
  },
  {
    question: 'Como agendar um serviço?',
    answer:
      'Faça login na plataforma, navegue até a seção "Agendar" e siga os passos para escolher o serviço, profissional e horário desejado.',
    category: 'Agendamento',
  },
  {
    question: 'Posso cancelar um agendamento?',
    answer:
      'Sim, você pode cancelar até 24 horas antes do horário marcado sem custos. Cancelamentos com menos de 24 horas podem ter taxas.',
    category: 'Agendamento',
    related: 'Política de cancelamento',
  },
  {
    question: 'O suporte funciona 24 horas?',
    answer:
      'Nosso suporte técnico está disponível 24/7 via chat e email. O suporte telefônico funciona das 8h às 20h.',
    category: 'Suporte',
  },
];

// Função para voltar à rota anterior ou página inicial
const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1); // Volta para a página anterior
  } else {
    void router.push('/'); // Vai para a página inicial se não houver histórico
  }
};

const selectOption = (option: ContactOption) => {
  selectedOption.value = option;
  // Scroll to form
  setTimeout(() => {
    const formSection = document.querySelector('.contact-form-section');
    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth' });
    }
  }, 100);
};

const submitForm = async () => {
  loading.value = true;

  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    $q.notify({
      type: 'positive',
      message: 'Solicitação enviada com sucesso!',
      caption: 'Entraremos em contato em breve.',
      icon: 'check_circle',
    });

    // Reset form
    Object.assign(formData, {
      name: '',
      email: '',
      phone: '',
      subject: '',
      priority: 'medium',
      message: '',
      attachments: null,
    });

    selectedOption.value = null;
    // Remova o parâmetro não utilizado
  } catch {
    $q.notify({
      type: 'negative',
      message: 'Erro ao enviar solicitação',
    });
  } finally {
    loading.value = false;
  }
};

const openChat = () => {
  $q.notify({
    message: 'Chat de suporte iniciado',
    caption: 'Um atendente entrará em contato em instantes.',
    icon: 'chat',
    color: 'primary',
  });
  unreadMessages.value = 0;
};

// Simulate incoming messages
onMounted(() => {
  setTimeout(() => {
    unreadMessages.value = 1;
  }, 5000);
});
</script>

<style lang="scss" scoped>
.support-page {
  padding: 0;
}

.back-button-container {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(5px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
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

.hero-stats {
  .stat-number {
    color: #ffd700;
  }

  .stat-label {
    font-size: 0.9rem;
    opacity: 0.8;
    margin-top: 8px;
  }
}

.hero-image {
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.contact-card {
  transition: all 0.3s ease;
  cursor: pointer;
  height: 100%;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  }
}

.form-container {
  max-width: 800px;
  margin: 0 auto;
}

.status-indicator {
  z-index: 1000;
}

// Responsividade
@media (max-width: 768px) {
  .hero-section {
    padding: 60px 0;
    text-align: center;
  }

  .contact-options,
  .faq-section,
  .contact-form-section {
    padding: 40px 16px;
  }

  .hero-stats {
    .col-4 {
      margin-bottom: 20px;
    }
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 12px;
  }

  .hero-title {
    font-size: 2rem;
  }

  .back-button-container {
    text-align: center;
  }
}

// Animações
.contact-card {
  animation: fadeInUp 0.6s ease;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
