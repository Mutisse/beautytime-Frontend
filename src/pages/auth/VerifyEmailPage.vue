<!-- src/pages/VerifyEmailPage.vue -->
<template>
  <q-page class="flex flex-center bg-grey-1">
    <div class="full-width" style="max-width: 500px;">
      <!-- Estado de acesso inválido -->
      <div v-if="accessDenied" class="text-center q-pa-lg">
        <q-icon name="block" size="80px" color="negative" class="q-mb-md" />
        <h2 class="text-h4 text-weight-bold text-negative">Acesso Não Permitido</h2>
        <p class="text-h6 q-mt-md text-grey-7">
          Esta página só pode ser acessada após o registro.
        </p>
        <p class="text-body1 q-mt-lg text-grey-7">
          Complete o processo de registro para verificar seu email.
        </p>
        
        <div class="q-mt-xl">
          <q-btn 
            color="primary" 
            label="Fazer Registro" 
            to="/auth" 
            size="lg"
            no-caps
          />
          <q-btn 
            flat 
            label="Voltar para Home" 
            to="/" 
            class="q-ml-sm"
            no-caps
          />
        </div>
      </div>

      <!-- Estado de carregamento -->
      <div v-else-if="loading" class="text-center">
        <q-spinner-gears size="50px" color="primary" />
        <div class="text-h6 q-mt-md">Carregando...</div>
      </div>

      <!-- Estado de verificação -->
      <div v-else class="text-center q-pa-lg">
        <q-icon name="verified" size="80px" color="primary" class="q-mb-md" />
        <h1 class="text-h4 text-weight-bold">Verifique seu Email</h1>
        <p class="text-h6 q-mt-md text-grey-7">
          Enviamos um código de 6 dígitos para
        </p>
        <p class="text-h6 text-weight-bold text-primary q-mb-xl">
          {{ userEmail }}
        </p>

        <!-- Componente OTP -->
        <OtpVerificationDialog
          :email="userEmail"
          :show="true"
          @close="handleClose"
          @back="handleBack"
          @verified="handleVerified"
          @resend="handleResend"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import OtpVerificationDialog from '../../components/Forms/auth/OtpVerificationDialog.vue'; // ← AGORA ESTÁ CORRETO

const $q = useQuasar();
const route = useRoute();
const router = useRouter();

// Estados
const userEmail = ref('');
const loading = ref(true);
const accessDenied = ref(false);

// Verificar se o acesso é válido
onMounted(() => {
  const emailFromRoute = route.query.email as string;
  const emailFromStorage = localStorage.getItem('pending_verification_email');
  const registrationSource = localStorage.getItem('registration_source');

  console.log('🔍 Verificando acesso à página de verificação:');
  console.log('📧 Email da rota:', emailFromRoute);
  console.log('📧 Email do storage:', emailFromStorage);
  console.log('📝 Fonte do registro:', registrationSource);

  const isValidAccess = (emailFromRoute || emailFromStorage) && registrationSource;

  if (isValidAccess) {
    userEmail.value = emailFromRoute || emailFromStorage || '';
    loading.value = false;
    localStorage.removeItem('registration_source');
    console.log('✅ Acesso válido à página de verificação');
  } else {
    accessDenied.value = true;
    loading.value = false;
    localStorage.removeItem('pending_verification_email');
    localStorage.removeItem('registration_source');
    console.log('❌ Acesso negado à página de verificação');
  }
});

const handleClose = () => {
  $q.notify({
    type: 'info',
    message: 'Verificação cancelada',
    position: 'top'
  });
  redirectToAuth();
};

const handleBack = () => {
  redirectToAuth();
};

const handleVerified = () => {
  $q.notify({
    type: 'positive',
    message: 'Email verificado com sucesso!',
    position: 'top',
    timeout: 3000
  });
  
  localStorage.removeItem('pending_verification_email');
  
  setTimeout(() => {
    void router.push('/');
  }, 2000);
};

const handleResend = () => {
  console.log('Reenviando OTP para:', userEmail.value);
};

const redirectToAuth = () => {
 void router.push('/auth');
};
</script>

<style scoped>
.text-negative {
  color: #f44336;
}

.text-grey-7 {
  color: #616161;
}
</style>