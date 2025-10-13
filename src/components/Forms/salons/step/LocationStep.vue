<template>
  <div class="form-section">
    <h3><i class="fas fa-map-marker-alt"></i> Localização</h3>

    <!-- Pesquisa de Localização -->
    <div class="location-search">
      <div class="form-group">
        <label for="locationSearch"><i class="fas fa-search"></i> Pesquisar Localização</label>
        <div class="search-input-container">
          <input
            type="text"
            id="locationSearch"
            :value="locationSearch"
            @input="atualizarPesquisaLocalizacao(($event.target as HTMLInputElement).value)"
            @keyup.enter="pesquisarLocalizacao"
            placeholder="Digite um endereço, cidade ou ponto de referência..."
            :disabled="mapLoading"
          />
          <button
            type="button"
            class="search-btn"
            @click="pesquisarLocalizacao"
            :disabled="mapLoading || !locationSearch.trim()"
          >
            <i class="fas fa-search"></i>
          </button>
        </div>
        <small class="form-hint">Ex: Av. 24 de Julho, Maputo ou Alto Maé, Matola</small>
      </div>
    </div>

    <!-- Mapa Interativo -->
    <div class="map-section">
      <div class="map-instructions">
        <p>
          <i class="fas fa-info-circle"></i> Clique no mapa para selecionar a localização do seu
          salão ou use a pesquisa acima
        </p>
      </div>

      <div class="map-container">
        <div id="location-map" ref="mapContainer" class="map"></div>
        <div v-if="mapLoading" class="map-loading">
          <i class="fas fa-spinner fa-spin"></i> Carregando mapa...
        </div>
      </div>

      <div class="selected-location-info" v-if="selectedLocation">
        <div class="location-coordinates">
          <h4><i class="fas fa-map-pin"></i> Localização Selecionada</h4>

          <div class="form-row">
            <div
              class="form-group"
              :class="fieldClasses(errors.latitude || '', modeloSalon.latitude)"
            >
              <label for="latitude"><i class="fas fa-globe"></i> Latitude *</label>
              <input
                type="number"
                id="latitude"
                :value="modeloSalon.latitude"
                @input="
                  atualizarCampo(
                    'latitude',
                    parseFloat(($event.target as HTMLInputElement).value) || 0,
                  )
                "
                step="any"
                readonly
                placeholder="Selecione no mapa"
              />
              <span class="error-message">{{ errors.latitude }}</span>
            </div>

            <div
              class="form-group"
              :class="fieldClasses(errors.longitude || '', modeloSalon.longitude)"
            >
              <label for="longitude"><i class="fas fa-globe"></i> Longitude *</label>
              <input
                type="number"
                id="longitude"
                :value="modeloSalon.longitude"
                @input="
                  atualizarCampo(
                    'longitude',
                    parseFloat(($event.target as HTMLInputElement).value) || 0,
                  )
                "
                step="any"
                readonly
                placeholder="Selecione no mapa"
              />
              <span class="error-message">{{ errors.longitude }}</span>
            </div>
          </div>

          <!-- Informações detalhadas da localização -->
          <div class="location-details">
            <div class="form-group">
              <label><i class="fas fa-road"></i> Rua</label>
              <input type="text" :value="locationDetails.street" readonly />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label><i class="fas fa-city"></i> Bairro</label>
                <input type="text" :value="locationDetails.suburb" readonly />
              </div>

              <div class="form-group">
                <label><i class="fas fa-building"></i> Cidade</label>
                <input type="text" :value="locationDetails.city" readonly />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label><i class="fas fa-flag"></i> Estado/Província</label>
                <input type="text" :value="locationDetails.state" readonly />
              </div>

              <div class="form-group">
                <label><i class="fas fa-globe-americas"></i> País</label>
                <input type="text" :value="locationDetails.country" readonly />
              </div>
            </div>

            <div class="form-group">
              <label><i class="fas fa-envelope"></i> Código Postal</label>
              <input type="text" :value="locationDetails.postcode" readonly />
            </div>
          </div>

          <!-- Endereço completo editável -->
          <div class="form-group" :class="fieldClasses(errors.address || '', modeloSalon.address)">
            <label for="address"><i class="fas fa-map-marked-alt"></i> Endereço Completo *</label>
            <input
              type="text"
              id="address"
              :value="modeloSalon.address"
              @input="atualizarCampo('address', ($event.target as HTMLInputElement).value)"
              @blur="emitirValidacao('address', modeloSalon.address, validateRequired)"
              placeholder="Endereço completo será preenchido automaticamente"
            />
            <span class="error-message">{{ errors.address }}</span>
            <i v-if="modeloSalon.address && !errors.address" class="fas fa-check success-icon"></i>
          </div>

          <div class="form-row">
            <div
              class="form-group"
              :class="fieldClasses(errors.neighborhood || '', modeloSalon.neighborhood)"
            >
              <label for="neighborhood"><i class="fas fa-map-marker-alt"></i> Bairro *</label>
              <input
                type="text"
                id="neighborhood"
                :value="modeloSalon.neighborhood"
                @input="atualizarCampo('neighborhood', ($event.target as HTMLInputElement).value)"
                @blur="emitirValidacao('neighborhood', modeloSalon.neighborhood, validateRequired)"
                placeholder="Ex: Alto Maé, Central, etc."
              />
              <span class="error-message">{{ errors.neighborhood }}</span>
              <i
                v-if="modeloSalon.neighborhood && !errors.neighborhood"
                class="fas fa-check success-icon"
              ></i>
            </div>

            <div
              class="form-group"
              :class="fieldClasses(errors.province || '', modeloSalon.province)"
            >
              <label for="province"><i class="fas fa-map"></i> Província *</label>
              <select
                id="province"
                :value="modeloSalon.province"
                @change="atualizarCampo('province', ($event.target as HTMLSelectElement).value)"
                @blur="emitirValidacao('province', modeloSalon.province, validateRequired)"
              >
                <option value="">Selecione a província</option>
                <option value="maputo_cidade">Cidade de Maputo</option>
                <option value="maputo_provincia">Maputo Província</option>
                <option value="gaza">Gaza</option>
                <option value="inhambane">Inhambane</option>
                <option value="sofala">Sofala</option>
                <option value="manica">Manica</option>
                <option value="tete">Tete</option>
                <option value="zambezia">Zambézia</option>
                <option value="nampula">Nampula</option>
                <option value="cabo_delgado">Cabo Delgado</option>
                <option value="niassa">Niassa</option>
              </select>
              <span class="error-message">{{ errors.province }}</span>
              <i
                v-if="modeloSalon.province && !errors.province"
                class="fas fa-check success-icon"
              ></i>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="community"><i class="fas fa-users"></i> Comunidade/Localidade</label>
              <input
                type="text"
                id="community"
                :value="modeloSalon.community"
                @input="atualizarCampo('community', ($event.target as HTMLInputElement).value)"
                placeholder="Ex: 3 de Fevereiro, Zimpeto, etc."
              />
            </div>

            <div class="form-group">
              <label for="zipCode"><i class="fas fa-envelope"></i> Código Postal</label>
              <input
                type="text"
                id="zipCode"
                :value="modeloSalon.zipCode"
                @input="atualizarCampo('zipCode', ($event.target as HTMLInputElement).value)"
                placeholder="Ex: 1100-123"
                pattern="\d{4}-\d{3}"
              />
              <small class="form-hint">Formato: XXXX-XXX (ex: 1100-123)</small>
            </div>
          </div>
        </div>

        <div class="location-actions">
          <button
            type="button"
            class="btn-locate-me"
            @click="usarMinhaLocalizacao"
            :disabled="mapLoading"
          >
            <i class="fas fa-location-arrow"></i>
            {{ mapLoading ? 'Carregando...' : 'Usar minha localização atual' }}
          </button>
          <button
            type="button"
            class="btn-clear-location"
            @click="limparLocalizacao"
            v-if="selectedLocation"
          >
            <i class="fas fa-times"></i> Limpar seleção
          </button>
        </div>
      </div>

      <div v-else class="no-location-selected">
        <div class="empty-state">
          <i class="fas fa-map-marker-alt"></i>
          <h4>Nenhuma localização selecionada</h4>
          <p>
            Use a pesquisa, clique no mapa ou use sua localização atual para selecionar uma
            localização.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, onMounted, onUnmounted, computed } from 'vue';
