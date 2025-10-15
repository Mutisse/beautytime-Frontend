<template>
  <div class="login-form-container">
    <!-- Logo Pequena à Direita -->
    <div class="logo-small-right">
      <div class="logo-mini">
        <q-icon name="spa" size="24px" color="primary" />
        <span class="logo-text-mini">BeautyTime</span>
      </div>
    </div>

    <!-- Form Content - COMPONENTES JUNTOS -->
    <div class="form-content-compact">
      <q-form @submit.prevent="handleSubmit" class="login-form-compact">
        <div class="form-step-compact">
          <!-- Header Maior -->
          <div class="header-mini">
            <h2>Bem-vindo de Volta!</h2>
            <p>Entre na sua conta para continuar</p>
          </div>

          <!-- Campos Maiores -->
          <div class="fields-group">
            <q-input
              v-model="form.email"
              label="Email *"
              type="email"
              outlined
              dense
              class="input-mini"
              :rules="emailRules"
            >
              <template v-slot:prepend>
                <q-icon name="email" color="primary" size="18px" />
              </template>
            </q-input>

            <q-input
              v-model="form.password"
              label="Senha *"
              :type="showPassword ? 'text' : 'password'"
              outlined
              dense
              class="input-mini"
              :rules="passwordRules"
            >
              <template v-slot:prepend>
                <q-icon name="lock" color="primary" size="18px" />
              </template>
              <template v-slot:append>
                <q-icon
                  :name="showPassword ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  size="18px"
                  @click="showPassword = !showPassword"
                />
              </template>
            </q-input>
          </div>

          <!-- Options Compact -->
          <div class="options-mini">
            <q-checkbox v-model="rememberMe" label="Lembrar-me" class="checkbox-mini" dense />
            <q-btn
              flat
              label="Esqueceu sua senha?"
              color="primary"
              @click="openRecoveryPopup"
              no-caps
              class="forgot-mini"
              size="12px"
            />
          </div>

          <!-- Botão Maior -->
          <div class="actions-mini">
            <q-btn
              label="Entrar"
              type="submit"
              color="primary"
              class="btn-mini"
              :loading="loading"
              icon="login"
            />
          </div>

          <!-- Social Compact -->
          <div class="social-mini">
            <div class="divider-mini">
              <q-separator />
              <span class="divider-text-mini">ou entre com</span>
              <q-separator />
            </div>

            <div class="social-buttons-mini">
              <q-btn
                outline
                class="social-btn-mini"
                @click="handleSocialLogin('facebook')"
                :loading="socialLoading === 'facebook'"
                dense
              >
                <q-icon size="16px">
                  <svg viewBox="0 0 24 24" width="16" height="16">
                    <path
                      d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"
                      fill="#1877F2"
                    />
                  </svg>
                </q-icon>
                <span class="q-ml-xs">Facebook</span>
              </q-btn>
            </div>
          </div>
        </div>
      </q-form>
    </div>

    <!-- Popup de Recuperação de Senha -->
    <RecoveryPasswordPopup
      ref="recoveryPopupRef"
      @close="onRecoveryClose"
      @email-sent="onRecoveryEmailSent"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import RecoveryPasswordPopup from '../../Popup/RecoveryRequestPopup.vue'; // Ajuste o caminho conforme necessário

const $q = useQuasar();
const emit = defineEmits(['login', 'forgotPassword']);

// Refs
const recoveryPopupRef = ref<InstanceType<typeof RecoveryPasswordPopup> | null>(null);

// Form data
const form = ref({
  email: '',
  password: '',
});

// UI states
const showPassword = ref(false);
const rememberMe = ref(false);
const loading = ref(false);
const socialLoading = ref<string | null>(null);

// Validation rules
const emailRules = [
  (val: string) => !!val || 'Email é obrigatório',
  (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || 'Email inválido',
];

const passwordRules = [
  (val: string) => !!val || 'Senha é obrigatória',
  (val: string) => val.length >= 6 || 'Mínimo 6 caracteres',
];

// Método para abrir o popup de recuperação
const openRecoveryPopup = () => {
  if (recoveryPopupRef.value) {
    recoveryPopupRef.value.open();
  }
};

// Handlers para eventos do popup
const onRecoveryClose = () => {
  console.log('Popup de recuperação fechado');
};

const onRecoveryEmailSent = (email: string) => {
  console.log('Email de recuperação enviado para:', email);
  $q.notify({
    type: 'positive',
    message: `Código enviado para ${email}`,
    position: 'top',
  });
};

// Handlers existentes
const handleSubmit = () => {
  loading.value = true;
  try {
    emit('login', {
      email: form.value.email,
      password: form.value.password,
      remember: rememberMe.value,
    });
    showSuccess('Login realizado com sucesso!');
  } catch (error) {
    showError(error instanceof Error ? error.message : 'Credenciais inválidas');
  } finally {
    loading.value = false;
  }
};

const handleSocialLogin = async (provider: 'facebook') => {
  socialLoading.value = provider;
  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    emit('login', {
      email: `user-${provider}@example.com`,
      socialAuth: true,
    });

    showSuccess(`Login com Facebook realizado!`);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : `Falha no login com Facebook`;

    showError(errorMessage);
  } finally {
    socialLoading.value = null;
  }
};

