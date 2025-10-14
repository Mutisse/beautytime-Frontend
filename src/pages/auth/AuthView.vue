<template>
  <q-page class="row items-center justify-center bg-grey-1 q-pa-xs q-pa-sm-sm">
    <!-- Botão Voltar para Home -->
    <q-btn
      flat
      round
      icon="arrow_back"
      color="primary"
      class="absolute-top-left q-ma-xs q-ma-sm-sm"
      @click="goToHome"
      :size="$q.screen.lt.sm ? 'sm' : 'md'"
    >
      <q-tooltip>Voltar para página inicial</q-tooltip>
    </q-btn>

    <div class="row justify-center full-width q-px-xs q-px-sm-none" style="max-width: 1200px">
      <q-card class="row col-12 shadow-5 shadow-md-10 mobile-card-height">
        <!-- Painel Lateral (Azul) -->
        <q-card-section
          class="col-md-6 col-12 bg-primary text-white q-pa-md q-pa-xl-lg mobile-section-height order-2 order-md-1"
        >
          <div class="column justify-center full-height q-gutter-y-md q-gutter-y-xl-lg">
            <!-- Conteúdo Principal do Painel Azul -->
            <div class="text-center text-md-left">
              <div class="text-h5 text-h4-md text-weight-medium q-mb-md">
                {{
                  isLogin
                    ? 'Sua Beleza, Nossa Prioridade!'
                    : 'Transforme Sua Experiência de Beleza!'
                }}
              </div>
              <div class="text-subtitle1 text-subtitle2-md">
                {{
                  isLogin
                    ? 'Descubra um mundo de possibilidades para realçar sua beleza com agendamentos fáceis e serviços exclusivos'
                    : 'Junte-se a milhares de clientes satisfeitos e tenha acesso aos melhores profissionais da sua região'
                }}
              </div>
            </div>

            <!-- Imagem Centralizada -->
            <div class="flex flex-center q-mt-xl illustration-container">
              <transition name="fade" mode="out-in">
                <img
                  :key="isLogin ? 'login' : 'register'"
                  :src="currentImage"
                  alt="Ilustração de beleza e cuidados"
                  class="illustration-image centered-image"
                  loading="eager"
                  @error="handleImageError"
                />
              </transition>
            </div>

            <!-- Benefícios -->
            <div class="benefits-section q-mt-lg">
              <div class="text-subtitle2 text-weight-medium q-mb-sm">
                ✨ Por que escolher o BeautyTime?
              </div>
              <div class="text-caption">
                {{
                  isLogin
                    ? 'Agendamento 24/7 • Profissionais verificados • Lembretes inteligentes'
                    : 'Cadastro gratuito • Agendamento instantâneo • Avaliações reais'
                }}
              </div>
            </div>
          </div>
        </q-card-section>

        <!-- Painel Principal (Formulário) -->
        <q-card-section
          class="col-md-6 col-12 q-pa-lg q-pa-xl-xl mobile-section-height order-1 order-md-2"
        >
          <div class="column full-height justify-center form-content">
            <!-- Área do Formulário -->
            <div class="form-area q-mb-lg">
              <transition name="slide-fade" mode="out-in" appear>
                <div class="form-wrapper full-width">
                  <LoginForm
                    v-if="isLogin"
                    @login="handleLogin"
                    @forgotPassword="handleForgotPassword"
                    @createAccount="handleCreateAccount"
                  />
                  <RegisterForm v-else @register="handleRegister" @switchToLogin="isLogin = true" />
                </div>
              </transition>
            </div>

            <!-- Separador -->
            <q-separator class="q-my-lg" />

            <!-- Rodapé do Formulário -->
            <div class="form-footer text-center">
              <div class="text-body1 q-mb-sm">
                {{ isLogin ? 'Ainda não tem conta?' : 'Já possui uma conta?' }}
              </div>
              <q-btn
                flat
                no-caps
                :label="isLogin ? 'Cadastre-se gratuitamente' : 'Fazer Login'"
                color="primary"
                @click="toggleForm"
                class="full-width"
                size="lg"
                :icon="isLogin ? 'person_add' : 'login'"
              />
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Loading Indicator CORRIGIDO -->
    <q-inner-loading
      :showing="loading"
      :label="loadingMessage"
      label-class="text-primary"
      :style="loadingStyle"
    >
      <q-spinner-gears :size="$q.screen.lt.sm ? '35px' : '50px'" color="primary" />
    </q-inner-loading>

    <!-- Fallback para imagem com erro -->
    <div v-if="imageError" class="image-fallback absolute-full flex flex-center">
      <div class="text-center">
        <q-icon
          :name="'image_not_supported'"
          :size="$q.screen.lt.sm ? 'md' : 'xl'"
          color="grey-5"
        />
        <div class="text-caption text-grey-6 q-mt-xs">Ilustração não disponível</div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useAuthStore } from 'src/stores/auth-store';
