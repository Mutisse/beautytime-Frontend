<template>
  <q-dialog v-model="showDialog" persistent maximized>
    <div class="recovery-popup-container">
      <!-- Header com Progress Steps -->
      <div class="popup-header">
        <q-btn flat round icon="close" @click="handleClose" class="close-btn" />

        <div class="progress-steps">
          <div class="step" :class="{ active: currentStep === 1, completed: currentStep > 1 }">
            <div class="step-number">1</div>
            <span class="step-label">Email</span>
          </div>
          <div class="step-line" :class="{ completed: currentStep > 1 }"></div>
          <div class="step" :class="{ active: currentStep === 2, completed: currentStep > 2 }">
            <div class="step-number">2</div>
            <span class="step-label">Verificação</span>
          </div>
          <div class="step-line" :class="{ completed: currentStep > 2 }"></div>
          <div class="step" :class="{ active: currentStep === 3, completed: currentStep > 3 }">
            <div class="step-number">3</div>
            <span class="step-label">Nova Senha</span>
          </div>
        </div>
      </div>

      <!-- Conteúdo Dinâmico por Step -->
      <div class="popup-content">
        <!-- STEP 1: Solicitação de Email -->
        <div v-if="currentStep === 1" class="step-content">
          <div class="step-icon">
            <q-icon name="mail" size="32px" color="primary" />
          </div>
          <h3>Recuperar Senha</h3>
          <p>Digite seu email para receber o código de verificação</p>

          <q-form @submit.prevent="handleEmailSubmit" class="recovery-form">
            <q-input
              v-model="email"
              label="Email"
              type="email"
              outlined
              dense
              lazy-rules
              :rules="[
                (val: string) => !!val || 'Email obrigatório',
                (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || 'Email inválido',
              ]"
              :disable="loading"
              class="email-input"
            >
              <template v-slot:prepend>
                <q-icon name="mail" />
              </template>
            </q-input>

            <div class="action-buttons">
              <q-btn
                label="Enviar Código"
                type="submit"
                color="primary"
                :loading="loading"
                :disable="!email"
                class="submit-btn full-width-mobile"
              >
                <template v-slot:loading>
                  <q-spinner-hourglass class="on-left" />
                  Enviando...
                </template>
              </q-btn>
            </div>
          </q-form>
        </div>

        <!-- STEP 2: Verificação OTP -->
        <div v-else-if="currentStep === 2" class="step-content">
          <div class="step-icon">
            <q-icon name="lock_reset" size="32px" color="primary" />
          </div>
          <h3>Verifique seu e-mail</h3>
          <p>Enviamos um código de verificação para</p>
          <p class="email-text">{{ email }}</p>

          <!-- OTP Input -->
          <div class="otp-section">
            <label class="otp-label">Digite o código de 6 dígitos</label>

            <div class="otp-inputs">
              <div
                v-for="n in 6"
                :key="n"
                class="otp-digit"
                :class="{ 'has-value': otpCodes[n - 1] !== '' }"
                @click="focusOTPInput(n - 1)"
              >
                <input
                  :ref="(el) => setOTPInputRef(el, n - 1)"
                  v-model="otpCodes[n - 1]"
                  type="text"
                  maxlength="1"
                  inputmode="numeric"
                  pattern="[0-9]*"
                  @keydown="handleOTPKeyDown($event, n - 1)"
                  @input="handleOTPInput(n - 1)"
                  @paste="handleOTPPaste"
                  @focus="handleOTPFocus(n - 1)"
                />
              </div>
            </div>

            <!-- Timer e Reenviar -->
            <div class="otp-actions">
              <div v-if="canResendOTP" class="resend-section">
                <span class="resend-text">Não recebeu o código?</span>
                <q-btn
                  flat
                  label="Reenviar código"
                  color="primary"
                  @click="handleResendOTP"
                  :loading="resendLoading"
                  no-caps
                  class="resend-btn"
                />
              </div>
              <div v-else class="timer-section">
                <span class="timer-text">
                  Reenviar código em <strong>{{ formattedTime }}</strong>
                </span>
              </div>
            </div>
          </div>

          <div class="action-buttons">
            <q-btn
              label="Voltar"
              flat
              color="grey-7"
              @click="goToStep(1)"
              class="back-btn mobile-order-1"
            />
            <q-btn
              label="Verificar Código"
              color="primary"
              @click="handleVerifyOTP"
              :loading="verifyLoading"
              :disable="!isOTPComplete"
              class="verify-btn mobile-order-2"
            >
              <template v-slot:loading>
                <q-spinner-hourglass class="on-left" />
                Verificando...
              </template>
            </q-btn>
          </div>
        </div>

        <!-- STEP 3: Nova Senha -->
        <div v-else-if="currentStep === 3" class="step-content">
          <div class="step-icon">
            <q-icon name="password" size="32px" color="primary" />
          </div>
          <h3>Crie sua nova senha</h3>
          <p>Digite e confirme sua nova senha</p>

          <q-form @submit.prevent="handlePasswordSubmit" class="password-form">
            <!-- Nova Senha -->
            <div class="password-field-group">
              <q-input
                v-model="newPassword"
                label="Nova Senha"
                :type="showPassword ? 'text' : 'password'"
                outlined
                dense
                lazy-rules
                :rules="[
                  (val: string) => !!val || 'Senha obrigatória',
                  (val: string) => val.length >= 8 || 'Mínimo 8 caracteres',
                  (val: string) => /[A-Z]/.test(val) || 'Pelo menos 1 letra maiúscula',
                  (val: string) => /[0-9]/.test(val) || 'Pelo menos 1 número',
                  (val: string) => /[^A-Za-z0-9]/.test(val) || 'Pelo menos 1 caractere especial',
                ]"
                :disable="loading"
                class="password-input"
                @update:model-value="checkPasswordRequirements"
              >
                <template v-slot:prepend>
                  <q-icon name="lock" />
                </template>
                <template v-slot:append>
                  <q-icon
                    :name="showPassword ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="showPassword = !showPassword"
                  />
                </template>
              </q-input>
              <!-- Confirmar Senha -->
              <q-input
                v-model="confirmPassword"
                label="Confirmar Senha"
                :type="showConfirmPassword ? 'text' : 'password'"
                outlined
                dense
                lazy-rules
                :rules="[
                  (val: string) => !!val || 'Confirmação obrigatória',
                  (val: string) => val === newPassword || 'Senhas devem ser iguais',
                ]"
                :disable="loading"
                class="confirm-input"
              >
                <template v-slot:prepend>
                  <q-icon name="lock" />
                </template>
                <template v-slot:append>
                  <q-icon
                    :name="showConfirmPassword ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="showConfirmPassword = !showConfirmPassword"
                  />
                </template>
              </q-input>

              <!-- Indicador de Força da Senha -->
              <div class="password-strength" v-if="newPassword">
                <div class="strength-bar">
                  <div class="strength-fill" :class="getPasswordStrength(newPassword).class"></div>
                </div>
                <span class="strength-text">{{ getPasswordStrength(newPassword).text }}</span>
              </div>

              <!-- Política de Senha -->
              <div class="password-policy">
                <h4>Sua senha deve conter:</h4>
                <div class="policy-list">
                  <div class="policy-item" :class="{ satisfied: passwordRequirements.minLength }">
                    <q-icon
                      :name="
                        passwordRequirements.minLength ? 'check_circle' : 'radio_button_unchecked'
                      "
                      :color="passwordRequirements.minLength ? 'positive' : 'grey'"
                      size="16px"
                    />
                    <span>No mínimo 8 caracteres</span>
                  </div>
                  <div class="policy-item" :class="{ satisfied: passwordRequirements.uppercase }">
                    <q-icon
                      :name="
                        passwordRequirements.uppercase ? 'check_circle' : 'radio_button_unchecked'
                      "
                      :color="passwordRequirements.uppercase ? 'positive' : 'grey'"
                      size="16px"
                    />
                    <span>Pelo menos 1 letra maiúscula</span>
                  </div>
                  <div class="policy-item" :class="{ satisfied: passwordRequirements.number }">
                    <q-icon
                      :name="
                        passwordRequirements.number ? 'check_circle' : 'radio_button_unchecked'
                      "
                      :color="passwordRequirements.number ? 'positive' : 'grey'"
                      size="16px"
                    />
                    <span>Pelo menos 1 número</span>
                  </div>
                  <div class="policy-item" :class="{ satisfied: passwordRequirements.specialChar }">
                    <q-icon
                      :name="
                        passwordRequirements.specialChar ? 'check_circle' : 'radio_button_unchecked'
                      "
                      :color="passwordRequirements.specialChar ? 'positive' : 'grey'"
                      size="16px"
                    />
                    <span>Pelo menos 1 caractere especial</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="action-buttons">
              <q-btn
                label="Voltar"
                flat
                color="grey-7"
                @click="goToStep(2)"
                class="back-btn mobile-order-1"
              />
              <q-btn
                label="Redefinir Senha"
                type="submit"
                color="primary"
                :loading="loading"
                :disable="!isPasswordFormValid"
                class="submit-btn mobile-order-2"
              >
                <template v-slot:loading>
                  <q-spinner-hourglass class="on-left" />
                  Atualizando...
                </template>
              </q-btn>
            </div>
          </q-form>
        </div>

        <!-- STEP 4: Sucesso -->
        <div v-else-if="currentStep === 4" class="step-content success-step">
          <div class="success-icon">
            <q-icon name="check_circle" size="48px" color="positive" />
          </div>
          <h3>Senha redefinida!</h3>
          <p>Sua senha foi redefinida com sucesso.</p>
          <p>Você já pode fazer login com sua nova senha.</p>

          <div class="action-buttons">
            <q-btn
              label="Fazer Login"
              color="primary"
              @click="handleComplete"
              class="login-btn full-width-mobile"
            />
          </div>
        </div>
      </div>
    </div>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted, nextTick, defineEmits, defineExpose } from 'vue';
