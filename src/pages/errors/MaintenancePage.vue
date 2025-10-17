<template>
  <div class="fullscreen bg-white text-center q-pa-md flex flex-center">
    <div class="maintenance-container">
      <!-- Imagem ilustrativa -->
      <div class="image-container q-mb-lg">
        <q-img
          src="https://static.vecteezy.com/system/resources/previews/027/513/585/non_2x/technical-repair-concept-flat-illustration-vector.jpg"
          alt="Sistema em manutenção"
          class="maintenance-image"
          style="max-width: 300px; height: auto"
        >
          <template v-slot:error>
            <div class="flex flex-center column">
              <q-icon name="construction" size="xl" color="blue-6" />
              <div class="text-h6 q-mt-md text-blue-8">Imagem em manutenção</div>
            </div>
          </template>
        </q-img>
      </div>

      <!-- Ícone e título -->
      <div class="q-mb-md">
        <q-icon name="engineering" size="xl" color="blue-6" class="q-mb-sm" />
        <div class="text-h3 text-blue-10 q-mb-sm" style="font-weight: 600">Em Manutenção</div>
      </div>

      <!-- Mensagem explicativa -->
      <div
        class="text-h6 text-blue-8 q-mb-xl"
        style="opacity: 0.8; max-width: 500px; margin: 0 auto; line-height: 1.6"
      >
        Estamos realizando melhorias para oferecer a melhor experiência.
        <br />
        <span class="text-blue-6">Volte em breve!</span>
      </div>

      <!-- Card de informações -->
      <div class="info-card q-mb-lg">
        <div class="row items-center justify-center q-gutter-md">
          <q-chip color="blue-1" text-color="blue-10" icon="schedule" size="md">
            <strong>Previsão:</strong> 2 horas
          </q-chip>

          <q-chip color="blue-1" text-color="blue-10" icon="update" size="md">
            <strong>Status:</strong> Em andamento
          </q-chip>
        </div>
      </div>

      <!-- Botão principal -->
      <q-btn
        class="q-mt-lg"
        color="blue-10"
        text-color="white"
        unelevated
        @click="refreshPage"
        label="Tentar Novamente"
        no-caps
        size="lg"
        icon="refresh"
        padding="12px 24px"
      >
        <q-tooltip class="bg-blue-10">Atualizar página</q-tooltip>
      </q-btn>

      <!-- Progresso (opcional) -->
      <div class="q-mt-xl" style="max-width: 400px; margin: 0 auto">
        <div class="text-blue-8 q-mb-sm">Progresso da manutenção</div>
        <q-linear-progress
          size="10px"
          :value="0.6"
          color="blue-6"
          track-color="blue-2"
          class="q-mb-sm"
        />
        <div class="text-caption text-blue-6">60% concluído</div>
      </div>

      <!-- Links de suporte -->
      <div class="q-mt-xl">
        <div class="text-blue-7 q-mb-md">Precisa de ajuda imediata?</div>
        <div class="row justify-center q-gutter-md">
          <q-btn
            outline
            color="blue-7"
            label="Status do Sistema"
            @click="showSystemStatus"
            icon="monitoring"
            size="sm"
          />
          <q-btn
            outline
            color="blue-7"
            label="Contato"
            href="mailto:suporte@empresa.com"
            icon="email"
            size="sm"
          />
          <q-btn
            outline
            color="blue-7"
            label="WhatsApp"
            @click="openWhatsApp"
            icon="chat"
            size="sm"
          />
        </div>
      </div>

      <!-- Contador regressivo -->
      <div class="q-mt-lg">
        <div class="text-blue-6 text-caption">
          <q-icon name="access_time" size="sm" class="q-mr-xs" />
          Atualização automática em: <strong>{{ countdown }}</strong> segundos
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const countdown = ref(60);
let countdownInterval: number;

const refreshPage = () => {
  window.location.reload();
};

const showSystemStatus = () => {
  $q.notify({
    message: 'Manutenção programada em andamento',
    caption: 'Sistema voltará em breve',
    color: 'blue-6',
    textColor: 'white',
    icon: 'info',
    timeout: 3000,
    position: 'top',
  });
};

const openWhatsApp = () => {
  window.open(
    'https://wa.me/5511999999999?text=Olá! Estou vendo que o sistema está em manutenção.',
    '_blank',
  );
};

const startCountdown = () => {
  countdownInterval = window.setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--;
    } else {
      countdown.value = 60;
      refreshPage();
    }
  }, 1000);
};

onMounted(() => {
  console.log('Página de manutenção - Tema branco e azul');
  startCountdown();
});

onUnmounted(() => {
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }
});
</script>

<style lang="scss" scoped>
.maintenance-container {
  padding: 3rem 2rem;
  border-radius: 20px;
  background: linear-gradient(135deg, #ffffff 0%, #f8fbff 100%);
  box-shadow:
    0 10px 30px rgba(33, 150, 243, 0.1),
    0 1px 3px rgba(0, 0, 0, 0.05);
  max-width: 900px;
  width: 70%;
  border: none;
}

.info-card {
  padding: 1rem;
  background: rgba(33, 150, 243, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(33, 150, 243, 0.1);
}

.maintenance-image {
  filter: drop-shadow(0 8px 16px rgba(33, 150, 243, 0.2));
  transition: all 0.3s ease;
}

.maintenance-image:hover {
  transform: translateY(-5px);
  filter: drop-shadow(0 12px 24px rgba(33, 150, 243, 0.3));
}

// Animações suaves
@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

.image-container {
  animation: float 3s ease-in-out infinite;
}

// Efeitos de hover nos botões
.q-btn {
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
  }
}

// Responsividade
@media (max-width: 768px) {
  .maintenance-container {
    padding: 2rem 1rem;
    margin: 1rem;
  }

  .text-h3 {
    font-size: 1.75rem;
  }

  .text-h6 {
    font-size: 1rem;
  }

  .maintenance-image {
    max-width: 200px !important;
  }

  .row.justify-center {
    flex-direction: column;
    gap: 0.5rem;
  }
}

@media (max-width: 480px) {
  .maintenance-container {
    padding: 1.5rem 1rem;
  }

  .maintenance-image {
    max-width: 150px !important;
  }

  .info-card .row {
    flex-direction: column;
    gap: 0.5rem;
  }
}

// Efeitos de foco para acessibilidade
.q-btn:focus-visible {
  outline: 2px solid #1976d2;
  outline-offset: 2px;
}

// Modo escuro
.body--dark {
  .maintenance-container {
    background: linear-gradient(135deg, #1e1e1e 0%, #2d3748 100%);
    border-color: rgba(33, 150, 243, 0.2);
  }

  .info-card {
    background: rgba(33, 150, 243, 0.1);
    border-color: rgba(33, 150, 243, 0.2);
  }
}

// Transições suaves
.maintenance-container {
  transition: all 0.3s ease;
}
</style>
