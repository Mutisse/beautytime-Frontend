<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useAuthStore } from '../../stores/auth-store';

const $q = useQuasar();
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const token = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const showPassword = ref(false);
const loading = ref(false);

onMounted(() => {
  token.value = route.params.token as string;
});

const submitForm = async () => {
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
    await router.push('/auth'); // ← também adicione await aqui
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
</script>

<template>
  <q-page class="flex flex-center bg-grey-1">
    <q-card class="auth-card" flat bordered>
      <q-card-section class="bg-primary text-white">
        <div class="text-h4 text-center q-mb-sm">Crie sua nova senha</div>
        <div class="text-subtitle2 text-center">Digite e confirme sua nova senha</div>
      </q-card-section>

      <q-card-section class="q-pt-xl">
        <q-form @submit.prevent="submitForm" class="q-gutter-md">
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
          />

          <q-btn
            label="Redefinir Senha"
            type="submit"
            color="primary"
            class="full-width q-mt-md"
            :loading="loading"
            :disable="!newPassword || !confirmPassword || newPassword !== confirmPassword"
          >
            <template v-slot:loading>
              <q-spinner-hourglass class="on-left" />
              Atualizando...
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

.password-strength {
  margin-top: -8px;
  font-size: 12px;
  color: #666;
}
</style>