import { useQuasar } from 'quasar';
import { useAuthStore } from '../../stores/auth-store';

const $q = useQuasar();
const authStore = useAuthStore();

// Estado principal
const showDialog = ref(false);
const currentStep = ref(1);
const loading = ref(false);

// Step 1: Email
const email = ref('');

// Step 2: OTP
const otpCodes = ref(['', '', '', '', '', '']);
const otpInputsRef = ref<(HTMLInputElement | null)[]>([]);
const verifyLoading = ref(false);
const resendLoading = ref(false);
const timer = ref(0);

// Step 3: Password
const newPassword = ref('');
const confirmPassword = ref('');
const showPassword = ref(false);
const showConfirmPassword = ref(false);

// Política de senha
const passwordRequirements = ref({
  minLength: false,
  uppercase: false,
  number: false,
  specialChar: false,
});

// Emits
const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'completed'): void;
}>();

// Computed
const isOTPComplete = computed(() => {
  return otpCodes.value.every((code) => code !== '');
});

const canResendOTP = computed(() => {
  return timer.value === 0;
});

const formattedTime = computed(() => {
  const minutes = Math.floor(timer.value / 60);
  const seconds = timer.value % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
});

const isPasswordFormValid = computed(() => {
  return (
    newPassword.value &&
    confirmPassword.value &&
    newPassword.value === confirmPassword.value &&
    passwordRequirements.value.minLength &&
    passwordRequirements.value.uppercase &&
    passwordRequirements.value.number &&
    passwordRequirements.value.specialChar
  );
});

