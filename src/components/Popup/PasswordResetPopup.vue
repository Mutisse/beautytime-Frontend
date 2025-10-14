<template>
  <q-dialog v-model="showDialog" persistent maximized>
    <div class="reset-popup-container">
      <!-- Header -->
      <div class="popup-header">
        <q-btn flat round icon="close" @click="handleClose" class="close-btn" />
        <div class="header-content">
          <div class="icon-container">
            <q-icon name="password" size="28px" color="primary" />
          </div>
          <h3>Crie sua nova senha</h3>
          <p>Digite e confirme sua nova senha</p>
        </div>
      </div>

      <!-- Form Content -->
      <div class="popup-content">
        <q-form @submit.prevent="submitForm" class="reset-form">
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
            ]"
            :disable="loading"
            class="password-input"
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

          <div class="password-strength" v-if="newPassword">
            <div class="strength-bar">
              <div class="strength-fill" :class="getPasswordStrength(newPassword).class"></div>
            </div>
            <span class="strength-text">{{ getPasswordStrength(newPassword).text }}</span>
          </div>

          <q-input
            v-model="confirmPassword"
            label="Confirmar Senha"
            :type="showPassword ? 'text' : 'password'"
            outlined
            dense
            lazy-rules
            :rules="[
              (val: string) => !!val || 'Confirmação obrigatória',
              (val: string) => val === newPassword || 'Senhas devem ser iguais',
            ]"
            :disable="loading"
            class="confirm-input"
          />

          <q-btn
            label="Redefinir Senha"
            type="submit"
            color="primary"
            class="submit-btn"
            :loading="loading"
            :disable="!isFormValid"
          >
            <template v-slot:loading>
              <q-spinner-hourglass class="on-left" />
              Atualizando...
            </template>
          </q-btn>
        </q-form>

        <div class="back-to-login">
          <q-btn
            flat
            label="Voltar para Login"
            color="primary"
            @click="handleClose"
            class="back-btn"
          />
        </div>
      </div>
    </div>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed, defineEmits, defineExpose } from 'vue';
import { useQuasar } from 'quasar';
import { useAuthStore } from '../../stores/auth-store';

const $q = useQuasar();
const authStore = useAuthStore();

// Refs
const showDialog = ref(false);
const newPassword = ref('');
const confirmPassword = ref('');
const showPassword = ref(false);
const loading = ref(false);
const token = ref('');

// Computed
const isFormValid = computed(() => {
  return (
    newPassword.value &&
    confirmPassword.value &&
    newPassword.value === confirmPassword.value &&
    newPassword.value.length >= 8
  );
});

// Emits
const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'success'): void;
}>();

// Methods
const open = (resetToken: string) => {
  showDialog.value = true;
  token.value = resetToken;
  newPassword.value = '';
  confirmPassword.value = '';
  showPassword.value = false;
  loading.value = false;
};

const close = () => {
  showDialog.value = false;
};

const handleClose = () => {
  close();
  setTimeout(() => {
    emit('close');
  }, 300);
};

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

const submitForm = async () => {
  if (!isFormValid.value) return;

  loading.value = true;
  try {
    await authStore.confirmPasswordReset({
      token: token.value,
      newPassword: newPassword.value,
    });

    $q.notify({
      type: 'positive',
      message: 'Senha redefinida com sucesso!',
      icon: 'check_circle',
      position: 'top',
    });

    emit('success');
    handleClose();
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro ao redefinir senha';
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

// Expose methods
defineExpose({
  open,
  close,
});
</script>

<style scoped lang="scss">
.reset-popup-container {
  background: white;
  height: 100%;
  display: flex;
  flex-direction: column;
  max-width: 400px;
  margin: 0 auto;
}

.popup-header {
  padding: 40px 24px 24px;
  text-align: center;
  position: relative;
  flex-shrink: 0;

  .close-btn {
    position: absolute;
    top: 15px;
    right: 15px;
  }

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
  }

  p {
    margin: 0;
    color: #666;
    font-size: 0.95rem;
    line-height: 1.4;
  }
}

.popup-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0 24px 24px;
}

.reset-form {
  .password-input,
  .confirm-input {
    margin-bottom: 16px;
  }

  .password-strength {
    margin-bottom: 16px;

    .strength-bar {
      height: 4px;
      background: #e0e0e0;
      border-radius: 2px;
      overflow: hidden;
      margin-bottom: 4px;

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
    }
  }

  .submit-btn {
    height: 48px;
    border-radius: 12px;
    font-weight: 500;
    font-size: 0.95rem;
    margin-top: 8px;
  }
}

.back-to-login {
  text-align: center;
  flex-shrink: 0;

  .back-btn {
    font-size: 0.9rem;
  }
}

// Responsive
@media (max-width: 480px) {
  .reset-popup-container {
    max-width: 100%;
  }

  .popup-header {
    padding: 32px 20px 20px;
  }

  .popup-content {
    padding: 0 20px 20px;
  }
}

@media (min-width: 768px) {
  .reset-popup-container {
    height: auto;
    max-height: 90vh;
    border-radius: 16px;
    margin: 20px auto;
  }
}
</style>