import LoginForm from 'components/Forms/auth/LoginForm.vue';
import RegisterForm from 'components/Forms/auth/registerForm.vue';
import type { RegisterPayload, UserMainRole } from 'src/types/auth-Types';
import axios from 'axios';

// Import the actual values (not just types) for enum usage
import {
  UserMainRole as UserMainRoleValues,
  EmployeeSubRole as EmployeeSubRoleValues,
} from 'src/types/auth-Types';

const $q = useQuasar();
const router = useRouter();
const authStore = useAuthStore();

const isLogin = ref(true);
const loading = ref(false);
const loadingMessage = ref('Autenticando...');
const imageError = ref(false);

// CORREÇÃO: Estilo para o loading
const loadingStyle = computed(() => ({
  fontSize: $q.screen.lt.sm ? '0.9em' : '1.1em',
}));

// Importação correta usando import.meta.url do Vite
const loginIllustration = new URL('../../assets/img/Login_amico.png', import.meta.url).href;
const registerIllustration = new URL('../../assets/img/Sign_up_amico.png', import.meta.url).href;

// Imagem dinâmica baseada no estado
const currentImage = computed(() => (isLogin.value ? loginIllustration : registerIllustration));

// Função para obter a rota de redirecionamento baseada no perfil
const getDashboardRoute = (
  role: UserMainRole | undefined,
  subRole: string | EmployeeSubRoleValues | null | undefined,
): string => {
  if (role === UserMainRoleValues.ADMINSYSTEM) {
    return '/admin/dashboard';
  }

  if (role === UserMainRoleValues.CLIENT) {
    return '/client/dashboard';
  }

  if (role === UserMainRoleValues.EMPLOYEE) {
    const subRoleStr = String(subRole).toLowerCase();

    if (
      subRoleStr === EmployeeSubRoleValues.SALON_OWNER.toLowerCase() ||
      subRoleStr === 'salon_owner'
    ) {
      return '/ownerManager/dashboard';
    }

    if (subRoleStr === EmployeeSubRoleValues.STAFF.toLowerCase() || subRoleStr === 'staff') {
      return '/staffEmployee/dashboard';
    }

    return '/404';
  }

  return '/auth';
};

// Sistema de Notificações Unificado
const showNotification = (options: {
  type: 'positive' | 'negative' | 'warning' | 'info' | 'ongoing';
  message: string;
  icon?: string;
  position?:
    | 'top'
    | 'bottom'
    | 'left'
    | 'right'
    | 'top-left'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-right'
    | 'center';
  timeout?: number;
  progress?: boolean;
  actions?: Array<{ label: string; color: string; handler: () => void }>;
}) => {
  if (!$q || !$q.notify) {
    console.warn('Quasar notify não disponível', options);
    return () => {};
  }

  const defaultOptions = {
    position: 'top' as const,
    timeout: options.type === 'ongoing' ? 0 : 5000,
    progress: true,
    multiLine: false,
    html: false,
  };

  return $q.notify({ ...defaultOptions, ...options });
};

// Notificações específicas
const showSuccess = (message: string) => {
  showNotification({
    type: 'positive',
    message,
    icon: 'check_circle',
    position: 'top',
  });
};

const showError = (message: string) => {
  showNotification({
    type: 'negative',
    message,
    icon: 'error',
    position: 'top',
    timeout: 7000,
  });
};

