<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { useAuthStore } from '../../stores/auth-store';

const $q = useQuasar();
const authStore = useAuthStore();
const email = ref('');
const loading = ref(false);

const submitForm = async () => {
  loading.value = true;
  try {
    // ✅ AGORA O MÉTODO EXISTE
    await authStore.requestPasswordReset(email.value);

    $q.notify({
      type: 'positive',
      message: 'Enviamos um link de redefinição para seu email',
      icon: 'check_circle',
      position: 'top',
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Erro ao solicitar redefinição de senha';
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
</script>

<!-- Template permanece igual -->

<template>
  <q-page class="flex flex-center bg-grey-1">
    <q-card class="auth-card" flat bordered>
      <q-card-section class="bg-primary text-white">
        <div class="text-h4 text-center q-mb-sm">Recuperar Senha</div>
        <div class="text-subtitle2 text-center">
          Digite seu email para receber o link de redefinição
        </div>
      </q-card-section>

      <q-card-section class="q-pt-xl">
        <q-form @submit.prevent="submitForm" class="q-gutter-md">
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
          >
            <template v-slot:prepend>
              <q-icon name="mail" />
            </template>
          </q-input>

          <q-btn
            label="Enviar Link"
            type="submit"
            color="primary"
            class="full-width q-mt-md"
            :loading="loading"
            :disable="!email"
          >
            <template v-slot:loading>
              <q-spinner-hourglass class="on-left" />
              Enviando...
            </template>
          </q-btn>
        </q-form>

        <div class="text-center q-mt-lg">
          <q-btn flat label="Voltar para Login" color="primary" to="/auth" class="q-px-sm" />
        </div>
      </q-card-section>
    </q-card>

    <q-inner-loading :showing="loading" />
  </q-page>
</template>

<style scoped>
.auth-card {
  width: 100%;
  max-width: 450px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}
</style>
