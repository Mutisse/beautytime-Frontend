<template>
  <q-layout view="hHh Lpr lFf">
    <q-page-container>
      <q-page class="conta-pendente-container flex flex-center">
        <q-card class="card">
          <div class="imagem-container">
            <q-img
              src="https://img.freepik.com/premium-vector/error-403-character-illustration_854078-606.jpg?w=740"
              alt="Verificação de Email"
              class="imagem-verificacao"
            >
              <template v-slot:error>
                <div class="flex flex-center column text-primary">
                  <q-icon name="email" size="xl" />
                  <div class="text-h6 q-mt-md">Verificação de Email</div>
                </div>
              </template>
            </q-img>
          </div>

          <h1 class="titulo-pendente text-h4">Conta Pendente de Verificação</h1>

          <p class="instrucoes">
            Enviamos um link de verificação para <strong>{{ authStore.user?.email }}</strong
            >. Por favor, verifique sua caixa de entrada e clique no link para ativar sua conta.
          </p>

          <div class="acoes">
            <p class="sem-email text-grey-7" v-if="tempoRestante > 0">
              Você pode solicitar um novo email em {{ formatarTempo(tempoRestante) }}
            </p>

            <q-btn
              @click="reenviarVerificacao"
              :disabled="estaEnviando || tempoRestante > 0"
              class="botao-reenviar"
              color="primary"
            >
              <span v-if="!estaEnviando">Reenviar email</span>
              <span v-else class="carregando">
                <q-spinner class="q-mr-sm" />
                Enviando...
              </span>
            </q-btn>
          </div>

          <p class="texto-pequeno">
            Não recebeu o email? Verifique sua pasta de spam ou
            <q-btn
              flat
              color="primary"
              label="solicite um novo link"
              @click="reenviarVerificacao"
            />
          </p>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useAuthStore } from '../../stores/auth-store';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const authStore = useAuthStore();
const estaEnviando = ref(false);
const tempoRestante = ref(0);
const intervalo = ref<number | null>(null);

const TEMPO_ESPERA = 60; // 60 segundos

const formatarTempo = (segundos: number): string => {
  const mins = Math.floor(segundos / 60);
  const secs = segundos % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

const reenviarVerificacao = async (): Promise<void> => {
  try {
    estaEnviando.value = true;
    // Simula o reenvio de email (substitua pela sua implementação real)
    await new Promise((resolve) => setTimeout(resolve, 1500));
    $q.notify({
      type: 'positive',
      message: 'Email de verificação reenviado com sucesso!',
    });
    iniciarContador();
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Falha ao reenviar email de verificação';
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

onMounted(() => {
  iniciarContador();
});

onUnmounted(() => {
  limparIntervalo();
});
</script>

<style lang="scss" scoped>
.conta-pendente-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 2rem;
}

.card {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 1000px;
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

.imagem-verificacao {
  width: 200px;
  height: auto;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-15px);
  }
}

.titulo-pendente {
  color: #2c3e50;
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

.sem-email {
  margin-bottom: 0;
  font-size: 0.95rem;
}

.botao-reenviar {
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);
  width: 100%;
  max-width: 250px;
}

.botao-reenviar:hover:not(:disabled) {
  background: #2980b9;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(52, 152, 219, 0.4);
}

.botao-reenviar:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
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
  .conta-pendente-container {
    padding: 1rem;
  }

  .card {
    padding: 2rem 1.5rem;
  }

  .titulo-pendente {
    font-size: 1.5rem;
  }

  .imagem-verificacao {
    width: 150px;
  }

  .botao-reenviar {
    padding: 10px 20px;
    max-width: 100%;
  }
}

@media (max-width: 480px) {
  .card {
    padding: 1.5rem 1rem;
  }

  .titulo-pendente {
    font-size: 1.25rem;
  }

  .instrucoes {
    font-size: 1rem;
  }

  .imagem-verificacao {
    width: 120px;
  }
}
</style>
