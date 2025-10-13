<template>
  <div class="salon-create-page">
    <!-- Header da Página -->
    <div class="page-header">
      <div class="header-content">
        <!-- Botão Voltar adicionado -->
        <div class="header-top">
          <q-btn @click="goBack" icon="arrow_back" label="Voltar" flat class="back-button" />
        </div>

        <h1 class="page-title">
          <q-icon name="store" class="q-mr-md" />
          Cadastro de Salão de Beleza
        </h1>
        <p class="page-description">
          Complete o formulário abaixo para cadastrar seu salão na plataforma BeautyTime
        </p>
        <div class="header-stats">
          <div class="stat-item">
            <q-icon name="people" />
            <span>+500 salões cadastrados</span>
          </div>
          <div class="stat-item">
            <q-icon name="star" />
            <span>Avaliação média: 4.8/5</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Container Principal -->
    <div class="page-container">
      <!-- Sidebar de Navegação -->
      <div class="sidebar">
        <div class="sidebar-card progress-card">
          <div class="card-header">
            <h3>Progresso do Cadastro</h3>
            <q-btn
              flat
              round
              dense
              icon="refresh"
              @click="resetProgress"
              class="refresh-btn"
              title="Reiniciar progresso"
            />
          </div>
          <div class="progress-info">
            <div
              class="progress-step"
              v-for="(step, index) in steps"
              :key="index"
              @click="goToStep(index + 1)"
            >
              <div
                class="step-indicator"
                :class="{
                  active: currentStep === index + 1,
                  completed: currentStep > index + 1,
                  clickable: currentStep > index + 1,
                }"
              >
                <q-icon v-if="currentStep > index + 1" name="check" />
                <span v-else>{{ index + 1 }}</span>
              </div>
              <div class="step-info">
                <span class="step-label">{{ step.label }}</span>
                <span class="step-status" v-if="currentStep === index + 1">Atual</span>
                <span class="step-estimate" v-if="step.estimate">{{ step.estimate }}</span>
              </div>
              <q-icon
                v-if="currentStep > index + 1"
                name="edit"
                class="edit-step"
                title="Editar este passo"
              />
            </div>
          </div>

          <div class="completion-stats">
            <div class="completion-header">
              <span>Progresso Geral</span>
              <span>{{ completionPercentage }}%</span>
            </div>
            <div class="completion-bar">
              <div class="completion-fill" :style="{ width: completionPercentage + '%' }">
                <div class="completion-pulse"></div>
              </div>
            </div>
            <div class="completion-time" v-if="estimatedTime > 0">
              <q-icon name="schedule" />
              <span>Tempo estimado: {{ estimatedTime }}min</span>
            </div>
          </div>
        </div>

        <div class="sidebar-card help-card">
          <div class="card-header">
            <h3><q-icon name="help" class="q-mr-sm" /> Ajuda Rápida</h3>
          </div>
          <div class="help-content">
            <div class="tip-item">
              <q-icon name="lightbulb" class="tip-icon" />
              <div class="tip-content">
                <strong>Dica:</strong> Tenha à mão documentos como alvará e CNI para agilizar.
              </div>
            </div>
            <div class="tip-item">
              <q-icon name="photo_camera" class="tip-icon" />
              <div class="tip-content">
                <strong>Fotos:</strong> Prepare fotos do seu espaço para atrair mais clientes.
              </div>
            </div>

            <div class="help-actions">
              <q-btn
                class="help-btn primary"
                @click="showHelpModal = true"
                icon="support"
                label="Central de Ajuda"
              />
              <q-btn
                class="help-btn outline"
                @click="goToSupport"
                icon="headset"
                label="Suporte Técnico"
                outline
              />
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="sidebar-card actions-card">
          <div class="card-header">
            <h3><q-icon name="flash_on" class="q-mr-sm" /> Ações Rápidas</h3>
          </div>
          <div class="actions-content">
            <q-btn class="action-btn" @click="saveDraft" icon="save" label="Salvar Rascunho" flat />
            <q-btn
              class="action-btn"
              @click="previewSalon"
              icon="visibility"
              label="Pré-visualizar"
              flat
            />
            <q-btn
              class="action-btn"
              @click="exportData"
              icon="download"
              label="Exportar Dados"
              flat
            />
          </div>
        </div>
      </div>

      <!-- Área do Formulário -->
      <div class="content-area">
        <!-- Card do Formulário -->
        <div class="form-card">
          <!-- Header do Formulário -->
          <div class="form-header">
            <div class="form-title-section">
              <div class="step-badge">Passo {{ currentStep }}</div>
              <h2 class="form-title">
                <q-icon :name="currentStepIcon" class="q-mr-md" />
                {{ currentStepTitle }}
              </h2>
              <p class="form-subtitle">{{ currentStepDescription }}</p>
            </div>
          </div>

          <!-- Componente do Formulário -->
          <div class="form-content" :class="{ loading: isLoading }">
            <div class="form-placeholder">
              <h3>Formulário de Cadastro - Passo {{ currentStep }}</h3>
              <p>{{ currentStepDescription }}</p>

              <div class="form-fields">
                <template v-if="currentStep === 1">
                  <q-input filled label="Nome do Salão" class="q-mb-md" v-model="formData.name" />
                  <q-input
                    filled
                    label="Descrição"
                    type="textarea"
                    class="q-mb-md"
                    v-model="formData.description"
                  />
                  <q-input
                    filled
                    label="Anos de Experiência"
                    type="number"
                    class="q-mb-md"
                    v-model="formData.experienceYears"
                  />
                </template>

                <template v-if="currentStep === 2">
                  <q-input filled label="Endereço" class="q-mb-md" v-model="formData.address" />
                  <q-input filled label="Cidade" class="q-mb-md" v-model="formData.city" />
                  <q-input filled label="Bairro" class="q-mb-md" v-model="formData.neighborhood" />
                </template>

                <template v-if="currentStep === 3">
                  <q-input
                    filled
                    label="Telefone"
                    mask="(##) #####-####"
                    class="q-mb-md"
                    v-model="formData.phone"
                  />
                  <q-input
                    filled
                    label="Email"
                    type="email"
                    class="q-mb-md"
                    v-model="formData.email"
                  />
                  <q-input
                    filled
                    label="Website (opcional)"
                    class="q-mb-md"
                    v-model="formData.website"
                  />
                </template>

                <template v-if="currentStep === 4">
                  <q-checkbox
                    label="Corte de Cabelo"
                    class="q-mb-sm"
                    v-model="formData.services.haircut"
                  />
                  <q-checkbox
                    label="Manicure"
                    class="q-mb-sm"
                    v-model="formData.services.manicure"
                  />
                  <q-checkbox
                    label="Pedicure"
                    class="q-mb-sm"
                    v-model="formData.services.pedicure"
                  />
                  <q-checkbox
                    label="Maquilhagem"
                    class="q-mb-sm"
                    v-model="formData.services.makeup"
                  />
                  <q-checkbox
                    label="Tratamentos Faciais"
                    class="q-mb-sm"
                    v-model="formData.services.facialTreatments"
                  />
                </template>

                <template v-if="currentStep === 5">
                  <q-input
                    filled
                    label="Horário de Abertura"
                    type="time"
                    class="q-mb-md"
                    v-model="formData.openingTime"
                  />
                  <q-input
                    filled
                    label="Horário de Fechamento"
                    type="time"
                    class="q-mb-md"
                    v-model="formData.closingTime"
                  />
                  <q-checkbox
                    label="Aberto aos Fins de Semana"
                    class="q-mb-md"
                    v-model="formData.openWeekends"
                  />
                </template>
              </div>

              <div class="step-actions">
                <q-btn
                  v-if="currentStep > 1"
                  flat
                  label="Voltar"
                  @click="updateStep(currentStep - 1)"
                  class="q-mr-sm"
                />
                <q-btn
                  v-if="currentStep < steps.length"
                  color="primary"
                  label="Próximo Passo"
                  @click="updateStep(currentStep + 1)"
                />
                <q-btn
                  v-else
                  color="positive"
                  label="Finalizar Cadastro"
                  @click="handleFormSubmit"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Cards Informativos Adicionais -->
        <div class="info-cards">
          <div class="info-card security">
            <div class="info-icon">
              <q-icon name="security" />
            </div>
            <div class="info-content">
              <h4>Segurança dos Dados</h4>
              <p>Suas informações estão protegidas com criptografia de ponta a ponta.</p>
              <a href="#" class="info-link">Saiba mais sobre nossa política de privacidade</a>
            </div>
          </div>

          <div class="info-card benefits">
            <div class="info-icon">
              <q-icon name="rocket_launch" />
            </div>
            <div class="info-content">
              <h4>Vantagens do Cadastro</h4>
              <ul>
                <li>Visibilidade para milhares de clientes</li>
                <li>Sistema de agendamento integrado</li>
                <li>Relatórios de desempenho mensais</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Ajuda Modernizado -->
    <q-dialog v-model="showHelpModal" maximized>
      <q-card class="help-modal">
        <q-card-section class="modal-header">
          <div class="header-content">
            <q-icon name="help" class="modal-icon" />
            <div class="modal-title">
              <h2>Central de Ajuda</h2>
              <p>Encontre respostas para suas dúvidas</p>
            </div>
          </div>
          <q-btn v-close-popup icon="close" flat round dense class="close-btn" />
        </q-card-section>

        <q-card-section class="modal-body">
          <div class="help-grid">
            <div class="help-category">
              <h3><q-icon name="help" /> Dúvidas Frequentes</h3>
              <div class="faq-list">
                <div
                  class="faq-item"
                  v-for="(faq, index) in faqs"
                  :key="index"
                  @click="toggleFaq(index)"
                >
                  <div class="faq-question">
                    <span>{{ faq.question }}</span>
                    <q-icon :name="faq.open ? 'expand_less' : 'expand_more'" />
                  </div>
                  <div class="faq-answer" v-if="faq.open">
                    <p>{{ faq.answer }}</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="help-category">
              <h3><q-icon name="phone" /> Contato Direto</h3>
              <div class="contact-options">
                <div class="contact-option" @click="contactViaWhatsApp">
                  <div class="contact-icon whatsapp">
                    <q-icon name="chat" />
                  </div>
                  <div class="contact-info">
                    <h4>WhatsApp</h4>
                    <p>Suporte rápido via mensagem</p>
                    <span class="contact-detail">+258 84 123 4567</span>
                  </div>
                </div>

                <div class="contact-option" @click="contactViaEmail">
                  <div class="contact-icon email">
                    <q-icon name="email" />
                  </div>
                  <div class="contact-info">
                    <h4>E-mail</h4>
                    <p>Resposta em até 2 horas</p>
                    <span class="contact-detail">suporte@beautytime.co.mz</span>
                  </div>
                </div>

                <div class="contact-option" @click="goToSupport">
                  <div class="contact-icon support">
                    <q-icon name="headset" />
                  </div>
                  <div class="contact-info">
                    <h4>Suporte Técnico</h4>
                    <p>Problemas técnicos e configurações</p>
                    <span class="contact-detail">Acesso direto ao suporte</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Loading Modernizado -->
    <q-inner-loading :showing="isLoading" class="custom-loading">
      <div class="loading-content">
        <div class="loading-spinner">
          <q-spinner-gears size="50px" color="primary" />
          <div class="spinner-ring"></div>
        </div>
        <h3>Processando seu cadastro</h3>
        <p>Estamos preparando tudo para o seu salão...</p>
        <div class="loading-progress">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: loadingProgress + '%' }"></div>
          </div>
          <span>{{ loadingProgress }}%</span>
        </div>
      </div>
    </q-inner-loading>

    <!-- Notificação de sucesso -->
    <div v-if="showSuccess" class="success-notification">
      <div class="success-content">
        <q-icon name="check_circle" />
        <div class="success-text">
          <h4>Cadastro realizado com sucesso!</h4>
          <p>Seu salão está sendo preparado para aparecer na plataforma.</p>
        </div>
        <q-btn icon="close" flat round @click="showSuccess = false" class="close-notification" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';

