<template>
  <q-dialog v-model="showDialog" persistent maximized>
    <div class="otp-popup-container">
      <!-- Header Simplificado -->
      <div class="popup-header">
        <div class="header-content">
          <div class="icon-container">
            <q-icon name="mail" size="28px" color="primary" />
          </div>
          <h3>Verifique seu e-mail</h3>
          <p>Enviamos um código de verificação para</p>
          <p class="email-text">{{ email }}</p>
        </div>
      </div>

      <!-- OTP Input -->
      <div class="otp-content">
        <div class="otp-input-section">
          <label class="otp-label">Digite o código de 6 dígitos</label>

          <!-- Inputs OTP Estilizados -->
          <div class="otp-inputs">
            <div
              v-for="n in 6"
              :key="n"
              class="otp-digit"
              :class="{ 'has-value': otpCodes[n - 1] !== '' }"
              @click="focusInput(n - 1)"
            >
              <input
                :ref="(el) => setInputRef(el, n - 1)"
                v-model="otpCodes[n - 1]"
                type="text"
                maxlength="1"
                inputmode="numeric"
                pattern="[0-9]*"
                @keydown="handleKeyDown($event, n - 1)"
                @input="handleOtpInput(n - 1)"
                @paste="handlePaste"
                @focus="handleFocus(n - 1)"
              />
            </div>
          </div>

          <!-- Timer e Reenviar -->
          <div class="otp-actions">
            <div v-if="canResend" class="resend-section">
              <span class="resend-text">Não recebeu o código?</span>
              <q-btn
                flat
                label="Reenviar código"
                color="primary"
                @click="handleResend"
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

        <!-- Actions -->
        <div class="popup-actions">
          <q-btn
            label="Cancelar"
            flat
            color="grey-7"
            @click="handleClose"
            class="cancel-btn"
            no-caps
          />
          <q-btn
            label="Verificar e Continuar"
            color="primary"
            @click="handleVerify"
            :loading="verifyLoading"
            :disable="!isOtpComplete"
            class="verify-btn"
            no-caps
          />
        </div>
      </div>
    </div>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';

interface Props {
  email: string;
}