import type { SalonFormData } from '../../../../types/Salon-Types';
import { useSalonMap } from '../../../../composables/salon-form/useSalonMap';

// Refs
const mapContainer = ref<HTMLElement>();

// Props
interface LocationDetails {
  street: string;
  suburb: string;
  city: string;
  state: string;
  country: string;
  postcode: string;
}

interface Props {
  salon: SalonFormData & {
    neighborhood: string;
    province: string;
    community: string;
    zipCode: string;
  };
  errors: Record<string, string>;
  locationDetails: LocationDetails;
  locationSearch: string;
  mapLoading: boolean;
  selectedLocation: boolean;
}

interface Emits {
  (e: 'update:salon', value: SalonFormData): void;
  (
    e: 'validate-field',
    field: string,
    value: unknown,
    validator: (value: unknown) => string | true,
  ): void;
  (e: 'search-location'): void;
  (e: 'locate-me'): void;
  (e: 'clear-location'): void;
  (e: 'update-location-search', value: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// Computed property para two-way binding adequado
const modeloSalon = computed({
  get: () => props.salon,
  set: (valor: SalonFormData) => {
    emit('update:salon', valor);
  },
});

// Função para validar campo obrigatório
const validateRequired = (valor: unknown): string | true => {
  if (valor === null || valor === undefined || valor === '') {
    return 'Este campo é obrigatório';
  }

  if (typeof valor === 'string' && valor.trim() === '') {
    return 'Este campo é obrigatório';
  }

  return true;
};

// Classes para campos com erro/sucesso
const fieldClasses = (
  erro: string,
  valor: unknown,
): { 'has-error': boolean; 'has-success': boolean } => ({
  'has-error': !!erro,
  'has-success': !!valor && !erro,
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

// Funções para emitir eventos
const atualizarPesquisaLocalizacao = (valor: string) => {
  emit('update-location-search', valor);
};

const pesquisarLocalizacao = () => {
  emit('search-location');
};

const usarMinhaLocalizacao = () => {
  emit('locate-me');
};

const limparLocalizacao = () => {
  emit('clear-location');
};

// Composable
const { initMap, addMapClickListener, destroyMap } = useSalonMap();

// Lifecycle
// ✅ CORREÇÃO: A função addMapClickListener agora só aceita 1 argumento
onMounted(async () => {
  if (mapContainer.value) {
    await initMap(mapContainer.value);
    // ✅ CHAMADA CORRETA: apenas 1 argumento
    addMapClickListener(modeloSalon.value);
  }
});

onUnmounted(() => {
  destroyMap();
});

// Expor validações para template
defineExpose({
  validateRequired,
  fieldClasses,
});
</script>

<style scoped>
.location-search {
  margin-bottom: 24px;
}

.search-input-container {
  display: flex;
  gap: 8px;
  align-items: stretch;
}

.search-input-container input {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.3s ease;
}

.search-input-container input:focus {
  border-color: #1976d2;
  outline: none;
}

.search-input-container input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.search-btn {
  background-color: #1976d2;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 50px;
}

.search-btn:hover:not(:disabled) {
  background-color: #1565c0;
  transform: translateY(-1px);
}

.search-btn:disabled {
  background-color: #bdbdbd;
  cursor: not-allowed;
  transform: none;
}

.form-hint {
  color: #666;
  font-size: 12px;
  margin-top: 4px;
  display: block;
}

.map-section {
  margin-top: 24px;
}

.map-instructions {
  background-color: #e3f2fd;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  border-left: 4px solid #1976d2;
}

.map-instructions p {
  margin: 0;
  color: #1976d2;
  font-size: 14px;
}

.map-container {
  position: relative;
  height: 400px;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid #e0e0e0;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.map {
  width: 100%;
  height: 100%;
}

.map-loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1976d2;
  font-weight: 500;
  font-size: 16px;
  z-index: 1000;
}

.map-loading i {
  margin-right: 8px;
}

.selected-location-info {
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #e9ecef;
  margin-top: 20px;
}

.location-coordinates h4 {
  margin: 0 0 16px 0;
  color: #1976d2;
  display: flex;
  align-items: center;
  gap: 8px;
}

.location-details {
  margin: 20px 0;
  padding: 16px;
  background-color: white;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.location-details .form-group {
  margin-bottom: 12px;
}

.location-details label {
  font-weight: 500;
  color: #555;
}

.location-details input {
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  color: #333;
  display: flex;
  align-items: center;
  gap: 6px;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #1976d2;
  outline: none;
  box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
}

.form-group input:read-only {
  background-color: #f5f5f5;
  cursor: not-allowed;
  color: #666;
}

.form-group.has-error input,
.form-group.has-error select {
  border-color: #f44336;
}

.form-group.has-success input,
.form-group.has-success select {
  border-color: #4caf50;
}

.error-message {
  color: #f44336;
  font-size: 12px;
  margin-top: 4px;
  display: block;
}

.success-icon {
  color: #4caf50;
  margin-left: 8px;
}

.location-actions {
  display: flex;
  gap: 12px;
  margin-top: 20px;
  flex-wrap: wrap;
}

.btn-locate-me,
.btn-clear-location {
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 200px;
  justify-content: center;
}

.btn-locate-me {
  background-color: #e3f2fd;
  color: #1976d2;
  border: 2px solid #1976d2;
}

.btn-locate-me:hover:not(:disabled) {
  background-color: #1976d2;
  color: white;
  transform: translateY(-1px);
}

.btn-locate-me:disabled {
  background-color: #f5f5f5;
  color: #bdbdbd;
  border-color: #e0e0e0;
  cursor: not-allowed;
  transform: none;
}

.btn-clear-location {
  background-color: #ffebee;
  color: #f44336;
  border: 2px solid #f44336;
}

.btn-clear-location:hover {
  background-color: #f44336;
  color: white;
  transform: translateY(-1px);
}

.no-location-selected {
  text-align: center;
  padding: 40px 20px;
}

.empty-state {
  color: #666;
}

.empty-state i {
  font-size: 48px;
  color: #bdbdbd;
  margin-bottom: 16px;
}

.empty-state h4 {
  margin: 0 0 8px 0;
  color: #333;
}

.empty-state p {
  margin: 0;
  color: #666;
}

/* Custom Marker for MapLibre */
:deep(.maplibregl-marker) {
  cursor: pointer;
}

:deep(.maplibregl-popup) {
  max-width: 300px;
}

:deep(.maplibregl-popup-content) {
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Responsive */
@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }

  .location-actions {
    flex-direction: column;
  }

  .btn-locate-me,
  .btn-clear-location {
    min-width: auto;
  }

  .map-container {
    height: 300px;
  }

  .search-input-container {
    flex-direction: column;
  }

  .search-btn {
    padding: 12px;
  }
}

@media (max-width: 480px) {
  .map-container {
    height: 250px;
  }

  .selected-location-info {
    padding: 16px;
  }

  .location-details {
    padding: 12px;
  }
}
</style>