const router = useRouter();
const $q = useQuasar();
const showHelpModal = ref(false);
const isLoading = ref(false);
const showSuccess = ref(false);
const loadingProgress = ref(0);

// Dados do formulário
const formData = reactive({
  name: '',
  description: '',
  experienceYears: 0,
  address: '',
  city: '',
  neighborhood: '',
  phone: '',
  email: '',
  website: '',
  services: {
    haircut: false,
    manicure: false,
    pedicure: false,
    makeup: false,
    facialTreatments: false,
  },
  openingTime: '',
  closingTime: '',
  openWeekends: false,
});

// Dados do progresso
const currentStep = ref(1);
const steps = ref([
  {
    label: 'Informações Básicas',
    icon: 'info',
    description: 'Dados fundamentais do seu estabelecimento',
    estimate: '~3 min',
  },
  {
    label: 'Localização',
    icon: 'location_on',
    description: 'Onde seu salão está localizado',
    estimate: '~2 min',
  },
  {
    label: 'Contato',
    icon: 'contacts',
    description: 'Como os clientes podem entrar em contato',
    estimate: '~2 min',
  },
  {
    label: 'Serviços',
    icon: 'spa',
    description: 'Quais serviços seu salão oferece',
    estimate: '~5 min',
  },
  {
    label: 'Horário',
    icon: 'schedule',
    description: 'Seu horário de funcionamento',
    estimate: '~3 min',
  },
]);