const showWarning = (message: string) => {
  showNotification({
    type: 'warning',
    message,
    icon: 'warning',
    position: 'top',
  });
};

const showInfo = (message: string) => {
  showNotification({
    type: 'info',
    message,
    icon: 'info',
    position: 'top',
  });
};

const showLoadingNotification = (message: string) => {
  return showNotification({
    type: 'ongoing',
    message,
    icon: 'hourglass_empty',
    position: 'top',
    timeout: 0,
    progress: false,
  });
};

const handleImageError = (e: Event): void => {
  const imgElement = e.target as HTMLImageElement;
  console.error('Falha ao carregar imagem:', {
    src: imgElement.src,
    currentSrc: imgElement.currentSrc,
    naturalWidth: imgElement.naturalWidth,
    naturalHeight: imgElement.naturalHeight,
    complete: imgElement.complete,
    errorType: imgElement.naturalWidth === 0 ? 'Arquivo não encontrado' : 'Outro erro',
  });

  imageError.value = true;
  showWarning('Ilustração não carregada. A interface continuará funcionando normalmente.');
};

const toggleForm = (): void => {
  isLogin.value = !isLogin.value;
  imageError.value = false;
  showInfo(isLogin.value ? 'Modo de login ativado' : 'Modo de registro ativado');
};

const goToHome = (): void => {
  showInfo('Redirecionando para página inicial...');
  void router.push('/');
};

const handleLogin = async (credentials: {
  email: string;
  password: string;
  remember: boolean;
}): Promise<void> => {
  loading.value = true;
  loadingMessage.value = 'Verificando credenciais...';

  const loadingNotify = showLoadingNotification('Autenticando...');

  try {
    await authStore.login(credentials);

    if (typeof loadingNotify === 'function') {
      loadingNotify();
    }

    showSuccess('Login realizado com sucesso! Redirecionando...');

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const userRole = authStore.userRole;
    const userSubRole = authStore.user?.subRole || null;
    const dashboardRoute = getDashboardRoute(userRole, userSubRole);
    await router.push(dashboardRoute);
  } catch (error: unknown) {
    if (typeof loadingNotify === 'function') {
      loadingNotify();
    }

    let errorMessage = 'Erro durante o login';
    let errorType: 'error' | 'warning' = 'error';

    if (axios.isAxiosError(error) && error.response?.status === 500) {
      await router.push('/500');
      return;
    }

    if (error instanceof Error) {
      const errorStr = error.message.toLowerCase();

      if (
        errorStr.includes('credencial') ||
        errorStr.includes('senha') ||
        errorStr.includes('email')
      ) {
        errorMessage = 'Credenciais inválidas. Verifique seu email e senha.';
      } else if (
        errorStr.includes('rede') ||
        errorStr.includes('conexão') ||
        errorStr.includes('network')
      ) {
        errorMessage = 'Problema de conexão. Verifique sua internet.';
        errorType = 'warning';
      } else if (errorStr.includes('bloqueado') || errorStr.includes('suspenso')) {
        errorMessage = 'Conta temporariamente bloqueada. Tente novamente mais tarde.';
        errorType = 'warning';
      } else {
        errorMessage = error.message;
      }
    }

    if (errorType === 'warning') {
      showWarning(errorMessage);
    } else {
      showError(errorMessage);
    }
  } finally {
    loading.value = false;
  }
};

