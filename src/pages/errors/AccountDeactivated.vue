<template>
  <q-layout view="hHh Lpr lFf">
    <q-page-container>
      <q-page class="conta-desativada-container flex flex-center">
        <q-card class="card">
          <div class="imagem-container">
            <q-img
              src="../../assets/err/Computer_troubleshooting_pana.png"
              alt="Conta Desativada"
              class="imagem-desativada"
            >
              <template v-slot:error>
                <div class="flex flex-center column text-negative">
                  <q-icon name="block" size="xl" />
                  <div class="text-h6 q-mt-md">Conta Desativada</div>
                </div>
              </template>
            </q-img>
          </div>

          <h1 class="titulo-desativada text-h4">Conta Desativada</h1>

          <p class="instrucoes">
            Sua conta <strong>{{ authStore.user?.email }}</strong> está atualmente desativada. Entre
            em contato com o suporte para reativar sua conta.
          </p>

          <div class="acoes">
            <q-btn
              @click="solicitarReativacao"
              :disabled="estaEnviando || tempoRestante > 0"
              class="botao-reativacao"
              color="negative"
            >
              <span v-if="!estaEnviando">Solicitar Reativação</span>
              <span v-else class="carregando">
                <q-spinner class="q-mr-sm" />
                Enviando solicitação...
              </span>
            </q-btn>

            <p class="tempo-restante text-negative" v-if="tempoRestante > 0">
              Você pode solicitar novamente em {{ formatarTempo(tempoRestante) }}
            </p>
          </div>

          <p class="texto-pequeno">
            Precisa de ajuda?
            <q-btn flat color="negative" label="Contate nosso suporte" to="/suporte" />
          </p>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue';
import { useAuthStore } from '../../stores/auth-store';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const authStore = useAuthStore();
const estaEnviando = ref(false);
const tempoRestante = ref(0);
const intervalo = ref<number | null>(null);

const TEMPO_ESPERA = 120; // 120 segundos (2 minutos)

const formatarTempo = (segundos: number): string => {
  const mins = Math.floor(segundos / 60);
  const secs = segundos % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

const solicitarReativacao = async (): Promise<void> => {
  try {
    estaEnviando.value = true;
    // Simula chamada à API para solicitar reativação
    await new Promise((resolve) => setTimeout(resolve, 1500));
    $q.notify({
      type: 'positive',
      message: 'Solicitação de reativação enviada com sucesso!',
    });
    iniciarContador();
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Falha ao enviar solicitação de reativação';
    $q.notify({
      type: 'negative',
      message: errorMessage,
    });
  } finally {
    estaEnviando.value = false;
  }
};

const iniciarContador = (): void => {
  tempoRestante.value = TEMPO_ESPERA;
  intervalo.value = window.setInterval(() => {
    tempoRestante.value--;
    if (tempoRestante.value <= 0 && intervalo.value) {
      clearInterval(intervalo.value);
    }
  }, 1000);
};

const limparIntervalo = (): void => {
  if (intervalo.value) {
    clearInterval(intervalo.value);
    intervalo.value = null;
  }
};

onUnmounted(() => {
  limparIntervalo();
});
</script>

<style lang="scss" scoped>
.conta-desativada-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #fff5f5 0%, #ffd3d3 100%);
  padding: 2rem;
}

.card {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 900px;
  width: 100%;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  padding: 3rem;
  text-align: center;
  transition: all 0.3s ease;
}

.imagem-container {
  margin-bottom: 2rem;
}

.imagem-desativada {
  width: 200px;
  height: auto;
  opacity: 0.8;
}

.titulo-desativada {
  color: #e74c3c;
  margin-bottom: 1.5rem;
  font-weight: 700;
}

.instrucoes {
  color: #7f8c8d;
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.acoes {
  margin: 1.5rem 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.botao-reativacao {
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(231, 76, 60, 0.3);
  width: 100%;
  max-width: 250px;
}

.botao-reativacao:hover:not(:disabled) {
  background: #c0392b;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(231, 76, 60, 0.4);
}

.botao-reativacao:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.tempo-restante {
  font-size: 0.9rem;
  font-weight: 500;
}

.carregando {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.texto-pequeno {
  font-size: 0.9rem;
  margin-top: 1rem;
  color: #666;
}

@media (max-width: 768px) {
  .conta-desativada-container {
    padding: 1rem;
  }

  .card {
    padding: 2rem 1.5rem;
  }

  .titulo-desativada {
    font-size: 1.5rem;
  }

  .imagem-desativada {
    width: 150px;
  }

  .botao-reativacao {
    padding: 10px 20px;
    max-width: 100%;
  }
}

@media (max-width: 480px) {
  .card {
    padding: 1.5rem 1rem;
  }

  .titulo-desativada {
    font-size: 1.25rem;
  }

  .instrucoes {
    font-size: 1rem;
  }

  .imagem-desativada {
    width: 120px;
  }
}
</style>
