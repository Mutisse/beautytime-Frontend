<template>
  <q-page class="flex flex-center">
    <q-card class="error-card" :class="{ 'card-animate': animateCard }">
      <div class="row">
        <!-- Illustration Section -->
        <div class="col-md-6 col-xs-12 illustration-section">
          <q-img
            src="../assets/err/500_Internal_Server_Error-pana.png"
            alt="Erro do Servidor"
            class="error-illustration"
            :class="{ 'shake-animation': animateIllustration }"
            @animationend="animateIllustration = false"
          />
        </div>

        <!-- Content Section -->
        <div class="col-md-6 col-xs-12 content-section">
          <div class="q-pa-xl">
            <h1
              class="error-title text-h4 text-weight-bold"
              :class="{ 'title-animate': animateTitle }"
            >
              500 - Erro do Servidor
            </h1>

            <p class="error-description text-subtitle1" :class="{ 'text-fade-in': animateText }">
              Oops! Algo inesperado aconteceu no nosso servidor.
            </p>

            <p class="error-instructions text-body2" :class="{ 'text-fade-in': animateText }">
              Nossa equipe já foi notificada sobre o problema. Por favor, tente novamente mais
              tarde.
            </p>

            <div class="action-buttons row q-gutter-sm">
              <q-btn
                color="primary"
                icon="refresh"
                label="Tentar Novamente"
                @click="refreshPage"
                :class="{ 'button-pulse': animateButtons }"
                class="refresh-button"
              />

              <q-btn
                color="orange"
                icon="support"
                label="Suporte Técnico"
                @click="contactSupport"
                :class="{ 'button-pulse': animateButtons }"
                class="support-button"
              />

              <!-- BOTÃO VOLTAR À PÁGINA INICIAL -->
              <q-btn
                color="grey-6"
                icon="home"
                label="Voltar ao Início"
                @click="goToHome"
                class="home-button"
                flat
              />
            </div>

            <q-slide-transition>
              <div v-if="showDetails" class="technical-details q-mt-md">
                <p class="details-title text-weight-medium">Detalhes Técnicos:</p>

                <q-card class="q-pa-sm bg-grey-2">
                  <pre class="error-details">{{ errorDetails }}</pre>
                </q-card>

                <q-btn
                  color="grey-6"
                  icon="content_copy"
                  label="Copiar Detalhes"
                  @click="copyErrorDetails"
                  class="q-mt-sm copy-button"
                  size="sm"
                />
              </div>
            </q-slide-transition>

            <q-btn
              flat
              color="primary"
              :label="showDetails ? 'Ocultar Detalhes' : 'Mostrar Detalhes'"
              @click="toggleDetails"
              class="toggle-details-button q-mt-md"
            />
          </div>
        </div>
      </div>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';

const $q = useQuasar();
const router = useRouter();
const showDetails = ref(false);
const errorDetails = ref(
  'Error: Server responded with status 500\nPath: /api/v1/endpoint\nTimestamp: ' +
    new Date().toISOString(),
);

// Animation states
const animateCard = ref(false);
const animateIllustration = ref(false);
const animateTitle = ref(false);
const animateText = ref(false);
const animateButtons = ref(false);

onMounted(() => {
  // Trigger animations sequentially
  setTimeout(() => (animateCard.value = true), 100);
  setTimeout(() => (animateIllustration.value = true), 300);
  setTimeout(() => (animateTitle.value = true), 500);
  setTimeout(() => (animateText.value = true), 700);
  setTimeout(() => (animateButtons.value = true), 900);

  // Keep buttons pulsing occasionally
  setInterval(() => {
    animateButtons.value = true;
    setTimeout(() => (animateButtons.value = false), 1000);
  }, 10000);
});

const refreshPage = () => {
  animateIllustration.value = true;
  setTimeout(() => window.location.reload(), 1000);
};

const contactSupport = async () => {
  try {
    await router.push('/suporte');
  } catch (error) {
    console.error('Erro ao navegar para suporte:', error);
    // Fallback para navegação tradicional se necessário
    window.location.href = '/suporte';
  }
};

