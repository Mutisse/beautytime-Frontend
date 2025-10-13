<template>
  <div class="fullscreen bg-blue-1 text-center q-pa-md flex flex-center">
    <div class="error-container">
      <!-- Imagem ilustrativa -->
      <div class="image-container q-mb-lg">
        <q-img
          src="../assets/err/404_Error_rafiki.png"
          alt="Página não encontrada"
          class="error-image"
          style="max-width: 300px; height: auto;"
        >
          <template v-slot:error>
            <div class="flex flex-center column">
              <q-icon name="error_outline" size="xl" color="blue-6" />
              <div class="text-h6 q-mt-md text-blue-8">Imagem não disponível</div>
            </div>
          </template>
        </q-img>
      </div>

      <!-- Mensagem principal -->
      <div class="text-h3 text-blue-8 q-mb-md" style="opacity: 0.8">
        Oops! Página não encontrada...
      </div>

      <!-- Mensagem explicativa -->
      <div class="text-h6 text-blue-7 q-mb-xl" style="opacity: 0.7; max-width: 500px; margin: 0 auto;">
        A página que você está procurando não existe ou foi movida.
        <br>
        Verifique o endereço ou volte para a página inicial.
      </div>

      <!-- Botão de ação -->
      <q-btn
        class="q-mt-lg"
        color="blue-10"
        text-color="white"
        unelevated
        to="/"
        label="Voltar para o Início"
        no-caps
        size="lg"
        icon="home"
      >
        <q-tooltip>Clique para voltar à página inicial</q-tooltip>
      </q-btn>

      <!-- Links adicionais -->
      <div class="q-mt-xl">
        <p class="text-blue-7">Ou tente uma dessas opções:</p>
        <div class="row justify-center q-gutter-sm">
    
          <q-btn
            flat
            color="blue-7"
            label="Suporte Técnico"
            to="/suporte"
            icon="support"
            size="sm"
          />
          <q-btn
            flat
            color="blue-7"
            label="Contato"
            to="/about"
            icon="email"
            size="sm"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';

onMounted(() => {
  console.log('Página 404 - Página não encontrada');
});
</script>

<style lang="scss" scoped>
.error-container {
  padding: 2rem;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.error-code {
  font-family: 'Arial', sans-serif;
  text-shadow: 4px 4px 0px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
}

.error-image {
  filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.2));
  transition: transform 0.3s ease;
}

.error-image:hover {
  transform: scale(1.05) rotate(5deg);
}

// Animações suaves
.error-code {
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.9;
    transform: scale(1.02);
  }
}

// Responsividade
@media (max-width: 768px) {
  .error-code {
    font-size: 15vh;
  }
  
  .text-h3 {
    font-size: 1.5rem;
  }
  
  .text-h6 {
    font-size: 1rem;
  }
  
  .error-image {
    max-width: 200px !important;
  }
}

@media (max-width: 480px) {
  .error-code {
    font-size: 10vh;
  }
  
  .error-container {
    padding: 1rem;
    margin: 1rem;
  }
  
  .error-image {
    max-width: 150px !important;
  }
  
  .row.justify-center {
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
  .error-container {
    background: rgba(33, 33, 33, 0.95);
  }
  
  .error-code {
    color: #90caf9 !important;
  }
  
  .text-h3 {
    color: #e3f2fd !important;
  }
  
  .text-h6 {
    color: #bbdefb !important;
  }
}
</style>