const handleRegister = async (userData: RegisterPayload): Promise<void> => {
  loading.value = true;
  loadingMessage.value = 'Criando sua conta...';

  const loadingNotify = showLoadingNotification('Processando registro...');

  try {
    await authStore.register(userData);

    if (typeof loadingNotify === 'function') {
      loadingNotify();
    }

    showSuccess('Conta criada com sucesso! Redirecionando...');

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const userRole = authStore.userRole;
    const userSubRole = authStore.user?.subRole || null;
    const dashboardRoute = getDashboardRoute(userRole, userSubRole);
    await router.push(dashboardRoute);
  } catch (error: unknown) {
    if (typeof loadingNotify === 'function') {
      loadingNotify();
    }

    let errorMessage = 'Erro ao criar conta';
    let errorType: 'error' | 'warning' = 'error';

    if (axios.isAxiosError(error) && error.response?.status === 500) {
      await router.push('/500');
      return;
    }

    if (error instanceof Error) {
      const errorStr = error.message.toLowerCase();

      if (errorStr.includes('email') && errorStr.includes('existente')) {
        errorMessage = 'Este email já está em uso. Tente fazer login ou use outro email.';
        errorType = 'warning';
      } else if (errorStr.includes('senha') && errorStr.includes('fraca')) {
        errorMessage =
          'Senha muito fraca. Use pelo menos 8 caracteres com letras, números e símbolos.';
      } else if (errorStr.includes('rede') || errorStr.includes('conexão')) {
        errorMessage = 'Problema de conexão. Verifique sua internet e tente novamente.';
        errorType = 'warning';
      } else if (errorStr.includes('termos') || errorStr.includes('aceite')) {
        errorMessage = 'Você precisa aceitar os termos e condições para se registrar.';
      } else {
        errorMessage = error.message;
      }
    }

    if (errorType === 'warning') {
      showWarning(errorMessage);
    } else {
      showError(errorMessage);
    }
  } finally {
    loading.value = false;
  }
};

// NOVO: Handler para criar conta via OTP
const handleCreateAccount = async (payload: { email: string; verified: boolean }) => {
  try {
    showInfo('Redirecionando para página de registro...');

    // Redirecionar para página de registro com email pré-preenchido
    await router.push({
      path: '/auth',
      query: {
        email: payload.email,
        verified: payload.verified ? 'true' : 'false',
        action: 'register',
      },
    });

    // Mudar para modo de registro
    isLogin.value = false;
  } catch (error) {
    showError('Erro ao redirecionar para registro');
    console.error('Erro no create account:', error);
  }
};

const handleForgotPassword = (): void => {
  showInfo('Redirecionando para recuperação de senha...');
  void router.push('/password-reset');
};

onMounted(() => {
  setTimeout(() => {
    showInfo(isLogin.value ? 'Bem-vindo à página de login' : 'Bem-vindo à página de registro');
  }, 100);
});
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}

.q-card {
  border-radius: 16px;
  overflow: hidden;
}

/* Desktop (≥ 1024px) */
.mobile-card-height {
  height: 700px;
  min-height: 700px;
}

.mobile-section-height {
  height: 700px;
  display: flex;
  flex-direction: column;
}

/* Painel Azul - Layout Melhorado */
.illustration-container {
  height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}

.centered-image {
  max-height: 100%;
  max-width: 90%;
  object-fit: contain;
  width: auto;
  transition: all 0.3s ease;
}

.benefits-section {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 12px;
  text-align: center;
}

/* ESTRUTURA DO FORMULÁRIO ATUALIZADA - GARANTINDO ESPAÇO PARA O FILHO */
.form-content {
  height: 100%;
  padding: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 0;
}

.form-header {
  flex-shrink: 0;
  margin-bottom: 20px;
}

/* ÁREA PRINCIPAL DO FORMULÁRIO - ESPAÇO FLEXÍVEL PARA O FILHO */
.form-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  width: 100%;
  position: relative;
}

.form-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  width: 100%;
  height: 100%;
}

.form-footer {
  flex-shrink: 0;
}

/* GARANTIR QUE OS COMPONENTES FILHOS OCUPEM TODO O ESPAÇO DISPONÍVEL */
:deep(.login-form),
:deep(.register-form),
:deep(.register-form-container),
:deep(.register-form-inner) {
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-height: 0;
}

/* ESPECÍFICO PARA O REGISTER FORM */
:deep(.register-form-container) {
  padding: 0;
  margin: 0;
}

:deep(.form-content-area) {
  flex: 1;
  min-height: 0;
}

:deep(.form-step-inner) {
  flex: 1;
  min-height: 0;
}

.absolute-top-left {
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 1000;
}

.image-fallback {
  z-index: 999;
  background: rgba(255, 255, 255, 0.9);
  pointer-events: none;
}