// FAQs
const faqs = ref([
  {
    question: 'Quais documentos preciso para cadastrar meu salão?',
    answer:
      'É necessário ter o alvará de funcionamento, CNI do responsável e comprovativo de morada.',
    open: false,
  },
  {
    question: 'Quanto tempo leva para o salão ser aprovado?',
    answer: 'O processo de aprovação leva até 24 horas após o envio de todos os documentos.',
    open: false,
  },
  {
    question: 'Posso editar as informações depois do cadastro?',
    answer:
      'Sim, todas as informações podem ser editadas a qualquer momento através do painel de gestão.',
    open: false,
  },
]);

// ✅ CORREÇÃO: Método para voltar à página anterior
const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1);
  } else {
    void router.push('/dashboard');
  }
};

// Computed properties
const currentStepTitle = computed(() => {
  const step = steps.value[currentStep.value - 1];
  return step?.label || '';
});

const currentStepIcon = computed(() => {
  const step = steps.value[currentStep.value - 1];
  return step?.icon || 'info';
});

const currentStepDescription = computed(() => {
  const step = steps.value[currentStep.value - 1];
  return step?.description || '';
});

const completionPercentage = computed(() => {
  return Math.round(((currentStep.value - 1) / steps.value.length) * 100);
});

const estimatedTime = computed(() => {
  let time = 0;
  for (let i = currentStep.value - 1; i < steps.value.length; i++) {
    const step = steps.value[i];
    const match = step?.estimate?.match(/\d+/);
    if (match) time += parseInt(match[0]);
  }
  return time;
});

