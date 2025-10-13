<template>
  <div class="form-navigation">
    <button
      type="button"
      class="nav-btn prev-btn"
      @click="$emit('prev-step')"
      v-if="currentStep > 1"
      :disabled="isSubmitting"
    >
      <i class="fas fa-arrow-left"></i> Voltar
    </button>

    <button
      type="button"
      class="nav-btn next-btn"
      @click="$emit('next-step')"
      v-if="currentStep < 7"
      :disabled="isSubmitting"
    >
      Próximo <i class="fas fa-arrow-right"></i>
    </button>

    <button type="button" class="cancel-btn" @click="$emit('cancel-form')">
      <i class="fas fa-times"></i> Cancelar
    </button>
    <button
      type="button"
      class="submit-btn"
      v-if="currentStep === 7"
      :disabled="isSubmitting"
      @click="$emit('submit-form')"
    >
      <span v-if="!isSubmitting"><i class="fas fa-save"></i> Cadastrar Salão</span>
      <span v-else><i class="fas fa-spinner fa-spin"></i> Processando...</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

interface Props {
  currentStep: number;
  isSubmitting: boolean;
}

defineProps<Props>();

defineEmits(['prev-step', 'next-step', 'cancel-form', 'submit-form']);
</script>



<style scoped>
.form-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 40px;
  padding-top: 24px;
  border-top: 1px solid #e0e0e0;
}

.nav-btn,
.cancel-btn,
.submit-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.prev-btn {
  background-color: #f5f5f5;
  color: #757575;
}

.prev-btn:hover:not(:disabled) {
  background-color: #e0e0e0;
}

.next-btn {
  background-color: #1976d2;
  color: white;
}

.next-btn:hover:not(:disabled) {
  background-color: #1565c0;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.3);
}

.cancel-btn {
  background-color: #ffebee;
  color: #f44336;
}

.cancel-btn:hover {
  background-color: #ffcdd2;
}

.submit-btn {
  background: linear-gradient(135deg, #1976d2, #42a5f5);
  color: white;
  font-weight: 600;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 8px 20px rgba(25, 118, 210, 0.4);
}

/* Responsive */
@media (max-width: 768px) {
  .form-navigation {
    flex-direction: column;
    gap: 12px;
  }

  .form-navigation > * {
    width: 100%;
    justify-content: center;
  }
}
</style>