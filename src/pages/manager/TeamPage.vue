<template>
  <div class="development-placeholder">
    <q-icon name="construction" size="xl" />
    <h3>Página em Desenvolvimento</h3>
    <p>Esta funcionalidade estará disponível em breve</p>
    
    <!-- Botão para voltar -->
    <q-btn
      color="primary"
      icon="arrow_back"
      label="Voltar"
      @click="goBack"
      class="q-mt-md"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'DevelopmentPlaceholder',
  
  setup() {
    const router = useRouter();

    const goBack = () => {
      // Tenta voltar na história, se não conseguir vai para o dashboard
      if (window.history.length > 1) {
        router.go(-1);
      }
    };

    return {
      goBack
    };
  }
});
</script>

<style scoped>
.development-placeholder {
  text-align: center;
  padding: 2rem;
  color: #666;
  min-height: 50vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>