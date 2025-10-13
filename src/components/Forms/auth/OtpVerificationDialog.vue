<template>
  <q-dialog
    v-model="showDialog"
    persistent
    maximized
    class="otp-dialog"
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card class="otp-card full-height">
      <!-- Header -->
      <q-card-section class="otp-header bg-primary text-white">
        <div class="row items-center no-wrap">
          <q-btn flat round dense icon="arrow_back" class="text-white" @click="handleBack" />
          <q-space />
          <q-icon name="verified" size="28px" />
          <q-space />
          <q-btn flat round dense icon="close" class="text-white" @click="handleClose" />
        </div>

        <div class="text-center q-mt-lg">
          <h1 class="otp-title text-h4 text-weight-bold">Verifique seu Email</h1>
          <p class="otp-subtitle text-h6 q-mt-md">Enviamos um código de 6 dígitos para</p>
          <p class="otp-email text-h6 text-weight-bold">{{ email }}</p>
        </div>
      </q-card-section>

      <!-- OTP Input Section -->
      <q-card-section class="otp-body">
        <!-- OTP Input -->
        <div class="otp-input-section text-center">
          <div class="otp-instructions text-body1 text-grey-7 q-mb-xl">
            Digite o código que você recebeu
          </div>

          <div class="otp-inputs row justify-center q-gutter-sm">
            <q-input
              v-for="n in 6"
              :key="n"
              v-model="otp[n - 1]"
              :ref="setInputRef"
              type="text"
              inputmode="numeric"
              pattern="[0-9]*"
              maxlength="1"
              class="otp-digit"
              :class="{
                'otp-digit-filled': otp[n - 1],
                'otp-digit-error': hasError,
              }"
              @keydown="handleKeyDown($event, n - 1)"
              @update:model-value="handleOtpInput(n - 1)"
              @paste="handlePaste"
              mask="#"
              unmasked-value
              :disable="verifying"
            />
          </div>

          <!-- Error Message -->
          <div v-if="errorMessage" class="error-message text-negative q-mt-md">
            <q-icon name="error" class="q-mr-xs" />
            {{ errorMessage }}
          </div>

          <!-- Timer -->
          <div class="otp-timer q-mt-xl">
            <div class="text-body1 text-grey-7">
              Código expira em:
              <span class="text-weight-bold" :class="timerClass">
                {{ formattedTime }}
              </span>
            </div>
          </div>

          <!-- Resend Code -->
          <div class="otp-resend q-mt-lg">
            <q-btn
              flat
              :label="canResend ? 'Reenviar Código' : 'Reenviar código em'"
              :color="canResend ? 'primary' : 'grey-6'"
              :disable="!canResend || resending"
              :loading="resending"
              @click="resendCode"
            >
              <template v-if="!canResend && !resending"> ({{ resendCountdown }}s) </template>
            </q-btn>
          </div>
        </div>

        <!-- Terms Summary -->
        <div class="terms-section q-mt-xl">
          <q-expansion-item
            expand-separator
            label="Termos e Condições Resumidos"
            class="terms-expansion"
          >
            <q-card>
              <q-card-section class="terms-content">
                <div class="terms-list">
                  <div
                    class="term-item q-mb-md"
                    v-for="(term, index) in summarizedTerms"
                    :key="index"
                  >
                    <div class="row items-start">
                      <q-icon
                        name="check_circle"
                        color="positive"
                        size="sm"
                        class="q-mr-sm q-mt-xs"
                      />
                      <div>
                        <strong>{{ term.title }}</strong>
                        <p class="q-mb-none text-caption">{{ term.description }}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <q-separator class="q-my-md" />

                <div class="text-center">
                  <q-btn
                    outline
                    color="primary"
                    label="Ler Termos Completos"
                    @click="showFullTerms = true"
                    size="sm"
                  />
                </div>
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </div>
      </q-card-section>

      <!-- Actions -->
      <q-card-actions class="otp-actions q-px-lg q-pb-lg">
        <q-btn
          label="Verificar Código"
          color="primary"
          class="full-width verify-btn"
          size="lg"
          :loading="verifying"
          :disable="!isOtpComplete || verifying"
          @click="verifyOtp"
        />
      </q-card-actions>

      <!-- Loading Overlay -->
      <q-inner-loading :showing="verifying" label="Verificando...">
        <q-spinner-gears size="50px" color="primary" />
      </q-inner-loading>
    </q-card>

    <!-- Full Terms Dialog -->
    <q-dialog v-model="showFullTerms" position="bottom">
      <q-card class="full-terms-dialog">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Termos e Condições Completos</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="full-terms-content">
          <div class="terms-scroll">
            <div v-for="(section, index) in fullTerms" :key="index" class="q-mb-lg">
              <h3 class="text-h6 text-primary">{{ section.title }}</h3>
              <p class="text-body2">{{ section.content }}</p>
            </div>
          </div>
        </q-card-section>

        <q-card-actions class="q-px-lg q-pb-lg">
          <q-btn label="Entendi e Concordo" color="primary" class="full-width" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue';