// Métodos de controle
const open = () => {
  console.log('🟢 RecoveryPopup ABERTO');
  showDialog.value = true;
  resetForm();
};

const close = () => {
  showDialog.value = false;
};

const handleClose = () => {
  close();
  emit('close');
};

const resetForm = () => {
  currentStep.value = 1;
  email.value = '';
  loading.value = false;
  resetOTP();
  resetPassword();
};

const resetOTP = () => {
  otpCodes.value = ['', '', '', '', '', ''];
  otpInputsRef.value = [];
  verifyLoading.value = false;
  resendLoading.value = false;
  timer.value = 0;
};

const resetPassword = () => {
  newPassword.value = '';
  confirmPassword.value = '';
  showPassword.value = false;
  showConfirmPassword.value = false;
  resetPasswordRequirements();
};

const resetPasswordRequirements = () => {
  passwordRequirements.value = {
    minLength: false,
    uppercase: false,
    number: false,
    specialChar: false,
  };
};

// Verificar requisitos da senha
const checkPasswordRequirements = () => {
  const password = newPassword.value;

  passwordRequirements.value = {
    minLength: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    specialChar: /[^A-Za-z0-9]/.test(password),
  };
};

// Navegação entre steps
const goToStep = (step: number) => {
  currentStep.value = step;
};