interface Emits {
  (e: 'verify', payload: { email: string; code: string }): void;
  (e: 'resend', payload: { email: string }): void;
  (e: 'close'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// Refs
const showDialog = ref(true);
const otpCodes = ref(['', '', '', '', '', '']);
const inputsRefs = ref<(HTMLInputElement | null)[]>([]);
const verifyLoading = ref(false);
const resendLoading = ref(false);
const timer = ref(60);
const activeInput = ref(0);

// Método para definir as referências corretamente
const setInputRef = (el: unknown, index: number) => {
  if (el && el instanceof HTMLInputElement) {
    inputsRefs.value[index] = el;
  } else {
    inputsRefs.value[index] = null;
  }
};

// Computed
const isOtpComplete = computed(() => {
  return otpCodes.value.every((code) => code !== '');
});

const canResend = computed(() => {
  return timer.value === 0;
});

const formattedTime = computed(() => {
  const minutes = Math.floor(timer.value / 60);
  const seconds = timer.value % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
});

// Timer
let timerInterval: NodeJS.Timeout;

const startTimer = () => {
  timer.value = 60;
  timerInterval = setInterval(() => {
    if (timer.value > 0) {
      timer.value--;
    } else {
      clearInterval(timerInterval);
    }
  }, 1000);
};

// Handlers
const handleKeyDown = (event: KeyboardEvent, index: number) => {
  if (event.key === 'Backspace') {
    event.preventDefault();
    if (otpCodes.value[index] === '' && index > 0) {
      // Move para o input anterior e apaga
      inputsRefs.value[index - 1]?.focus();
      otpCodes.value[index - 1] = '';
    } else {
      // Apaga o conteúdo atual
      otpCodes.value[index] = '';
    }
  } else if (event.key === 'ArrowLeft' && index > 0) {
    inputsRefs.value[index - 1]?.focus();
  } else if (event.key === 'ArrowRight' && index < 5) {
    inputsRefs.value[index + 1]?.focus();
  } else if (event.key === 'Tab') {
    event.preventDefault();
    if (event.shiftKey && index > 0) {
      inputsRefs.value[index - 1]?.focus();
    } else if (!event.shiftKey && index < 5) {
      inputsRefs.value[index + 1]?.focus();
    }
  }
};

const handleOtpInput = (index: number) => {
  const value = otpCodes.value[index];

  // Permite apenas números
  if (value && !/^\d$/.test(value)) {
    otpCodes.value[index] = '';
    return;
  }

  // Move para o próximo input
  if (value && index < 5) {
    void nextTick(() => {
      inputsRefs.value[index + 1]?.focus();
      activeInput.value = index + 1;
    });
  }
};

const handleFocus = (index: number) => {
  activeInput.value = index;
  // Seleciona o texto no input quando focado
  void nextTick(() => {
    inputsRefs.value[index]?.select();
  });
};

const focusInput = (index: number) => {
  inputsRefs.value[index]?.focus();
};

const handlePaste = (event: ClipboardEvent) => {
  event.preventDefault();
  const pasteData = event.clipboardData?.getData('text');
  if (pasteData && /^\d{6}$/.test(pasteData)) {
    const digits = pasteData.split('');
    digits.forEach((digit, index) => {
      if (index < 6) {
        otpCodes.value[index] = digit;
      }
    });
    void nextTick(() => {
      inputsRefs.value[5]?.focus();
      activeInput.value = 5;
    });
  }
};

const handleVerify = () => {
  if (!isOtpComplete.value) return;

  verifyLoading.value = true;
  try {
    const otpCode = otpCodes.value.join('');
    // Usando void para ignorar a promise explicitamente
    void emit('verify', { email: props.email, code: otpCode });
  } catch (error) {
    console.error('Erro na verificação:', error);
  } finally {
    verifyLoading.value = false;
  }
};

const handleResend = () => {
  if (!canResend.value) return;

  resendLoading.value = true;
  try {
    // Usando void para ignorar a promise explicitamente
    void emit('resend', { email: props.email });
    startTimer(); // Reinicia o timer
    // Limpa os inputs
    otpCodes.value = ['', '', '', '', '', ''];
    inputsRefs.value = []; // Limpa as referências
    void nextTick(() => {
      if (inputsRefs.value[0]) {
        inputsRefs.value[0].focus();
        activeInput.value = 0;
      }
    });
  } catch (error) {
    console.error('Erro ao reenviar:', error);
  } finally {
    resendLoading.value = false;
  }
};

const handleClose = () => {
  showDialog.value = false;
  setTimeout(() => {
    // Usando void para ignorar a promise explicitamente
    void emit('close');
  }, 300);
};

// Lifecycle
onMounted(() => {
  startTimer();
  // Foca no primeiro input após próximo tick para garantir que as refs estão disponíveis
  void nextTick(() => {
    if (inputsRefs.value[0]) {
      inputsRefs.value[0].focus();
    }
  });
});

onUnmounted(() => {
  if (timerInterval) {
    clearInterval(timerInterval);
  }
});
</script>

<style scoped lang="scss">
.otp-popup-container {
  background: white;
  height: 100%;
  display: flex;
  flex-direction: column;
  max-width: 400px;
  margin: 0 auto;
  overflow: hidden;
}

.popup-header {
  padding: 40px 24px 24px;
  text-align: center;
  flex-shrink: 0;

  .icon-container {
    width: 64px;
    height: 64px;
    background: #e3f2fd;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 20px;
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
    color: #1976d2;
    font-size: 1rem;
    word-break: break-all;
    padding: 0 8px;
  }
}

.otp-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0 24px 24px;
  min-height: 0; /* Permite shrink em mobile */
}

.otp-input-section {
  text-align: center;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;

  .otp-label {
    display: block;
    margin-bottom: 24px;
    color: #666;
    font-size: 0.9rem;
    line-height: 1.4;
  }

  .otp-inputs {
    display: flex;
    justify-content: center;
    gap: 12px;
    margin-bottom: 32px;

    .otp-digit {
      width: 52px;
      height: 52px;
      border: 2px solid #e0e0e0;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      cursor: text;
      flex-shrink: 0;

      &.has-value {
        border-color: #1976d2;
        background: #f8fdff;
      }

      &:focus-within {
        border-color: #1976d2;
        box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.1);
      }

      input {
        width: 100%;
        height: 100%;
        border: none;
        background: transparent;
        text-align: center;
        font-size: 1.3rem;
        font-weight: 600;
        color: #1a1a1a;
        outline: none;
        cursor: text;

        &::placeholder {
          color: #ccc;
        }

        /* Remove as setas dos inputs number */
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
  margin-bottom: 32px;
  flex-shrink: 0;

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
    line-height: 1.4;
  }

  .resend-btn {
    font-size: 0.85rem;
    font-weight: 500;
    padding: 4px 12px;
    min-height: auto;
  }
}

.popup-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex-shrink: 0;

  .cancel-btn,
  .verify-btn {
    height: 48px;
    border-radius: 12px;
    font-weight: 500;
    font-size: 0.95rem;
    min-height: 48px;
  }

  .cancel-btn {
    border: 1px solid #e0e0e0;
  }

  .verify-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

/* ===== RESPONSIVIDADE PARA DISPOSITIVOS MENORES ===== */

/* Tablets Pequenos e Smartphones Grandes (768px para baixo) */
@media (max-width: 768px) {
  .otp-popup-container {
    max-width: 100%;
    border-radius: 0;
  }

  .popup-header {
    padding: 32px 20px 20px;

    .icon-container {
      width: 56px;
      height: 56px;
      margin-bottom: 16px;
    }

    h3 {
      font-size: 1.3rem;
      margin-bottom: 10px;
    }

    p {
      font-size: 0.9rem;
    }

    .email-text {
      font-size: 0.95rem;
    }
  }

  .otp-content {
    padding: 0 20px 20px;
  }
}

/* Smartphones Médios (480px para baixo) */
@media (max-width: 480px) {
  .popup-header {
    padding: 24px 16px 16px;

    .icon-container {
      width: 48px;
      height: 48px;
      margin-bottom: 12px;
    }

    h3 {
      font-size: 1.25rem;
      margin-bottom: 8px;
    }

    p {
      font-size: 0.85rem;
      margin: 3px 0;
    }

    .email-text {
      font-size: 0.9rem;
    }
  }

  .otp-content {
    padding: 0 16px 16px;
  }

  .otp-input-section {
    .otp-label {
      font-size: 0.85rem;
      margin-bottom: 20px;
    }

    .otp-inputs {
      gap: 8px;
      margin-bottom: 28px;

      .otp-digit {
        width: 44px;
        height: 44px;
        border-radius: 10px;

        input {
          font-size: 1.2rem;
        }
      }
    }
  }

  .otp-actions {
    margin-bottom: 28px;

    .resend-text,
    .timer-text {
      font-size: 0.8rem;
    }

    .resend-btn {
      font-size: 0.8rem;
      padding: 3px 10px;
    }
  }

  .popup-actions {
    gap: 10px;

    .cancel-btn,
    .verify-btn {
      height: 44px;
      min-height: 44px;
      font-size: 0.9rem;
    }
  }
}

/* Smartphones Pequenos (360px para baixo) */
@media (max-width: 360px) {
  .popup-header {
    padding: 20px 12px 12px;

    .icon-container {
      width: 44px;
      height: 44px;
    }

    h3 {
      font-size: 1.2rem;
    }

    p {
      font-size: 0.8rem;
    }

    .email-text {
      font-size: 0.85rem;
    }
  }

  .otp-content {
    padding: 0 12px 12px;
  }

  .otp-input-section {
    .otp-label {
      font-size: 0.8rem;
      margin-bottom: 18px;
    }

    .otp-inputs {
      gap: 6px;
      margin-bottom: 24px;

      .otp-digit {
        width: 40px;
        height: 40px;
        border-radius: 8px;

        input {
          font-size: 1.1rem;
        }
      }
    }
  }

  .otp-actions {
    margin-bottom: 24px;

    .resend-text,
    .timer-text {
      font-size: 0.75rem;
    }

    .resend-btn {
      font-size: 0.75rem;
    }
  }

  .popup-actions {
    gap: 8px;

    .cancel-btn,
    .verify-btn {
      height: 42px;
      min-height: 42px;
      font-size: 0.85rem;
    }
  }
}

/* Dispositivos Muito Pequenos (320px para baixo) */
@media (max-width: 320px) {
  .otp-inputs {
    gap: 4px !important;

    .otp-digit {
      width: 38px !important;
      height: 38px !important;

      input {
        font-size: 1rem !important;
      }
    }
  }

  .popup-header {
    padding: 16px 10px 10px;
  }

  .otp-content {
    padding: 0 10px 10px;
  }
}

/* Ajustes para telas muito altas */
@media (min-height: 800px) and (max-width: 480px) {
  .otp-content {
    justify-content: center;
    gap: 40px;
  }
}

/* Ajustes de orientação landscape em mobile */
@media (max-height: 500px) and (orientation: landscape) {
  .otp-popup-container {
    overflow-y: auto;
  }

  .popup-header {
    padding: 20px 16px 16px;
    flex-shrink: 0;
  }

  .otp-content {
    padding: 0 16px 16px;
  }

  .otp-input-section {
    .otp-inputs {
      margin-bottom: 20px;
    }
  }

  .otp-actions {
    margin-bottom: 20px;
  }
}

/* Modo Desktop - quando a tela é maior que mobile */
@media (min-width: 769px) {
  .otp-popup-container {
    height: auto;
    max-height: 90vh;
    border-radius: 16px;
    margin: 20px auto;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  }
}
</style>