import { useQuasar } from 'quasar';
import { useAuthStore } from '../../../stores/auth-store';

interface Props {
  email: string;
  show: boolean;
}

interface Emits {
  (e: 'close'): void;
  (e: 'back'): void;
  (e: 'verified'): void;
  (e: 'resend'): void;
}

interface Term {
  title: string;
  description: string;
}

interface FullTerm {
  title: string;
  content: string;
}

interface OtpVerificationResult {
  verified: boolean;
}

interface OtpResendResult {
  sent: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();
const $q = useQuasar();
const authStore = useAuthStore();

// OTP State
const otp = ref<string[]>(Array(6).fill(''));
const inputRefs = ref<(HTMLInputElement | null)[]>([]);
const verifying = ref(false);
const resending = ref(false);
const showDialog = ref(false);
const errorMessage = ref('');
const hasError = ref(false);

// Timer State
const timeLeft = ref(300); // 5 minutes
const resendCountdown = ref(60); // 1 minute for resend
const timerInterval = ref<number>();
const resendInterval = ref<number>();

// UI State
const showFullTerms = ref(false);

// Computed
const isOtpComplete = computed(() =>
  otp.value.every((digit) => digit !== '' && digit !== undefined),
);

const formattedTime = computed(() => {
  const minutes = Math.floor(timeLeft.value / 60);
  const seconds = timeLeft.value % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
});

const timerClass = computed(() => {
  if (timeLeft.value > 60) return 'text-positive';
  if (timeLeft.value > 30) return 'text-warning';
  return 'text-negative';
});

const canResend = computed(() => resendCountdown.value === 0);

// Terms Content
const summarizedTerms = ref<Term[]>([
  {
    title: 'Privacidade e Dados',
    description:
      'Seus dados são protegidos e usados apenas para melhorar sua experiência. Nunca compartilhamos informações sem sua permissão.',
  },
  {
    title: 'Agendamentos',
    description:
      'Cancelamentos devem ser feitos com até 2 horas de antecedência. Faltas consecutivas podem resultar em restrições.',
  },
  {
    title: 'Pagamentos',
    description:
      'Pagamentos são processados de forma segura. Reembolsos seguem nossa política de 7 dias para serviços não prestados.',
  },
  {
    title: 'Comportamento',
    description:
      'Respeito mútuo é essencial. Comportamento inadequado pode resultar em suspensão da conta.',
  },
]);

const fullTerms = ref<FullTerm[]>([
  {
    title: '1. Aceitação dos Termos',
    content:
      'Ao utilizar nossos serviços, você concorda com estes termos e nossa política de privacidade. Recomendamos a leitura completa.',
  },
  {
    title: '2. Uso da Plataforma',
    content:
      'A plataforma BeautyTime destina-se ao agendamento de serviços de beleza. É proibido usar a plataforma para fins ilegais ou não autorizados.',
  },
  {
    title: '3. Conta do Usuário',
    content:
      'Você é responsável por manter a segurança de sua conta. Notifique-nos imediatamente sobre qualquer uso não autorizado.',
  },
  {
    title: '4. Agendamentos e Cancelamentos',
    content:
      'Os horários são reservados exclusivamente para você. Cancelamentos com menos de 2 horas de antecedência podem incorrer em taxas.',
  },
  {
    title: '5. Pagamentos',
    content:
      'Todos os pagamentos são processados de forma segura. Taxas de serviço podem ser aplicadas conforme a política estabelecida.',
  },
  {
    title: '6. Privacidade',
    content:
      'Respeitamos sua privacidade. Seus dados são utilizados apenas para fornecer e melhorar nossos serviços.',
  },
  {
    title: '7. Modificações',
    content:
      'Podemos atualizar estes termos periodicamente. Alterações significativas serão comunicadas por email.',
  },
]);

// Methods
const setInputRef = (el: unknown) => {
  if (el && inputRefs.value.length < 6) {
    inputRefs.value.push(el as HTMLInputElement);
  }
};

const handleOtpInput = (index: number) => {
  // Limpar erro quando usuário digitar
  if (hasError.value) {
    clearError();
  }

  // Move to next input if current is filled
  if (otp.value[index] && index < 5) {
    void nextTick(() => {
      inputRefs.value[index + 1]?.focus();
    });
  }

  // Auto-submit if all digits are filled
  if (isOtpComplete.value) {
    void verifyOtp();
  }
};

const handleKeyDown = (event: KeyboardEvent, index: number) => {
  // Handle backspace
  if (event.key === 'Backspace' && !otp.value[index] && index > 0) {
    void nextTick(() => {
      inputRefs.value[index - 1]?.focus();
    });
  }

  // Handle arrow keys
  if (event.key === 'ArrowLeft' && index > 0) {
    event.preventDefault();
    inputRefs.value[index - 1]?.focus();
  }
  if (event.key === 'ArrowRight' && index < 5) {
    event.preventDefault();
    inputRefs.value[index + 1]?.focus();
  }
};

const handlePaste = (event: ClipboardEvent) => {
  const pasteData = event.clipboardData?.getData('text');
  if (pasteData && /^\d{6}$/.test(pasteData)) {
    event.preventDefault();
    otp.value = pasteData.split('').slice(0, 6);
    void nextTick(() => {
      void verifyOtp();
    });
  }
};

const verifyOtp = async () => {
  if (!isOtpComplete.value) return;

  verifying.value = true;
  clearError();

  try {
    const otpCode = otp.value.join('');

    console.log('🔐 Verificando OTP para:', props.email);

    const result = (await authStore.verifyOtp({
      email: props.email,
      code: otpCode,
    })) as OtpVerificationResult;

    if (result.verified) {
      // Sucesso - notificar e emitir evento
      $q.notify({
        type: 'positive',
        message: 'Email verificado com sucesso!',
        position: 'top',
        icon: 'verified',
        timeout: 3000,
      });

      console.log('✅ OTP verificado com sucesso');
      emit('verified');
      resetOtp();
    } else {
      throw new Error('Falha na verificação do código');
    }
  } catch (error: unknown) {
    // Tratar erro da store/backend
    const errorMsg = error instanceof Error ? error.message : 'Código inválido. Tente novamente.';
    errorMessage.value = errorMsg;
    hasError.value = true;

    console.error('❌ Erro na verificação OTP:', error);

    $q.notify({
      type: 'negative',
      message: errorMessage.value,
      position: 'top',
      timeout: 5000,
    });

    // Dar foco no primeiro campo para facilitar nova tentativa
    resetOtp();
  } finally {
    verifying.value = false;
  }
};

const resendCode = async () => {
  if (!canResend.value) return;

  resending.value = true;
  clearError();

  try {
    console.log('🔄 Reenviando OTP para:', props.email);

    // Chamada real para reenviar OTP
    const result = (await authStore.resendOtp({
      email: props.email,
    })) as OtpResendResult;

    if (result?.sent) {
      resetResendTimer();
      emit('resend');

      $q.notify({
        type: 'info',
        message: 'Código reenviado com sucesso!',
        position: 'top',
        icon: 'send',
        timeout: 3000,
      });

      console.log('✅ OTP reenviado com sucesso');
    } else {
      throw new Error('Falha ao reenviar código');
    }
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Erro ao reenviar código';
    errorMessage.value = errorMsg;
    hasError.value = true;

    console.error('❌ Erro ao reenviar OTP:', error);

    $q.notify({
      type: 'negative',
      message: errorMessage.value,
      position: 'top',
      timeout: 5000,
    });
  } finally {
    resending.value = false;
  }
};

const handleBack = () => {
  console.log('↩️ Voltando para o formulário de registro');
  resetOtp();
  emit('back');
};

const handleClose = () => {
  console.log('❌ Fechando dialog OTP');
  resetOtp();
  emit('close');
};

const clearError = () => {
  errorMessage.value = '';
  hasError.value = false;
};

const resetOtp = () => {
  otp.value = Array(6).fill('');
  clearError();
  void nextTick(() => {
    inputRefs.value[0]?.focus();
  });
};

const resetResendTimer = () => {
  resendCountdown.value = 60;
};

const startTimers = () => {
  // Main timer
  timerInterval.value = window.setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--;
    } else {
      clearInterval(timerInterval.value);
      errorMessage.value = 'Código expirado. Solicite um novo.';
      hasError.value = true;
      console.log('⏰ Código OTP expirado');
    }
  }, 1000);

  // Resend timer
  resendInterval.value = window.setInterval(() => {
    if (resendCountdown.value > 0) {
      resendCountdown.value--;
    } else {
      clearInterval(resendInterval.value);
    }
  }, 1000);
};