// Métodos
const updateStep = (step: number) => {
  currentStep.value = step;
};

const goToStep = (step: number) => {
  if (step >= 1 && step <= steps.value.length) {
    currentStep.value = step;
  }
};

const resetProgress = () => {
  $q.dialog({
    title: 'Reiniciar Progresso',
    message: 'Tem certeza que deseja reiniciar o formulário? Todo o progresso será perdido.',
    cancel: true,
    persistent: true,
  }).onOk(() => {
    currentStep.value = 1;
    $q.notify({
      type: 'info',
      message: 'Progresso reiniciado',
      position: 'top',
    });
  });
};

// ✅ CORREÇÃO: Adicionar void para promises flutuantes
const goToSupport = () => {
  void router.push('/suporte');
  showHelpModal.value = false;
};

const contactViaWhatsApp = () => {
  window.open('https://wa.me/258841234567', '_blank');
};

const contactViaEmail = () => {
  window.location.href = 'mailto:suporte@beautytime.co.mz';
};

// ✅ CORREÇÃO: Verificação de undefined no toggleFaq
const toggleFaq = (index: number) => {
  const faq = faqs.value[index];
  if (faq) {
    faq.open = !faq.open;
  }
};

const saveDraft = () => {
  $q.notify({
    type: 'positive',
    message: 'Rascunho salvo com sucesso!',
    position: 'top',
  });
};