const goToHome = async () => {
  try {
    await router.push('/');
  } catch (error) {
    console.error('Erro ao navegar para home:', error);
    // Fallback para navegação tradicional se necessário
    window.location.href = '/';
  }
};

const toggleDetails = () => {
  showDetails.value = !showDetails.value;
};

const copyErrorDetails = async () => {
  try {
    await navigator.clipboard.writeText(errorDetails.value);
    $q.notify({
      type: 'positive',
      message: 'Detalhes do erro copiados para a área de transferência!',
      timeout: 2000,
      position: 'top',
      actions: [{ icon: 'close', color: 'white' }],
    });
  } catch (err) {
    console.error('Erro ao copiar:', err);
    $q.notify({
      type: 'negative',
      message: 'Falha ao copiar detalhes do erro',
      timeout: 2000,
      position: 'top',
    });
  }
};
</script>

<style scoped lang="scss">
.server-error-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  animation: bg-pan 15s infinite alternate;
}

.error-card {
  max-width: 1100px;
  width: 90%;
  opacity: 0;
  transform: translateY(20px);
  border-radius: 16px;
  overflow: hidden;
}

.card-animate {
  animation: card-entrance 0.6s ease-out forwards;
}

.illustration-section {
  background: linear-gradient(135deg, #407bff 0%, #407cff56 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  transition: all 0.5s ease;
}

.error-illustration {
  max-width: 100%;
  height: auto;
  filter: drop-shadow(0 5px 15px rgba(0, 0, 0, 0.2));
  transform-origin: center bottom;
}

.shake-animation {
  animation: shake 0.8s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}

.content-section {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.error-title {
  color: $dark;
  margin-bottom: 1rem;
  opacity: 0;
  transform: translateX(-20px);
}

.title-animate {
  animation: title-slide-in 0.5s ease-out forwards;
}

.error-description,
.error-instructions {
  opacity: 0;
  transform: translateY(10px);
}

.text-fade-in {
  animation: text-fade 0.6s ease-out forwards;
}

.error-description {
  color: $grey-8;
  margin-bottom: 0.5rem;
  animation-delay: 0.2s;
}

.error-instructions {
  color: $grey-6;
  margin-bottom: 2rem;
  animation-delay: 0.4s;
}

.refresh-button:hover,
.support-button:hover,
.home-button:hover {
  transform: translateY(-2px);
}

.button-pulse {
  animation: pulse 1.5s infinite;
}

.technical-details {
  border-left: 4px solid $negative;
}

.error-details {
  white-space: pre-wrap;
  font-family: 'Courier New', monospace;
  color: $grey-8;
  margin: 0;
  padding: 1rem;
  overflow-x: auto;
}

.copy-button:hover {
  transform: translateY(-1px);
}

.toggle-details-button:hover {
  transform: translateX(3px);
}

/* Animations */
@keyframes card-entrance {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  10%,
  30%,
  50%,
  70%,
  90% {
    transform: translateX(-5px);
  }
  20%,
  40%,
  60%,
  80% {
    transform: translateX(5px);
  }
}

@keyframes title-slide-in {
  0% {
    opacity: 0;
    transform: translateX(-20px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes text-fade {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(66, 153, 225, 0.4);
  }
  70% {
    transform: scale(1.03);
    box-shadow: 0 0 0 10px rgba(66, 153, 225, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(66, 153, 225, 0);
  }
}

@keyframes bg-pan {
  0% {
    background-position: 0% 0%;
  }
  100% {
    background-position: 100% 100%;
  }
}

@media (max-width: 768px) {
  .illustration-section {
    padding: 1.5rem;
  }

  .action-buttons {
    flex-direction: column;
  }

  @keyframes shake {
    0%,
    100% {
      transform: translateY(0);
    }
    10%,
    30%,
    50%,
    70%,
    90% {
      transform: translateY(-3px);
    }
    20%,
    40%,
    60%,
    80% {
      transform: translateY(3px);
    }
  }
}
</style>