// STEP 1: Email
const handleEmailSubmit = async () => {
  if (!email.value) return;

  loading.value = true;
  try {
    await authStore.requestPasswordReset(email.value);

    $q.notify({
      type: 'positive',
      message: 'Código enviado para seu email!',
      icon: 'check_circle',
      position: 'top',
    });

    // Avança para OTP e inicia timer
    goToStep(2);
    startOTPTimer();

    // Foca no primeiro input OTP
    await nextTick(() => {
      if (otpInputsRef.value[0]) {
        otpInputsRef.value[0].focus();
      }
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro ao enviar código';
    $q.notify({
      type: 'negative',
      message,
      icon: 'error',
      position: 'top',
    });
  } finally {
    loading.value = false;
  }
};

// STEP 2: OTP (mantenha o mesmo código do anterior)
const setOTPInputRef = (el: unknown, index: number) => {
  if (el instanceof HTMLInputElement) {
    otpInputsRef.value[index] = el;
  }
};

const focusOTPInput = (index: number) => {
  otpInputsRef.value[index]?.focus();
};

const handleOTPKeyDown = (event: KeyboardEvent, index: number) => {
  if (event.key === 'Backspace') {
    event.preventDefault();
    if (otpCodes.value[index] === '' && index > 0) {
      otpInputsRef.value[index - 1]?.focus();
      otpCodes.value[index - 1] = '';
    } else {
      otpCodes.value[index] = '';
    }
  } else if (event.key === 'ArrowLeft' && index > 0) {
    otpInputsRef.value[index - 1]?.focus();
  } else if (event.key === 'ArrowRight' && index < 5) {
    otpInputsRef.value[index + 1]?.focus();
  }
};

const handleOTPInput = async (index: number) => {
  const value = otpCodes.value[index];

  // Permite apenas números
  if (value && !/^\d$/.test(value)) {
    otpCodes.value[index] = '';
    return;
  }

  // Move para o próximo input
  if (value && index < 5) {
    await nextTick(() => {
      otpInputsRef.value[index + 1]?.focus();
    });
  }
};

const handleOTPFocus = async (index: number) => {
  await nextTick(() => {
    otpInputsRef.value[index]?.select();
  });
};

const handleOTPPaste = async (event: ClipboardEvent) => {
  event.preventDefault();
  const pasteData = event.clipboardData?.getData('text');
  if (pasteData && /^\d{6}$/.test(pasteData)) {
    const digits = pasteData.split('');
    digits.forEach((digit, index) => {
      if (index < 6) {
        otpCodes.value[index] = digit;
      }
    });
    await nextTick(() => {
      otpInputsRef.value[5]?.focus();
    });
  }
};

let timerInterval: NodeJS.Timeout;

const startOTPTimer = () => {
  timer.value = 60;
  clearInterval(timerInterval);

  timerInterval = setInterval(() => {
    if (timer.value > 0) {
      timer.value--;
    } else {
      clearInterval(timerInterval);
    }
  }, 1000);
};

const handleResendOTP = async () => {
  if (!canResendOTP.value) return;

  resendLoading.value = true;
  try {
    await authStore.requestPasswordReset(email.value);
    startOTPTimer();
    resetOTP();

    $q.notify({
      type: 'info',
      message: 'Código reenviado!',
      icon: 'send',
    });

    await nextTick(() => {
      if (otpInputsRef.value[0]) {
        otpInputsRef.value[0].focus();
      }
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro ao reenviar código';
    $q.notify({
      type: 'negative',
      message,
      icon: 'error',
    });
  } finally {
    resendLoading.value = false;
  }
};

const handleVerifyOTP = async () => {
  if (!isOTPComplete.value) return;

  verifyLoading.value = true;
  try {
    const otpCode = otpCodes.value.join('');

    await authStore.verifyOtp({
      email: email.value,
      code: otpCode,
    });
    $q.notify({
      type: 'positive',
      message: 'Código verificado com sucesso!',
      icon: 'check_circle',
    });

    goToStep(3);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro ao verificar código';
    $q.notify({
      type: 'negative',
      message,
      icon: 'error',
    });
  } finally {
    verifyLoading.value = false;
  }
};

// STEP 3: Password
const getPasswordStrength = (password: string) => {
  if (!password) return { class: 'weak', text: '' };

  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;

  if (strength <= 1) return { class: 'weak', text: 'Fraca' };
  if (strength <= 2) return { class: 'medium', text: 'Média' };
  if (strength <= 3) return { class: 'good', text: 'Boa' };
  return { class: 'strong', text: 'Forte' };
};

const handlePasswordSubmit = async () => {
  if (!isPasswordFormValid.value) return;

  loading.value = true;
  try {
    await authStore.confirmPasswordReset({
      token: otpCodes.value.join(''),
      newPassword: newPassword.value,
    });

    $q.notify({
      type: 'positive',
      message: 'Senha redefinida com sucesso!',
      icon: 'check_circle',
    });

    goToStep(4);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro ao redefinir senha';
    $q.notify({
      type: 'negative',
      message,
      icon: 'error',
    });
  } finally {
    loading.value = false;
  }
};

// STEP 4: Completion
const handleComplete = () => {
  close();
  emit('completed');
};

// Cleanup
onUnmounted(() => {
  if (timerInterval) {
    clearInterval(timerInterval);
  }
});

// Expose
defineExpose({
  open,
  close,
});
</script>

<style scoped lang="scss">
.recovery-popup-container {
  background: white;
  height: 100%;
  display: flex;
  flex-direction: column;
  max-width: 480px;
  margin: 0 auto;
  position: relative;
}

// Header com Progress Steps
.popup-header {
  padding: 24px 24px 0;
  position: relative;
  flex-shrink: 0;

  .close-btn {
    position: absolute;
    top: 8px;
    right: 8px;
    z-index: 10;
  }

  .progress-steps {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px 0;
    flex-wrap: wrap;
    gap: 8px;

    .step {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      flex: 1;
      min-width: 60px;

      .step-number {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: #f0f0f0;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.9rem;
        font-weight: 600;
        color: #999;
        transition: all 0.3s ease;
        flex-shrink: 0;
      }

      .step-label {
        font-size: 0.75rem;
        color: #999;
        transition: all 0.3s ease;
        text-align: center;
        line-height: 1.2;
      }

      &.active {
        .step-number {
          background: var(--q-primary);
          color: white;
        }
        .step-label {
          color: var(--q-primary);
          font-weight: 600;
        }
      }

      &.completed {
        .step-number {
          background: #4caf50;
          color: white;
        }
        .step-label {
          color: #4caf50;
        }
      }
    }

    .step-line {
      flex: 1;
      height: 2px;
      background: #f0f0f0;
      margin: 0 4px;
      transition: all 0.3s ease;
      min-width: 20px;
      max-width: 40px;

      &.completed {
        background: #4caf50;
      }
    }
  }
}

// Conteúdo dos Steps
.popup-content {
  flex: 1;
  padding: 0 24px 24px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.step-content {
  text-align: center;
  height: 100%;
  display: flex;
  flex-direction: column;

  .step-icon {
    width: 80px;
    height: 80px;
    background: #e3f2fd;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 20px;
    flex-shrink: 0;
  }

  .success-icon {
    width: 100px;
    height: 100px;
    background: #e8f5e8;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 20px;
    flex-shrink: 0;
  }

  h3 {
    margin: 0 0 12px 0;
    font-size: 1.5rem;
    font-weight: 600;
    color: #1a1a1a;
    line-height: 1.3;
  }

  p {
    margin: 4px 0;
    color: #666;
    font-size: 0.95rem;
    line-height: 1.4;
  }

  .email-text {
    font-weight: 600;
    color: var(--q-primary);
    font-size: 1rem;
    word-break: break-all;
  }
}

// Forms
.recovery-form,
.password-form {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 400px;
  margin: 0 auto;
  width: 100%;
  gap: 16px;
}

.password-field-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

// Política de Senha
.password-policy {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
  text-align: left;
  border: 1px solid #e9ecef;

  h4 {
    margin: 0 0 12px 0;
    font-size: 0.9rem;
    font-weight: 600;
    color: #333;
  }

  .policy-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .policy-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.8rem;
    color: #666;
    transition: all 0.3s ease;

    &.satisfied {
      color: #4caf50;
      font-weight: 500;
    }

    .q-icon {
      flex-shrink: 0;
    }

    span {
      line-height: 1.2;
    }
  }
}

// OTP Styles
.otp-section {
  margin: 24px 0;

  .otp-label {
    display: block;
    margin-bottom: 16px;
    color: #666;
    font-size: 0.9rem;
  }

  .otp-inputs {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-bottom: 20px;
    flex-wrap: wrap;

    .otp-digit {
      width: 44px;
      height: 44px;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      cursor: text;
      flex-shrink: 0;

      &.has-value {
        border-color: var(--q-primary);
        background: #f8fdff;
      }

      &:focus-within {
        border-color: var(--q-primary);
        box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.1);
      }

      input {
        width: 100%;
        height: 100%;
        border: none;
        background: transparent;
        text-align: center;
        font-size: 1.2rem;
        font-weight: 600;
        color: #1a1a1a;
        outline: none;

        &[type='number'] {
          -moz-appearance: textfield;
        }

        &::-webkit-outer-spin-button,
        &::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
      }
    }
  }
}

.otp-actions {
  margin: 16px 0;

  .resend-section,
  .timer-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }

  .resend-text,
  .timer-text {
    font-size: 0.85rem;
    color: #666;
    text-align: center;
  }
}

// Password Strength
.password-strength {
  .strength-bar {
    height: 6px;
    background: #e0e0e0;
    border-radius: 3px;
    overflow: hidden;
    margin-bottom: 6px;

    .strength-fill {
      height: 100%;
      transition: all 0.3s ease;

      &.weak {
        width: 25%;
        background: #f44336;
      }
      &.medium {
        width: 50%;
        background: #ff9800;
      }
      &.good {
        width: 75%;
        background: #4caf50;
      }
      &.strong {
        width: 100%;
        background: #2e7d32;
      }
    }
  }

  .strength-text {
    font-size: 0.75rem;
    color: #666;
    text-align: center;
  }
}

// Action Buttons
.action-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: auto;
  padding-top: 24px;
  flex-wrap: wrap;

  .back-btn,
  .verify-btn,
  .submit-btn,
  .login-btn {
    height: 48px;
    border-radius: 12px;
    font-weight: 500;
    font-size: 0.95rem;
    min-width: 140px;
    flex: 1;
  }

  .back-btn {
    border: 1px solid #e0e0e0;
  }
}

// Success Step
.success-step {
  justify-content: center;
  gap: 16px;
  text-align: center;
}

// ==================== RESPONSIVIDADE AVANÇADA ====================

// Mobile Small (até 360px)
@media (max-width: 360px) {
  .recovery-popup-container {
    max-width: 100%;
  }

  .popup-header {
    padding: 16px 16px 0;

    .progress-steps {
      padding: 12px 0;
      gap: 4px;

      .step {
        min-width: 50px;
        gap: 4px;

        .step-number {
          width: 28px;
          height: 28px;
          font-size: 0.8rem;
        }

        .step-label {
          font-size: 0.65rem;
        }
      }

      .step-line {
        min-width: 15px;
        margin: 0 2px;
      }
    }
  }

  .popup-content {
    padding: 0 16px 16px;
  }

  .step-content {
    .step-icon {
      width: 60px;
      height: 60px;
      margin-bottom: 16px;
    }

    .success-icon {
      width: 80px;
      height: 80px;
    }

    h3 {
      font-size: 1.3rem;
      margin-bottom: 8px;
    }

    p {
      font-size: 0.85rem;
    }
  }

  .otp-section {
    .otp-inputs {
      gap: 6px;

      .otp-digit {
        width: 38px;
        height: 38px;

        input {
          font-size: 1.1rem;
        }
      }
    }
  }

  .password-policy {
    padding: 12px;

    h4 {
      font-size: 0.85rem;
      margin-bottom: 8px;
    }

    .policy-item {
      font-size: 0.75rem;
      gap: 6px;
    }
  }

  .action-buttons {
    flex-direction: column;
    gap: 8px;

    .back-btn,
    .verify-btn,
    .submit-btn,
    .login-btn {
      min-width: 100%;
      height: 44px;
    }
  }
}

// Mobile Medium (361px - 480px)
@media (max-width: 480px) and (min-width: 361px) {
  .popup-header {
    padding: 20px 20px 0;
  }

  .popup-content {
    padding: 0 20px 20px;
  }

  .action-buttons {
    .back-btn,
    .verify-btn,
    .submit-btn,
    .login-btn {
      min-width: 120px;
    }
  }
}

// Tablet (481px - 768px)
@media (max-width: 768px) {
  .recovery-popup-container {
    max-width: 100%;
    border-radius: 0;
  }

  .full-width-mobile {
    width: 100% !important;
    min-width: 100% !important;
  }

  .mobile-order-1 {
    order: 1;
  }

  .mobile-order-2 {
    order: 2;
  }

  // Stack buttons vertically on very small screens
  @media (max-width: 400px) {
    .action-buttons {
      flex-direction: column;

      .back-btn,
      .verify-btn,
      .submit-btn,
      .login-btn {
        width: 100%;
        min-width: 100%;
      }
    }
  }
}

// Desktop (769px+)
@media (min-width: 769px) {
  .recovery-popup-container {
    height: auto;
    max-height: 90vh;
    border-radius: 16px;
    margin: 20px auto;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  }

  .popup-content {
    padding: 0 32px 32px;
  }

  .popup-header {
    padding: 32px 32px 0;
  }
}

// Landscape Orientation
@media (max-height: 600px) and (orientation: landscape) {
  .recovery-popup-container {
    max-height: 95vh;
  }

  .popup-header {
    padding: 16px 24px 0;
    flex-shrink: 0;

    .progress-steps {
      padding: 12px 0;
    }
  }

  .popup-content {
    padding: 0 24px 16px;
  }

  .step-content {
    .step-icon,
    .success-icon {
      width: 50px;
      height: 50px;
      margin-bottom: 12px;
    }

    h3 {
      font-size: 1.2rem;
      margin-bottom: 8px;
    }

    p {
      font-size: 0.85rem;
      margin: 2px 0;
    }
  }

  .action-buttons {
    padding-top: 16px;
  }
}

// High DPI Screens
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  .recovery-popup-container {
    border-width: 0.5px;
  }
}

// Animações
.step-content {
  animation: slideIn 0.3s ease-out;

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
}

// Safe Area Insets para iPhone X+
@supports (padding: max(0px)) {
  .recovery-popup-container {
    padding-left: max(16px, env(safe-area-inset-left));
    padding-right: max(16px, env(safe-area-inset-right));
    padding-bottom: max(16px, env(safe-area-inset-bottom));
  }
}
</style>