const previewSalon = () => {
  $q.notify({
    type: 'info',
    message: 'Pré-visualização em desenvolvimento',
    position: 'top',
  });
};

const exportData = () => {
  $q.notify({
    type: 'info',
    message: 'Exportação em desenvolvimento',
    position: 'top',
  });
};

const simulateLoading = () => {
  loadingProgress.value = 0;
  const interval = setInterval(() => {
    loadingProgress.value += Math.random() * 10;
    if (loadingProgress.value >= 100) {
      loadingProgress.value = 100;
      clearInterval(interval);
      setTimeout(() => {
        isLoading.value = false;
        showSuccess.value = true;
        setTimeout(() => {
          showSuccess.value = false;
          void router.push({
            name: 'manager-dashboard',
            query: { salonCreated: 'true' },
          });
        }, 3000);
      }, 500);
    }
  }, 200);
};

// ✅ CORREÇÃO: Remover async desnecessário
const handleFormSubmit = () => {
  isLoading.value = true;
  simulateLoading();
};

onMounted(() => {
  setTimeout(() => {
    document.querySelector('.page-header')?.classList.add('loaded');
  }, 100);
});
</script>

<style lang="scss" scoped>
.salon-create-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
  font-family: 'Segoe UI', system-ui, sans-serif;
}

.page-header {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  padding: 40px 0 30px;
  position: relative;
  overflow: hidden;
  transition: all 0.6s ease;
  opacity: 0;
  transform: translateY(-20px);

  &.loaded {
    opacity: 1;
    transform: translateY(0);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 100%;
    background: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E");
  }
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  text-align: center;
  position: relative;
  z-index: 2;
}

.header-top {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 20px;
}

.back-button {
  color: white;
}

.page-title {
  font-size: 2.8rem;
  color: white;
  margin-bottom: 15px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.page-description {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.9);
  max-width: 600px;
  margin: 0 auto 20px;
  line-height: 1.5;
}

.header-stats {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-top: 20px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.9rem;
}

.page-container {
  max-width: 1300px;
  margin: -30px auto 0;
  padding: 0 20px 40px;
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 30px;
  position: relative;
  z-index: 3;
}

.sidebar {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.sidebar-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.03);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  h3 {
    color: #2d3748;
    font-size: 1.1rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    margin: 0;
  }
}

.refresh-btn {
  color: #a0aec0;
  transition: all 0.3s ease;

  &:hover {
    color: #2563eb;
    transform: rotate(90deg);
  }
}

.progress-step {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 15px;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    background: #f7fafc;
  }

  &.clickable:hover .step-indicator {
    transform: scale(1.05);
  }
}

.step-indicator {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: #718096;
  transition: all 0.3s ease;
  flex-shrink: 0;
  position: relative;

  &.active {
    background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
    color: white;
    box-shadow: 0 4px 10px rgba(37, 99, 235, 0.3);
  }

  &.completed {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
  }
}

.step-info {
  flex: 1;
  min-width: 0;
}

.step-label {
  display: block;
  font-weight: 500;
  color: #2d3748;
  font-size: 0.9rem;
}

.step-status {
  font-size: 0.75rem;
  color: #2563eb;
  font-weight: 600;
  background: rgba(37, 99, 235, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
  margin-top: 2px;
}

.step-estimate {
  font-size: 0.7rem;
  color: #a0aec0;
  margin-top: 2px;
}

.edit-step {
  color: #a0aec0;
  opacity: 0;
  transition: all 0.3s ease;
}

.progress-step:hover .edit-step {
  opacity: 1;
}

.completion-stats {
  margin-top: 25px;
}

.completion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  font-size: 0.9rem;
  color: #4a5568;
}

.completion-bar {
  width: 100%;
  height: 8px;
  background: #edf2f7;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 12px;
  position: relative;
}

.completion-fill {
  height: 100%;
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
  transition: width 0.5s ease;
  position: relative;
}

.completion-pulse {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 20px;
  background: rgba(255, 255, 255, 0.5);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: translateX(-20px);
  }
  100% {
    transform: translateX(calc(100% + 20px));
  }
}

