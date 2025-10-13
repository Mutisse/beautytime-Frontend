<template>
  <div class="form-section">
    <h3><i class="fas fa-th-large"></i> Comodidades</h3>
    <p class="form-hint">Selecione as comodidades oferecidas pelo seu salão</p>

    <div class="amenities-grid">
      <div class="amenity-category">
        <h4><i class="fas fa-utensils"></i> Alimentação</h4>
        <div class="amenity-options">
          <div class="amenity-option">
            <input
              type="checkbox"
              id="coffee"
              :checked="modeloAmenidades.includes('coffee')"
              @change="manterMudancaAmenidade('coffee', $event)"
            />
            <label for="coffee">
              <i class="fas fa-coffee"></i>
              <span>Café</span>
            </label>
          </div>
          <div class="amenity-option">
            <input
              type="checkbox"
              id="tea"
              :checked="modeloAmenidades.includes('tea')"
              @change="manterMudancaAmenidade('tea', $event)"
            />
            <label for="tea">
              <i class="fas fa-mug-hot"></i>
              <span>Chá</span>
            </label>
          </div>
          <div class="amenity-option">
            <input
              type="checkbox"
              id="water"
              :checked="modeloAmenidades.includes('water')"
              @change="manterMudancaAmenidade('water', $event)"
            />
            <label for="water">
              <i class="fas fa-glass-whiskey"></i>
              <span>Água</span>
            </label>
          </div>
          <div class="amenity-option">
            <input
              type="checkbox"
              id="snacks"
              :checked="modeloAmenidades.includes('snacks')"
              @change="manterMudancaAmenidade('snacks', $event)"
            />
            <label for="snacks">
              <i class="fas fa-cookie"></i>
              <span>Snacks</span>
            </label>
          </div>
        </div>
      </div>

      <div class="amenity-category">
        <h4><i class="fas fa-parking"></i> Estacionamento</h4>
        <div class="amenity-options">
          <div class="amenity-option">
            <input
              type="checkbox"
              id="free_parking"
              :checked="modeloAmenidades.includes('free_parking')"
              @change="manterMudancaAmenidade('free_parking', $event)"
            />
            <label for="free_parking">
              <i class="fas fa-parking"></i>
              <span>Estacionamento Gratuito</span>
            </label>
          </div>
          <div class="amenity-option">
            <input
              type="checkbox"
              id="paid_parking"
              :checked="modeloAmenidades.includes('paid_parking')"
              @change="manterMudancaAmenidade('paid_parking', $event)"
            />
            <label for="paid_parking">
              <i class="fas fa-money-bill-wave"></i>
              <span>Estacionamento Pago</span>
            </label>
          </div>
          <div class="amenity-option">
            <input
              type="checkbox"
              id="valet"
              :checked="modeloAmenidades.includes('valet')"
              @change="manterMudancaAmenidade('valet', $event)"
            />
            <label for="valet">
              <i class="fas fa-user-tie"></i>
              <span>Manobrista</span>
            </label>
          </div>
        </div>
      </div>

      <div class="amenity-category">
        <h4><i class="fas fa-tv"></i> Entretenimento</h4>
        <div class="amenity-options">
          <div class="amenity-option">
            <input
              type="checkbox"
              id="tv"
              :checked="modeloAmenidades.includes('tv')"
              @change="manterMudancaAmenidade('tv', $event)"
            />
            <label for="tv">
              <i class="fas fa-tv"></i>
              <span>Televisão</span>
            </label>
          </div>
          <div class="amenity-option">
            <input
              type="checkbox"
              id="wifi"
              :checked="modeloAmenidades.includes('wifi')"
              @change="manterMudancaAmenidade('wifi', $event)"
            />
            <label for="wifi">
              <i class="fas fa-wifi"></i>
              <span>Wi-Fi Gratuito</span>
            </label>
          </div>
          <div class="amenity-option">
            <input
              type="checkbox"
              id="magazines"
              :checked="modeloAmenidades.includes('magazines')"
              @change="manterMudancaAmenidade('magazines', $event)"
            />
            <label for="magazines">
              <i class="fas fa-newspaper"></i>
              <span>Revistas</span>
            </label>
          </div>
          <div class="amenity-option">
            <input
              type="checkbox"
              id="music"
              :checked="modeloAmenidades.includes('music')"
              @change="manterMudancaAmenidade('music', $event)"
            />
            <label for="music">
              <i class="fas fa-music"></i>
              <span>Música Ambiente</span>
            </label>
          </div>
        </div>
      </div>

      <div class="amenity-category">
        <h4><i class="fas fa-restroom"></i> Instalações</h4>
        <div class="amenity-options">
          <div class="amenity-option">
            <input
              type="checkbox"
              id="air_conditioning"
              :checked="modeloAmenidades.includes('air_conditioning')"
              @change="manterMudancaAmenidade('air_conditioning', $event)"
            />
            <label for="air_conditioning">
              <i class="fas fa-wind"></i>
              <span>Ar Condicionado</span>
            </label>
          </div>
          <div class="amenity-option">
            <input
              type="checkbox"
              id="heating"
              :checked="modeloAmenidades.includes('heating')"
              @change="manterMudancaAmenidade('heating', $event)"
            />
            <label for="heating">
              <i class="fas fa-temperature-high"></i>
              <span>Aquecedor</span>
            </label>
          </div>
          <div class="amenity-option">
            <input
              type="checkbox"
              id="restroom"
              :checked="modeloAmenidades.includes('restroom')"
              @change="manterMudancaAmenidade('restroom', $event)"
            />
            <label for="restroom">
              <i class="fas fa-restroom"></i>
              <span>Banheiro</span>
            </label>
          </div>
          <div class="amenity-option">
            <input
              type="checkbox"
              id="changing_table"
              :checked="modeloAmenidades.includes('changing_table')"
              @change="manterMudancaAmenidade('changing_table', $event)"
            />
            <label for="changing_table">
              <i class="fas fa-baby"></i>
              <span>Fraldário</span>
            </label>
          </div>
        </div>
      </div>

      <div class="amenity-category">
        <h4><i class="fas fa-wheelchair"></i> Acessibilidade</h4>
        <div class="amenity-options">
          <div class="amenity-option">
            <input
              type="checkbox"
              id="wheelchair_access"
              :checked="modeloAmenidades.includes('wheelchair_access')"
              @change="manterMudancaAmenidade('wheelchair_access', $event)"
            />
            <label for="wheelchair_access">
              <i class="fas fa-wheelchair"></i>
              <span>Acesso para Cadeirantes</span>
            </label>
          </div>
          <div class="amenity-option">
            <input
              type="checkbox"
              id="elevator"
              :checked="modeloAmenidades.includes('elevator')"
              @change="manterMudancaAmenidade('elevator', $event)"
            />
            <label for="elevator">
              <i class="fas fa-elevator"></i>
              <span>Elevador</span>
            </label>
          </div>
          <div class="amenity-option">
            <input
              type="checkbox"
              id="ramp"
              :checked="modeloAmenidades.includes('ramp')"
              @change="manterMudancaAmenidade('ramp', $event)"
            />
            <label for="ramp">
              <i class="fas fa-ramp-loading"></i>
              <span>Rampa de Acesso</span>
            </label>
          </div>
        </div>
      </div>

      <div class="amenity-category">
        <h4><i class="fas fa-shield-alt"></i> Segurança</h4>
        <div class="amenity-options">
          <div class="amenity-option">
            <input
              type="checkbox"
              id="security"
              :checked="modeloAmenidades.includes('security')"
              @change="manterMudancaAmenidade('security', $event)"
            />
            <label for="security">
              <i class="fas fa-shield-alt"></i>
              <span>Segurança</span>
            </label>
          </div>
          <div class="amenity-option">
            <input
              type="checkbox"
              id="cctv"
              :checked="modeloAmenidades.includes('cctv')"
              @change="manterMudancaAmenidade('cctv', $event)"
            />
            <label for="cctv">
              <i class="fas fa-video"></i>
              <span>Circuito Fechado</span>
            </label>
          </div>
          <div class="amenity-option">
            <input
              type="checkbox"
              id="smoke_free"
              :checked="modeloAmenidades.includes('smoke_free')"
              @change="manterMudancaAmenidade('smoke_free', $event)"
            />
            <label for="smoke_free">
              <i class="fas fa-smoking-ban"></i>
              <span>Ambiente Livre de Fumo</span>
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- Preview das comodidades selecionadas -->
    <div v-if="modeloAmenidades.length > 0" class="selected-amenities">
      <h4><i class="fas fa-check-circle"></i> Comodidades Selecionadas</h4>
      <div class="amenities-tags">
        <span v-for="amenity in modeloAmenidades" :key="amenity" class="amenity-tag">
          {{ getAmenityLabel(amenity) }}
          <i class="fas fa-times" @click="removerAmenidade(amenity)"></i>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue';