const clearTimers = () => {
  if (timerInterval.value) clearInterval(timerInterval.value);
  if (resendInterval.value) clearInterval(resendInterval.value);
};

// Lifecycle
onMounted(() => {
  startTimers();
  void nextTick(() => {
    inputRefs.value[0]?.focus();
  });
});

onUnmounted(() => {
  clearTimers();
});

// Watch for prop changes
watch(
  () => props.show,
  (newVal) => {
    showDialog.value = newVal;
    if (newVal) {
      resetOtp();
      timeLeft.value = 300;
      resendCountdown.value = 60;
      startTimers();
      console.log('🎯 Dialog OTP aberto para:', props.email);
    } else {
      clearTimers();
    }
  },
  { immediate: true },
);
</script>

<style lang="scss" scoped>
.otp-dialog {
  .otp-card {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

    .otp-header {
      padding: 24px 24px 40px 24px;
      border-radius: 0 0 30px 30px;

      .otp-title {
        font-size: clamp(1.5rem, 4vw, 2rem);
      }

      .otp-subtitle {
        opacity: 0.9;
      }

      .otp-email {
        background: rgba(255, 255, 255, 0.2);
        padding: 8px 16px;
        border-radius: 20px;
        display: inline-block;
        backdrop-filter: blur(10px);
      }
    }

    .otp-body {
      padding: 40px 24px;
      background: white;
      margin: -20px 16px 0 16px;
      border-radius: 30px 30px 0 0;
      box-shadow: 0 -10px 30px rgba(0, 0, 0, 0.1);

      .otp-inputs {
        .otp-digit {
          width: 50px;
          height: 60px;

          :deep(.q-field__control) {
            height: 60px;
            border-radius: 12px;
            border: 2px solid #e0e0e0;
            transition: all 0.3s ease;
          }

          :deep(.q-field__native) {
            text-align: center;
            font-size: 1.5rem;
            font-weight: bold;
          }

          &.otp-digit-filled :deep(.q-field__control) {
            border-color: var(--q-primary);
            background: rgba(var(--q-primary-rgb), 0.1);
          }

          &.otp-digit-error :deep(.q-field__control) {
            border-color: #f44336 !important;
            background: rgba(244, 67, 54, 0.1) !important;
          }
        }
      }

      .error-message {
        font-size: 0.9rem;
        font-weight: 500;
      }

      .otp-timer {
        .text-positive {
          color: #4caf50 !important;
        }
        .text-warning {
          color: #ff9800 !important;
        }
        .text-negative {
          color: #f44336 !important;
        }
      }

      .terms-section {
        .terms-expansion {
          :deep(.q-item) {
            border-radius: 12px;
            border: 1px solid #e0e0e0;
          }

          .terms-content {
            .term-item {
              padding: 12px 0;
              border-bottom: 1px solid #f5f5f5;

              &:last-child {
                border-bottom: none;
              }
            }
          }
        }
      }
    }

    .otp-actions {
      background: white;

      .verify-btn {
        border-radius: 12px;
        font-weight: 600;
        text-transform: none;

        &:disabled {
          opacity: 0.6;
        }
      }
    }
  }
}

.full-terms-dialog {
  max-height: 80vh;

  .full-terms-content {
    padding: 0;

    .terms-scroll {
      max-height: 50vh;
      overflow-y: auto;
      padding: 16px 24px;

      &::-webkit-scrollbar {
        width: 6px;
      }

      &::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 3px;
      }

      &::-webkit-scrollbar-thumb {
        background: #c1c1c1;
        border-radius: 3px;
      }
    }
  }
}

// Responsive adjustments
@media (max-width: 600px) {
  .otp-dialog {
    .otp-card {
      .otp-body {
        margin: -20px 12px 0 12px;

        .otp-inputs {
          .otp-digit {
            width: 44px;
            height: 54px;

            :deep(.q-field__control) {
              height: 54px;
            }
          }
        }
      }
    }
  }
}

// Animation for OTP inputs
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

.otp-digit:focus-within {
  animation: pulse 0.3s ease;
}

// Dark mode support
.body--dark {
  .otp-dialog {
    .otp-card {
      .otp-body {
        background: #1e1e1e;

        .terms-section {
          .terms-expansion {
            :deep(.q-item) {
              border-color: #333;
              background: #2d2d2d;
            }
          }
        }
      }
    }
  }
}
</style>
