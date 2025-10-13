<template>
  <div class="form-section">
    <h3><i class="fas fa-concierge-bell"></i> Serviços</h3>
    <p class="form-hint">Adicione os serviços oferecidos pelo seu salão</p>

    <div class="services-section">
      <div class="service-list">
        <div
          v-for="(service, index) in salon.services"
          :key="index"
          class="service-item"
          :class="{ 'has-service-error': hasServiceError(index) }"
        >
          <div class="service-form">
            <div class="form-row">
              <div class="form-group" :class="serviceFieldClasses(index, 'name', service.name)">
                <label>Nome do Serviço *</label>
                <input
                  type="text"
                  v-model="service.name"
                  @blur="
                    $emit('validate-service-field', index, 'name', service.name, validateRequired)
                  "
                  placeholder="Ex: Corte de Cabelo"
                />
                <span class="error-message">{{ getServiceError(index, 'name') }}</span>
              </div>
              <div class="form-group" :class="serviceFieldClasses(index, 'price', service.price)">
                <label>Preço (MT) *</label>
                <input
                  type="number"
                  v-model.number="service.price"
                  min="0"
                  step="0.01"
                  @blur="
                    $emit('validate-service-field', index, 'price', service.price, validatePrice)
                  "
                  placeholder="0.00"
                />
                <span class="error-message">{{ getServiceError(index, 'price') }}</span>
              </div>
            </div>

            <div class="form-row">
              <div
                class="form-group"
                :class="serviceFieldClasses(index, 'duration', service.duration)"
              >
                <label>Duração (minutos) *</label>
                <input
                  type="number"
                  v-model.number="service.duration"
                  min="15"
                  step="15"
                  @blur="
                    $emit(
                      'validate-service-field',
                      index,
                      'duration',
                      service.duration,
                      validateDuration,
                    )
                  "
                  placeholder="30"
                />
                <span class="error-message">{{ getServiceError(index, 'duration') }}</span>
              </div>
              <div
                class="form-group"
                :class="serviceFieldClasses(index, 'category', service.category)"
              >
                <label>Categoria *</label>
                <select
                  v-model="service.category"
                  @blur="
                    $emit(
                      'validate-service-field',
                      index,
                      'category',
                      service.category,
                      validateRequired,
                    )
                  "
                >
                  <option value="">Selecione</option>
                  <option value="hair">Cabelo</option>
                  <option value="nails">Unhas</option>
                  <option value="skin">Pele</option>
                  <option value="beard">Barba</option>
                  <option value="massage">Massagem</option>
                  <option value="other">Outro</option>
                </select>
                <span class="error-message">{{ getServiceError(index, 'category') }}</span>
              </div>
            </div>

            <div class="form-group">
              <label>Descrição</label>
              <textarea
                v-model="service.description"
                placeholder="Descreva o serviço..."
                rows="2"
              />
            </div>

            <button
              type="button"
              class="remove-service-btn"
              @click="$emit('remove-service', index)"
              :disabled="salon.services.length === 1"
            >
              <i class="fas fa-trash"></i> Remover
            </button>
          </div>
        </div>
      </div>

      <button type="button" class="add-service-btn" @click="$emit('add-service')">
        <i class="fas fa-plus"></i> Adicionar Serviço
      </button>

      <span v-if="errors.services" class="error-message">
        {{ errors.services }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import type { SalonFormData } from '../../../../types/Salon-Types';

// ✅ CORREÇÃO: Função validateRequired corrigida
const validateRequired = (value: unknown): string | true => {
  if (!value) return 'Este campo é obrigatório';

  // ✅ CORREÇÃO: Verificar tipo antes de converter para string
  const stringValue =
    typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean'
      ? String(value)
      : '';

  if (stringValue.trim() === '') {
    return 'Este campo é obrigatório';
  }

  return true;
};

// ✅ CORREÇÃO: Função validatePrice corrigida
const validatePrice = (value: unknown): string | true => {
  if (!value && value !== 0) return 'Este campo é obrigatório';

  const numValue = Number(value);
  if (isNaN(numValue)) {
    return 'Por favor, insira um preço válido';
  }

  if (numValue < 0) {
    return 'O preço não pode ser negativo';
  }

  return true;
};

// ✅ CORREÇÃO: Função validateDuration corrigida
const validateDuration = (value: unknown): string | true => {
  if (!value) return 'Este campo é obrigatório';

  const numValue = Number(value);
  if (isNaN(numValue)) {
    return 'Por favor, insira uma duração válida';
  }

  if (numValue < 15) {
    return 'A duração mínima é 15 minutos';
  }

  if (numValue % 15 !== 0) {
    return 'A duração deve ser múltipla de 15 minutos';
  }

  return true;
};

// ✅ CORREÇÃO: Função serviceFieldClasses corrigida
const serviceFieldClasses = (
  index: number,
  field: string,
  value: unknown,
): { 'has-error': boolean; 'has-success': boolean } => {
  const hasValue =
    !!value &&
    ((typeof value === 'string' && value.trim() !== '') ||
      (typeof value === 'number' && value !== 0) ||
      typeof value === 'boolean');

  return {
    'has-error': !!getServiceError(index, field),
    'has-success': hasValue && !getServiceError(index, field),
  };
};

interface Props {
  salon: SalonFormData;
  errors: Record<string, string>;
  serviceErrors: Record<string, string>;
}

const props = defineProps<Props>();

const hasServiceError = (index: number): boolean => {
  return Object.keys(props.serviceErrors).some((key) => key.startsWith(`service_${index}_`));
};

const getServiceError = (index: number, field: string): string => {
  return props.serviceErrors[`service_${index}_${field}`] || '';
};

defineEmits(['add-service', 'remove-service', 'validate-service-field']);
</script>

<style scoped>
.services-section {
  margin-top: 24px;
}

.service-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 20px;
}

.service-item {
  padding: 20px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.service-item.has-service-error {
  border-color: #f44336;
  background-color: #ffebee;
}

.service-form {
  position: relative;
}

.remove-service-btn {
  background-color: #ffebee;
  color: #f44336;
  border: 1px solid #f44336;
  border-radius: 6px;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;
}

.remove-service-btn:hover:not(:disabled) {
  background-color: #f44336;
  color: white;
}

.remove-service-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.add-service-btn {
  background-color: #e8f5e8;
  color: #2e7d32;
  border: 2px dashed #4caf50;
  border-radius: 8px;
  padding: 12px 20px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  justify-content: center;
}

.add-service-btn:hover {
  background-color: #c8e6c9;
}

/* Responsive */
@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }

  .service-item {
    padding: 16px;
  }
}
</style>