.completion-time {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  color: #718096;
}

.help-card {
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
  color: white;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  }

  h3 {
    color: white;
  }
}

.tip-item {
  display: flex;
  gap: 12px;
  margin-bottom: 15px;
  align-items: flex-start;
}

.tip-icon {
  margin-top: 2px;
  flex-shrink: 0;
  color: rgba(255, 255, 255, 0.9);
}

.tip-content {
  font-size: 0.85rem;
  line-height: 1.4;
}

.help-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
}

.help-btn {
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;

  &.primary {
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: white;

    &:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: translateY(-1px);
    }
  }

  &.outline {
    border: 1px solid rgba(255, 255, 255, 0.5);
    color: white;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }
  }
}

.actions-card .actions-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.action-btn {
  justify-content: flex-start;
  padding: 10px;
  border-radius: 8px;
  color: #4a5568;
  transition: all 0.3s ease;

  &:hover {
    background: #f7fafc;
    color: #2563eb;
  }
}

.content-area {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.form-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.form-header {
  padding: 30px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
}

.form-title-section {
  flex: 1;
}

.step-badge {
  display: inline-block;
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 10px;
}

.form-title {
  font-size: 1.8rem;
  color: #2d3748;
  margin-bottom: 8px;
  font-weight: 700;
  display: flex;
  align-items: center;
}

.form-subtitle {
  color: #718096;
  font-size: 1rem;
  margin: 0;
  line-height: 1.4;
}

.form-content {
  padding: 30px;
  min-height: 400px;
  position: relative;

  &.loading {
    opacity: 0.6;
    pointer-events: none;
  }
}

.form-placeholder {
  max-width: 600px;
  margin: 0 auto;

  h3 {
    color: #2d3748;
    margin-bottom: 10px;
  }

  p {
    color: #718096;
    margin-bottom: 30px;
  }
}

.form-fields {
  margin-bottom: 30px;
}

.step-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #e2e8f0;
}

.info-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.info-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  gap: 15px;
  align-items: flex-start;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
}

.info-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.security .info-icon {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
}

.benefits .info-icon {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.info-content {
  h4 {
    margin: 0 0 8px 0;
    color: #2d3748;
    font-size: 1.1rem;
  }

  p {
    margin: 0 0 10px 0;
    color: #718096;
    font-size: 0.9rem;
    line-height: 1.4;
  }
}

.info-link {
  color: #2563eb;
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
}

.info-content ul {
  margin: 0;
  padding-left: 15px;
  color: #718096;
  font-size: 0.9rem;
}

.info-content li {
  margin-bottom: 4px;
  line-height: 1.3;
}

.help-modal {
  background: white;
  border-radius: 16px;
  overflow: hidden;
}

.modal-header {
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
  color: white;
  padding: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 15px;
}

.modal-icon {
  font-size: 2rem;
}

.modal-title {
  h2 {
    margin: 0;
    font-size: 1.8rem;
  }

  p {
    margin: 5px 0 0 0;
    opacity: 0.9;
  }
}

.close-btn {
  color: white;
}

.modal-body {
  padding: 30px;
  max-height: 70vh;
  overflow-y: auto;
}

.help-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

.help-category h3 {
  margin-bottom: 20px;
  color: #2d3748;
  font-size: 1.3rem;
  display: flex;
  align-items: center;
  gap: 8px;
}

.faq-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.faq-item {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    border-color: #2563eb;
  }

  &.open .faq-answer {
    padding: 15px;
    max-height: 200px;
  }
}

.faq-question {
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  background: #f7fafc;
  transition: all 0.3s ease;

  &:hover {
    background: #edf2f7;
  }
}

.faq-answer {
  padding: 0 15px;
  max-height: 0;
  overflow: hidden;
  transition: all 0.3s ease;

  p {
    margin: 0;
    color: #4a5568;
    line-height: 1.5;
  }
}

.contact-options {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.contact-option {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #2563eb;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
}

.contact-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
}