/* Tablet (768px - 1023px) */
@media (max-width: 1023px) {
  .mobile-card-height {
    height: auto;
    min-height: auto;
    max-height: 90vh;
    overflow-y: auto;
    margin: 8px;
  }

  .mobile-section-height {
    height: auto;
    min-height: 400px;
    padding: 24px;
  }

  .form-content {
    padding: 0;
  }

  .illustration-container {
    height: 220px;
  }

  .benefits-section {
    margin-top: 20px;
  }

  /* GARANTIR ESPAÇO EM TABLET */
  :deep(.register-form-container) {
    min-height: 500px;
  }
}

/* Mobile Medium (376px - 767px) */
@media (max-width: 767px) {
  .mobile-card-height {
    max-height: 95vh;
    margin: 4px;
    border-radius: 12px;
  }

  .mobile-section-height {
    min-height: 350px;
    padding: 20px 16px;
  }

  .form-content {
    padding: 0;
  }

  .form-header {
    text-align: center;
    margin-bottom: 20px;

    .text-left {
      text-align: center !important;
    }
  }

  .illustration-container {
    height: 180px;
    margin-top: 20px;
  }

  .benefits-section {
    margin-top: 16px;
    padding: 10px;
  }

  .absolute-top-left {
    top: 8px;
    left: 8px;
  }

  /* AJUSTES ESPECÍFICOS PARA MOBILE */
  .form-area {
    margin-bottom: 10px;
  }

  .form-footer {
    margin-top: 10px;
  }
}

/* Mobile Small (≤ 375px) */
@media (max-width: 375px) {
  .mobile-card-height {
    max-height: 98vh;
    margin: 2px;
    border-radius: 8px;
  }

  .mobile-section-height {
    min-height: 320px;
    padding: 16px 12px;
  }

  .form-content {
    padding: 0;
  }

  .illustration-container {
    height: 150px;
  }

  .benefits-section {
    margin-top: 12px;
    padding: 8px;
  }

  .absolute-top-left {
    top: 6px;
    left: 6px;
  }
}

/* Ajustes para telas muito pequenas em altura (≤ 600px) */
@media (max-height: 600px) {
  .mobile-card-height {
    max-height: 98vh;
  }

  .mobile-section-height {
    min-height: 280px;
    padding: 16px;
  }

  .illustration-container {
    height: 120px;
  }

  .form-header {
    margin-bottom: 15px;
  }

  /* COMPACTAR MAIS EM TELAS BAIXAS */
  .form-area {
    margin-bottom: 8px;
  }

  .form-footer {
    margin-top: 8px;
  }

  :deep(.register-form-container) {
    min-height: 400px;
  }
}

/* Hover effects apenas para desktop */
@media (hover: hover) and (pointer: fine) and (min-width: 1024px) {
  .centered-image:hover {
    transform: scale(1.05);
    transition: transform 0.3s ease;
  }
}

/* Melhorias de tipografia */
.text-h4 {
  line-height: 1.2;
}

.text-subtitle1 {
  line-height: 1.5;
}

.benefits-section .text-caption {
  line-height: 1.4;
}

/* GARANTIR QUE O SEPARADOR NÃO ROUBE ESPAÇO */
.q-separator {
  flex-shrink: 0;
}

/* OTIMIZAÇÃO PARA O ESPAÇO DO FORMULÁRIO */
.q-card-section.col-md-6.col-12.q-pa-lg.q-pa-xl-xl.mobile-section-height.order-1.order-md-2 {
  display: flex;
  flex-direction: column;
  min-height: 0;
}

/* REMOVER PADDINGS DESNECESSÁRIOS QUE ROUBAM ESPAÇO */
:deep(.q-card__section) {
  &.q-pa-lg,
  &.q-pa-xl-xl {
    padding: 20px;
  }
}

/* GARANTIR QUE OS BOTÕES DO FILHO TENHAM ESPAÇO SUFICIENTE */
:deep(.step-actions-compact) {
  padding-top: 15px;
  margin-top: auto;
}

:deep(.login-link-compact) {
  margin-top: 15px;
}
</style>