import type { SalonFormData } from '../../../../types/Salon-Types';

// Dicionário de labels para as amenidades
const amenitiesLabels: Record<string, string> = {
  coffee: 'Café',
  tea: 'Chá',
  water: 'Água',
  snacks: 'Snacks',
  free_parking: 'Estacionamento Gratuito',
  paid_parking: 'Estacionamento Pago',
  valet: 'Manobrista',
  tv: 'Televisão',
  wifi: 'Wi-Fi Gratuito',
  magazines: 'Revistas',
  music: 'Música Ambiente',
  air_conditioning: 'Ar Condicionado',
  heating: 'Aquecedor',
  restroom: 'Banheiro',
  changing_table: 'Fraldário',
  wheelchair_access: 'Acesso para Cadeirantes',
  elevator: 'Elevador',
  ramp: 'Rampa de Acesso',
  security: 'Segurança',
  cctv: 'Circuito Fechado',
  smoke_free: 'Ambiente Livre de Fumo',
};

// Função para obter o label de uma amenidade
const getAmenityLabel = (amenity: string): string => {
  return amenitiesLabels[amenity] || amenity;
};

// Definição das props
interface Props {
  salon: SalonFormData & {
    amenities: string[];
  };
}

// Definição dos eventos
interface Emits {
  (e: 'update:salon', value: SalonFormData): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// Computed property para two-way binding adequado
const modeloAmenidades = computed({
  get: () => props.salon.amenities || [],
  set: (valor: string[]) => {
    emit('update:salon', {
      ...props.salon,
      amenities: valor
    });
  }
});

// Função para lidar com mudanças nas checkboxes
const manterMudancaAmenidade = (amenidade: string, evento: Event) => {
  const alvo = evento.target as HTMLInputElement;
  const amenidadesAtuais = [...modeloAmenidades.value];
  
  if (alvo.checked) {
    // Adiciona amenidade se não existir
    if (!amenidadesAtuais.includes(amenidade)) {
      modeloAmenidades.value = [...amenidadesAtuais, amenidade];
    }
  } else {
    // Remove amenidade
    modeloAmenidades.value = amenidadesAtuais.filter(a => a !== amenidade);
  }
};

// Função para remover amenidade do preview
const removerAmenidade = (amenidade: string) => {
  modeloAmenidades.value = modeloAmenidades.value.filter(a => a !== amenidade);
};
</script>

<style scoped>
.amenities-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-top: 24px;
}