.whatsapp {
  background: linear-gradient(135deg, #25d366 0%, #128c7e 100%);
}

.email {
  background: linear-gradient(135deg, #ea4335 0%, #d14836 100%);
}

.support {
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
}

.contact-info {
  h4 {
    margin: 0 0 5px 0;
    color: #2d3748;
  }

  p {
    margin: 0 0 5px 0;
    color: #718096;
    font-size: 0.9rem;
  }
}

.contact-detail {
  color: #2563eb;
  font-weight: 500;
  font-size: 0.85rem;
}

.custom-loading {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
}

.loading-content {
  text-align: center;
  color: #2d3748;
}

.loading-spinner {
  position: relative;
  display: inline-block;
  margin-bottom: 20px;
}

.spinner-ring {
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  border: 3px solid transparent;
  border-top: 3px solid #2563eb;
  border-radius: 50%;
  animation: spin 1.5s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loading-content {
  h3 {
    margin: 0 0 10px 0;
    font-size: 1.4rem;
  }

  p {
    margin: 0 0 20px 0;
    color: #718096;
  }
}

.loading-progress {
  display: flex;
  align-items: center;
  gap: 15px;
  justify-content: center;
}

.progress-bar {
  width: 200px;
  height: 6px;
  background: #e2e8f0;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(135deg, #2563eb 0%, #cbd5e0 100%);
  transition: width 0.3s ease;
  border-radius: 3px;
}

.loading-progress span {
  font-weight: 600;
  color: #2563eb;
  min-width: 40px;
}

.success-notification {
  position: fixed;
  top: 20px;
  right: 20px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
  z-index: 10000;
  animation: slideInRight 0.5s ease;
  max-width: 400px;
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.success-content {
  display: flex;
  align-items: center;
  gap: 15px;

  .q-icon {
    font-size: 2rem;
    flex-shrink: 0;
  }
}

.success-text {
  h4 {
    margin: 0 0 5px 0;
    font-size: 1.1rem;
  }

  p {
    margin: 0;
    opacity: 0.9;
    font-size: 0.9rem;
  }
}

.close-notification {
  color: white;
  margin-left: auto;
}

@media (max-width: 1024px) {
  .page-container {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .sidebar {
    order: 2;
  }

  .content-area {
    order: 1;
  }

  .help-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
    flex-direction: column;
    gap: 10px;
  }

  .header-stats {
    flex-direction: column;
    gap: 10px;
  }

  .form-header {
    flex-direction: column;
    text-align: center;
  }

  .info-cards {
    grid-template-columns: 1fr;
  }

  .modal-header {
    padding: 20px;
  }

  .header-content {
    flex-direction: column;
    text-align: center;
    gap: 10px;
  }
}

@media (max-width: 480px) {
  .page-header {
    padding: 30px 0 20px;
  }

  .page-title {
    font-size: 1.6rem;
  }

  .page-description {
    font-size: 1rem;
  }

  .form-header {
    padding: 20px;
  }

  .form-content {
    padding: 20px;
  }

  .form-title {
    font-size: 1.4rem;
    flex-direction: column;
    gap: 10px;
  }

  .success-notification {
    left: 20px;
    right: 20px;
    max-width: none;
  }
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

.form-card {
  animation: fadeInUp 0.6s ease;
}

.sidebar-card {
  animation: fadeInUp 0.6s ease 0.1s both;

  &:nth-child(2) {
    animation-delay: 0.2s;
  }

  &:nth-child(3) {
    animation-delay: 0.3s;
  }
}

.action-nav:focus,
.help-btn:focus,
.action-btn:focus {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

.progress-step:focus {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
  border-radius: 8px;
}

.modal-body::-webkit-scrollbar {
  width: 6px;
}

.modal-body::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.modal-body::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 3px;
}

.modal-body::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}

.form-content.loading::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
}

h1,
h2,
h3,
h4 {
  line-height: 1.2;
}

p {
  line-height: 1.6;
}

* {
  transition:
    color 0.3s ease,
    background-color 0.3s ease,
    border-color 0.3s ease;
}

@media (prefers-contrast: high) {
  .sidebar-card {
    border: 2px solid #2d3748;
  }

  .step-indicator {
    border: 2px solid currentColor;
  }
}

@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
