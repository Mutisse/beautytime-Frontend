<template>
  <q-dialog v-model="showDialog" persistent maximized>
    <div class="recovery-popup-container">
      <!-- Header -->
      <div class="popup-header">
        <q-btn flat round icon="close" @click="handleClose" class="close-btn" />
        <div class="header-content">
          <div class="icon-container">
            <q-icon name="lock_reset" size="28px" color="primary" />
          </div>
          <h3>Recuperar Senha</h3>
          <p>Digite seu email para receber o código de verificação</p>
        </div>
      </div>

      <!-- Form Content -->
      <div class="popup-content">
        <q-form @submit.prevent="submitForm" class="recovery-form">
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

          <q-btn
            label="Enviar Código"
            type="submit"
            color="primary"
            class="submit-btn"
            :loading="loading"
            :disable="!email"
          >
            <template v-slot:loading>
              <q-spinner-hourglass class="on-left" />
              Enviando...
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
import { ref, defineEmits, defineExpose } from 'vue';
import { useQuasar } from 'quasar';
import { useAuthStore } from '../../stores/auth-store';

const $q = useQuasar();
const authStore = useAuthStore();

// Refs
const showDialog = ref(false);
const email = ref('');
const loading = ref(false);

// Emits
const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'email-sent', email: string): void;
}>();

// Methods
const open = () => {
  showDialog.value = true;
  email.value = '';
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

const submitForm = async () => {
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

    // Emite evento para próximo passo
    emit('email-sent', email.value);
    handleClose();
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

// Expose methods
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

.recovery-form {
  .email-input {
    margin-bottom: 24px;
  }

  .submit-btn {
    height: 48px;
    border-radius: 12px;
    font-weight: 500;
    font-size: 0.95rem;
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
  .recovery-popup-container {
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
  .recovery-popup-container {
    height: auto;
    max-height: 90vh;
    border-radius: 16px;
    margin: 20px auto;
  }
}
</style>
