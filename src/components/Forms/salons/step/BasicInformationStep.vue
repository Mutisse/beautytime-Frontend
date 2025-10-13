<template>
  <div class="form-section">
    <h3><i class="fas fa-info-circle"></i> Informações Básicas</h3>

    <div class="form-group" :class="fieldClasses(errors.nameSalon || '', modeloSalon.nameSalon)">
      <label for="name"><i class="fas fa-signature"></i> Nome do Salão *</label>
      <input
        type="text"
        id="name"
        :value="modeloSalon.nameSalon"
        @input="atualizarCampo('nameSalon', ($event.target as HTMLInputElement).value)"
        @blur="emitirValidacao('nameSalon', modeloSalon.nameSalon, validateNameSalon)"
        placeholder="Ex: Salão Dona Berta"
      />
      <span class="error-message">{{ errors.nameSalon }}</span>
      <i v-if="modeloSalon.nameSalon && !errors.nameSalon" class="fas fa-check success-icon"></i>
    </div>

    <div
      class="form-group"
      :class="fieldClasses(errors.description || '', modeloSalon.description)"
    >
      <label for="description"><i class="fas fa-align-left"></i> Descrição *</label>
      <textarea
        id="description"
        :value="modeloSalon.description"
        @input="atualizarCampo('description', ($event.target as HTMLTextAreaElement).value)"
        @blur="emitirValidacao('description', modeloSalon.description, validateDescription)"
        placeholder="Descreva os serviços oferecidos"
        rows="4"
      />
      <span class="error-message">{{ errors.description }}</span>
      <i
        v-if="modeloSalon.description && !errors.description"
        class="fas fa-check success-icon"
      ></i>
    </div>

    <!-- Categoria e Faixa de Preço na mesma linha -->
    <div class="form-row">
      <div class="form-group" :class="fieldClasses(errors.category || '', modeloSalon.category)">
        <label for="category"><i class="fas fa-tag"></i> Categoria *</label>
        <select
          id="category"
          :value="modeloSalon.category"
          @change="atualizarCampo('category', ($event.target as HTMLSelectElement).value)"
          @blur="emitirValidacao('category', modeloSalon.category, validateRequired)"
        >
          <option value="">Selecione a categoria</option>
          <option value="beauty-salon">Salão de Beleza</option>
          <option value="barber-shop">Barbearia</option>
          <option value="spa">SPA</option>
          <option value="nails">Unhas</option>
          <option value="esthetics">Estética</option>
          <option value="hair">Cabeleireiro</option>
        </select>
        <span class="error-message">{{ errors.category }}</span>
        <i v-if="modeloSalon.category && !errors.category" class="fas fa-check success-icon"></i>
      </div>

      <div
        class="form-group"
        :class="fieldClasses(errors.priceRange || '', modeloSalon.priceRange)"
      >
        <label for="priceRange"><i class="fas fa-money-bill-wave"></i> Faixa de Preço *</label>
        <select
          id="priceRange"
          :value="modeloSalon.priceRange"
          @change="atualizarCampo('priceRange', ($event.target as HTMLSelectElement).value)"
          @blur="emitirValidacao('priceRange', modeloSalon.priceRange, validateRequired)"
        >
          <option value="">Selecione a faixa de preço</option>
          <option value="$">$ - Econômico</option>
          <option value="$$">$$ - Moderado</option>
          <option value="$$$">$$$ - Premium</option>
        </select>
        <span class="error-message">{{ errors.priceRange }}</span>
        <i
          v-if="modeloSalon.priceRange && !errors.priceRange"
          class="fas fa-check success-icon"
        ></i>
      </div>
    </div>

    <!-- Campo para destacar na página principal -->
    <div class="form-group">
      <label><i class="fas fa-star"></i> Destacar na Página Principal</label>
      <div class="toggle-switch">
        <input
          type="checkbox"
          id="featured"
          :checked="modeloSalon.featured"
          @change="atualizarCampo('featured', ($event.target as HTMLInputElement).checked)"
        />
        <label for="featured" class="toggle-label"></label>
        <span>{{ modeloSalon.featured ? 'Sim' : 'Não' }}</span>
      </div>
      <small class="form-hint">Salões destacados aparecem em destaque na página inicial</small>
    </div>

    <div class="form-group">
      <label for="mainImage"><i class="fas fa-image"></i> Imagem do Salão</label>
      <input
        type="text"
        id="mainImage"
        :value="modeloSalon.mainImage"
        @input="atualizarCampo('mainImage', ($event.target as HTMLInputElement).value)"
        placeholder="URL da imagem do salão (opcional)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue';
import type { SalonFormData } from '../../../../types/Salon-Types';
import {
  validateRequired,
  validateNameSalon,
  validateDescription,
  fieldClasses,
} from '../../../../composables/salon-form/useSalonFormUtils';

interface Props {
  salon: SalonFormData & {
    featured: boolean;
    mainImage: string;
  };
  errors: Record<string, string>;
}

interface Emits {
  (e: 'update:salon', value: SalonFormData): void;
  (
    e: 'validate-field',
    field: string,
    value: unknown,
    validator: (value: unknown) => string | true,
  ): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// Computed property para two-way binding adequado
const modeloSalon = computed({
  get: () => props.salon,
  set: (value: SalonFormData) => {
    emit('update:salon', value);
  },
});

// Função para atualizar campos individuais
const atualizarCampo = <K extends keyof SalonFormData>(campo: K, valor: SalonFormData[K]) => {
  modeloSalon.value = {
    ...modeloSalon.value,
    [campo]: valor,
  };
};

// Função para emitir validação
const emitirValidacao = (
  campo: string,
  valor: unknown,
  validador: (value: unknown) => string | true,
) => {
  emit('validate-field', campo, valor, validador);
};
</script>

<style scoped>
.form-section {
  margin-bottom: 30px;
  animation: fadeIn 0.5s ease;
}

.form-section h3 {
  color: #1976d2;
  margin-bottom: 24px;
  font-size: 1.5rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
}

.form-section h3 i {
  font-size: 1.3rem;
}

.form-group {
  margin-bottom: 20px;
  position: relative;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #424242;
  display: flex;
  align-items: center;
  gap: 8px;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
  background-color: white;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #1976d2;
  box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
}

.form-group.has-error input,
.form-group.has-error select,
.form-group.has-error textarea {
  border-color: #f44336;
  box-shadow: 0 0 0 3px rgba(244, 67, 54, 0.1);
}

.form-group.has-success input,
.form-group.has-success select,
.form-group.has-success textarea {
  border-color: #4caf50;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.error-message {
  color: #f44336;
  font-size: 12px;
  margin-top: 6px;
  display: block;
}

.success-icon {
  position: absolute;
  right: 12px;
  top: 38px;
  color: #4caf50;
  font-size: 14px;
}

.toggle-switch {
  display: flex;
  align-items: center;
  gap: 12px;
}

.toggle-switch input {
  display: none;
}

.toggle-label {
  width: 50px;
  height: 26px;
  background-color: #e0e0e0;
  border-radius: 13px;
  position: relative;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.toggle-label::after {
  content: '';
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: white;
  top: 3px;
  left: 3px;
  transition: transform 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.toggle-switch input:checked + .toggle-label {
  background-color: #1976d2;
}

.toggle-switch input:checked + .toggle-label::after {
  transform: translateX(24px);
}

.form-hint {
  color: #757575;
  font-size: 12px;
  margin-top: 6px;
  display: block;
}

/* Responsive */
@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