.amenity-category {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #e9ecef;
  transition: all 0.3s ease;
}

.amenity-category:hover {
  border-color: #1976d2;
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.1);
}

.amenity-category h4 {
  color: #1976d2;
  margin-bottom: 16px;
  font-size: 1.1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  border-bottom: 2px solid #e9ecef;
  padding-bottom: 8px;
}

.amenity-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.amenity-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  border-radius: 8px;
  transition: background-color 0.3s ease;
}

.amenity-option:hover {
  background-color: #e3f2fd;
}

.amenity-option input[type='checkbox'] {
  width: 18px;
  height: 18px;
  border: 2px solid #bdbdbd;
  border-radius: 4px;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
}

.amenity-option input[type='checkbox']:checked {
  background-color: #1976d2;
  border-color: #1976d2;
}

.amenity-option input[type='checkbox']:checked::after {
  content: '✓';
  position: absolute;
  color: white;
  font-size: 12px;
  font-weight: bold;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.amenity-option label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-weight: 500;
  color: #424242;
  flex: 1;
}

.amenity-option i {
  width: 20px;
  color: #1976d2;
  font-size: 1rem;
}

.selected-amenities {
  margin-top: 32px;
  padding: 20px;
  background: #e8f5e8;
  border-radius: 12px;
  border-left: 4px solid #4caf50;
}

.selected-amenities h4 {
  color: #2e7d32;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.amenities-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.amenity-tag {
  background: white;
  color: #2e7d32;
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
  border: 1px solid #4caf50;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.amenity-tag:hover {
  background: #4caf50;
  color: white;
  transform: translateY(-1px);
}

.amenity-tag i {
  cursor: pointer;
  font-size: 0.75rem;
  opacity: 0.7;
  transition: opacity 0.3s ease;
}

.amenity-tag i:hover {
  opacity: 1;
}

/* Responsive */
@media (max-width: 768px) {
  .amenities-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .amenity-option {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .amenity-option label {
    width: 100%;
  }
}
</style>