// Notification helpers
const showSuccess = (message: string) => {
  $q.notify({
    type: 'positive',
    message,
    icon: 'check_circle',
    position: 'top',
  });
};

const showError = (message: string) => {
  $q.notify({
    type: 'negative',
    message,
    icon: 'error',
    position: 'top',
  });
};
</script>

<style scoped lang="scss">
/* Seus estilos existentes permanecem os mesmos */
.login-form-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  width: 100%;
  height: 100%;
  padding: 0;
}

/* Logo Pequena à Direita */
.logo-small-right {
  flex-shrink: 0;
  padding: 15px 20px 10px 0;
  text-align: right;
}

.logo-mini {
  display: inline-flex;
  align-items: center;
  gap: 6px;

  .logo-text-mini {
    font-size: 1rem;
    font-weight: 600;
    color: #1976d2;
  }
}

/* Form Content - COMPONENTES JUNTOS */
.form-content-compact {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  width: 100%;
  padding: 0 20px;
}

.login-form-compact {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  width: 100%;
}

.form-step-compact {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  width: 100%;
  gap: 25px;
}

/* Header Maior */
.header-mini {
  text-align: center;
  flex-shrink: 0;

  h2 {
    margin: 0 0 6px 0;
    font-weight: 600;
    color: #2c3e50;
    font-size: 1.2rem;
  }

  p {
    margin: 0;
    color: #6c757d;
    font-size: 0.85rem;
  }
}

/* Campos Maiores */
.fields-group {
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex-shrink: 0;
}

.input-mini {
  :deep(.q-field__control) {
    border-radius: 8px;
    min-height: 44px;
  }

  :deep(.q-field__native) {
    padding: 8px 12px;
    font-size: 0.9rem;
  }

  :deep(.q-field__prepend) {
    padding-right: 8px;
  }

  :deep(.q-field__append) {
    padding-left: 8px;
  }
}

/* Options Compact */
.options-mini {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;

  .checkbox-mini {
    :deep(.q-checkbox__label) {
      font-size: 0.8rem;
      color: #6c757d;
    }
  }

  .forgot-mini {
    font-size: 0.8rem;
    font-weight: 500;
    padding: 2px 4px;
    min-height: auto;
  }
}

/* Botão Maior Centralizado */
.actions-mini {
  flex-shrink: 0;
  display: flex;
  justify-content: center;

  .btn-mini {
    height: 42px;
    font-weight: 600;
    border-radius: 8px;
    text-transform: none;
    font-size: 0.9rem;
    width: 50%; /* Largura reduzida */

    .q-icon {
      font-size: 16px;
      margin-right: 6px;
    }
  }
}

/* Social Compact */
.social-mini {
  flex-shrink: 0;
}

.divider-mini {
  display: flex;
  align-items: center;
  margin: 20px 0 15px 0;
  gap: 10px;

  .q-separator {
    flex: 1;
    background: #e9ecef;
  }

  .divider-text-mini {
    font-size: 0.8rem;
    color: #6c757d;
    font-weight: 500;
    white-space: nowrap;
  }
}

/* Botão Facebook Centralizado */
.social-buttons-mini {
  display: flex;
  justify-content: center;
}

.social-btn-mini {
  border-radius: 6px;
  height: 38px;
  font-weight: 500;
  text-transform: none;
  transition: all 0.3s ease;
  border: 1px solid #e0e0e0;
  font-size: 0.8rem;
  width: 200px; /* Largura fixa para centralizar melhor */

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  }

  .q-icon {
    margin-right: 5px;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .logo-small-right {
    padding: 12px 15px 8px 0;

    .logo-mini {
      .logo-text-mini {
        font-size: 0.9rem;
      }
    }
  }

  .form-content-compact {
    padding: 0 15px;
  }

  .options-mini {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;

    .forgot-mini {
      align-self: flex-end;
    }
  }

  .social-btn-mini {
    width: 100%; /* No mobile ocupa toda largura */
    max-width: 200px;
  }
}

@media (max-height: 600px) {
  .form-step-compact {
    gap: 20px;
  }

  .fields-group {
    gap: 14px;
  }

  .divider-mini {
    margin: 15px 0 12px 0;
  }
}
</style>
