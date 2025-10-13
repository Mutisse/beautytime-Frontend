<template>
  <div class="salon-container">
    <!-- Header -->
    <div class="header q-mb-md">
      <q-btn icon="arrow_back" flat round dense @click="goBack" />
      <h2 class="text-h4 text-weight-bold">Encontrar Salões</h2>
    </div>

    <!-- Mapa e lista -->
    <div class="main-content">
      <div class="row q-col-gutter-md">
        <!-- Mapa -->
        <div class="col-12 col-md-8">
          <div class="map-wrapper">
            <div ref="mapContainer" class="map-container"></div>

            <!-- Legenda -->
            <div class="map-legend">
              <div class="legend-item">
                <div class="legend-color user-marker"></div>
                <span>Você está aqui</span>
              </div>
              <div class="legend-item">
                <div class="legend-color salon-marker"></div>
                <span>Salões</span>
              </div>
              <div class="legend-item" v-if="currentRoute">
                <div class="legend-color route-line"></div>
                <span>Rota traçada</span>
              </div>
            </div>

            <!-- Controles -->
            <div class="map-controls">
              <q-btn
                icon="my_location"
                color="primary"
                round
                dense
                @click="locateUser"
                class="q-mr-sm"
              />
              <q-btn
                v-if="currentRoute"
                icon="clear"
                label="Limpar Rota"
                color="negative"
                dense
                @click="clearRoute"
              />
            </div>

            <!-- Loading -->
            <q-inner-loading :showing="isCalculatingRoute">
              <q-spinner-gears size="50px" color="primary" />
              <p class="q-mt-md">Calculando rota...</p>
            </q-inner-loading>
          </div>
        </div>

        <!-- Lista de salões -->
        <div class="col-12 col-md-4">
          <div class="salons-list">
            <div class="list-header">
              <h3 class="q-mb-none">{{ salonsData.length }} Salões Próximos</h3>
              <q-badge color="primary"> {{ salonsData.length }} encontrados </q-badge>
            </div>

            <q-scroll-area class="scroll-area">
              <div v-if="salonsData.length === 0" class="no-results">
                <q-icon name="search_off" size="xl" color="grey-5" />
                <p class="q-mt-md text-grey-7">Nenhum salão encontrado</p>
              </div>

              <div v-else class="salons-grid">
                <q-card
                  v-for="salon in salonsData"
                  :key="salon.salonId"
                  class="salon-card q-mb-sm"
                  :class="{ 'active-route': currentRouteSalon === salon.salonId }"
                >
                  <q-card-section class="salon-header">
                    <div class="salon-avatar">
                      <q-icon name="content_cut" size="24px" color="primary" />
                    </div>
                    <div class="salon-info">
                      <h4 class="salon-name">{{ salon.salonName }}</h4>
                      <div class="salon-meta">
                        <q-rating
                          :model-value="salon.salonRating || 4.5"
                          :max="5"
                          size="16px"
                          color="amber"
                          readonly
                        />
                        <span class="rating-text">{{
                          salon.salonRating?.toFixed(1) || '4.5'
                        }}</span>
                        <q-badge v-if="salon.isOpen !== false" color="positive" class="q-ml-sm">
                          ABERTO
                        </q-badge>
                      </div>
                    </div>
                  </q-card-section>

                  <q-card-section class="salon-details">
                    <div class="detail-item">
                      <q-icon name="place" size="16px" class="q-mr-xs text-primary" />
                      <span class="detail-text">{{ salon.salonAddress }}</span>
                    </div>

                    <div class="detail-item">
                      <q-icon name="directions_walk" size="16px" class="q-mr-xs text-green" />
                      <span class="detail-text distance">
                        {{ formatDistance(salon.salonDistance) }} de distância
                      </span>
                    </div>

                    <div class="detail-item" v-if="salon.salonServices?.length">
                      <q-icon name="style" size="16px" class="q-mr-xs text-orange" />
                      <span class="detail-text"> {{ salon.salonServices.length }} serviços </span>
                    </div>
                  </q-card-section>

                  <q-card-actions class="salon-actions">
                    <q-btn
                      icon="directions"
                      label="Traçar Rota"
                      color="primary"
                      dense
                      no-caps
                      @click="drawRouteToSalon(salon)"
                    />
                    <q-space />
                    <q-btn
                      label="Detalhes"
                      color="secondary"
                      outline
                      dense
                      no-caps
                      @click="openSalonDetails(salon)"
                    />
                  </q-card-actions>

                  <!-- Rota ativa -->
                  <div
                    v-if="currentRouteSalon === salon.salonId && routeDistance"
                    class="route-info"
                  >
                    <div class="route-details">
                      <q-icon name="route" size="16px" />
                      <span>{{ formatDistance(routeDistance) }} • {{ routeTime }}</span>
                    </div>
                  </div>
                </q-card>
              </div>
            </q-scroll-area>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useSalonMap } from '../../../composables/salon-form/useSalonMap';
import type { ProcessedSalon, LocationCoordinates } from '../../../types/Salon-Types';

// Props
interface Props {
  salonsData: ProcessedSalon[];
  userCoords: LocationCoordinates | null;
}

const props = defineProps<Props>();
const router = useRouter();
const $q = useQuasar();

// Referências
const mapContainer = ref<HTMLElement | null>(null);

// Estado local
const isCalculatingRoute = ref(false);
const currentRouteSalon = ref<string | null>(null);
const routeDistance = ref<number>(0);
const routeTime = ref<string>('');
const currentRoute = ref<boolean>(false);

// ✅ USAR useSalonMap COM TYPE ASSERTION PARA EVITAR PROBLEMAS
const salonMap = useSalonMap();

// ✅ DESTRUCTURING COM TIPOS EXPLÍCITOS
const {
  markers,
  initMap,
  addColoredMarker,
  clearAllMarkers,
  calculateRoute,
  removeRoute,
  destroyMap,
  drawRoute,
  getMarkerData,
  getMarkerLngLat,
} = salonMap;

// ✅ INICIALIZAR MAPA
// ✅ CORREÇÃO 1: Remover 'interactive'
const initializeMap = async (): Promise<void> => {
  if (!mapContainer.value) return;

  // ✅ APENAS 1 ARGUMENTO
  await initMap(mapContainer.value);

  if (props.userCoords) {
    addUserMarker(props.userCoords);
  }

  if (props.salonsData.length > 0) {
    addSalonsToMap(props.salonsData);
  }
};

// ✅ ADICIONAR MARCADOR DO USUÁRIO
const addUserMarker = (userCoords: LocationCoordinates): void => {
  const coords: [number, number] = [userCoords.latitude, userCoords.longitude];

  addColoredMarker({
    id: 'user-location',
    lnglat: coords,
    color: 'blue',
    title: 'Sua Localização',
    type: 'user',
    data: {
      id: 'user-location',
      name: 'Você está aqui',
      address: 'Sua localização atual',
    },
  });
};

// ✅ ADICIONAR SALÕES AO MAPA
const addSalonsToMap = (salons: ProcessedSalon[]): void => {
  clearAllMarkers();

  salons.forEach((salon) => {
    addColoredMarker({
      id: salon.salonId,
      lnglat: [salon.salonLatitude, salon.salonLongitude],
      color: 'red',
      title: salon.salonName,
      type: 'salon',
      data: {
        id: salon.salonId,
        name: salon.salonName,
        address: salon.salonAddress,
        rating: salon.salonRating,
        priceRange: salon.salonPriceRange,
      },
    });
  });
};

// ✅ TRAÇAR ROTA PARA SALÃO - VERSÃO CORRIGIDA COM TIPOS
// ✅ CORREÇÃO 2: Remover referência a 'L'
const drawRouteToSalon = async (salon: ProcessedSalon): Promise<void> => {
  // ✅ USE markers.value diretamente SEM 'L.Marker'
  const userMarker = markers.value.find((marker) => getMarkerData(marker)?.id === 'user-location');

  if (!userMarker) {
    $q.notify({
      message: 'Ative sua localização primeiro',
      icon: 'warning',
      color: 'warning',
    });
    return;
  }

  isCalculatingRoute.value = true;
  currentRouteSalon.value = salon.salonId;

  try {
    // ✅ USE getMarkerLngLat diretamente SEM 'L.Marker'
    const from: [number, number] = getMarkerLngLat(userMarker);
    const to: [number, number] = [salon.salonLongitude, salon.salonLatitude];

    const route = await calculateRoute(from, to);

    if (route) {
      routeDistance.value = route.distance;
      routeTime.value = formatTime(route.duration);

      drawRoute(route);
      currentRoute.value = true;

      $q.notify({
        message: `Rota para ${salon.salonName} calculada!`,
        icon: 'directions',
        color: 'positive',
        timeout: 3000,
      });
    } else {
      throw new Error('Não foi possível calcular a rota');
    }
  } catch (error) {
    console.error('Erro ao traçar rota:', error);
    $q.notify({
      message: 'Erro ao calcular rota',
      icon: 'error',
      color: 'negative',
    });
  } finally {
    isCalculatingRoute.value = false;
  }
};

// ✅ LOCALIZAR USUÁRIO
const locateUser = (): void => {
  if (!navigator.geolocation) {
    $q.notify({
      message: 'Geolocalização não suportada',
      icon: 'error',
      color: 'negative',
    });
    return;
  }

  $q.notify({
    message: 'Obtendo sua localização...',
    icon: 'my_location',
    color: 'info',
  });

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const userCoords: LocationCoordinates = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      clearAllMarkers();
      addUserMarker(userCoords);
      addSalonsToMap(props.salonsData);

      $q.notify({
        message: 'Localização atualizada!',
        icon: 'check',
        color: 'positive',
      });
    },
    (error) => {
      console.error('Erro de geolocalização:', error);
      let message = 'Erro ao obter localização';

      switch (error.code) {
        case error.PERMISSION_DENIED:
          message = 'Permissão de localização negada';
          break;
        case error.POSITION_UNAVAILABLE:
          message = 'Localização indisponível';
          break;
        case error.TIMEOUT:
          message = 'Tempo limite excedido';
          break;
      }

      $q.notify({
        message,
        icon: 'error',
        color: 'negative',
      });
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000,
    },
  );
};

// ✅ LIMPAR ROTA
const clearRoute = (): void => {
  removeRoute();
  currentRouteSalon.value = null;
  routeDistance.value = 0;
  routeTime.value = '';
  currentRoute.value = false;
};

// ✅ ABRIR DETALHES DO SALÃO
const openSalonDetails = (salon: ProcessedSalon): void => {
  try {
    const salonState = {
      salonId: salon.salonId,
      salonName: salon.salonName,
      salonAddress: salon.salonAddress,
      salonCity: salon.salonCity,
      salonLatitude: salon.salonLatitude,
      salonLongitude: salon.salonLongitude,
      salonRating: salon.salonRating,
      salonPriceRange: salon.salonPriceRange,
      isOpen: salon.isOpen,
      salonServices:
        salon.salonServices?.map((service) => ({
          serviceId: service.serviceId,
          serviceName: service.serviceName,
          servicePrice: service.servicePrice,
          serviceDuration: service.serviceDuration,
          serviceCategory: service.serviceCategory,
        })) || [],
    };

    void router.push({
      name: 'services',
      params: { salonId: salon.salonId.toString() },
      state: { salonData: salonState },
    });
  } catch (error) {
    console.error('Erro na navegação:', error);
    $q.notify({
      message: 'Erro ao abrir detalhes',
      icon: 'error',
      color: 'negative',
    });
  }
};

// ✅ FORMATAR DISTÂNCIA
const formatDistance = (distance: number): string => {
  return distance >= 1000 ? `${(distance / 1000).toFixed(1)} km` : `${Math.round(distance)} m`;
};

// ✅ FORMATAR TEMPO
const formatTime = (seconds: number): string => {
  const minutes = Math.round(seconds / 60);
  return minutes < 60 ? `${minutes} min` : `${Math.floor(minutes / 60)}h ${minutes % 60}min`;
};

// ✅ VOLTAR
const goBack = (): void => {
  router.go(-1);
};

// Watchers
watch(
  () => props.salonsData,
  (newSalons) => {
    if (newSalons.length > 0) {
      addSalonsToMap(newSalons);
    }
  },
  { deep: true },
);

watch(
  () => props.userCoords,
  (newCoords) => {
    if (newCoords) {
      clearAllMarkers();
      addUserMarker(newCoords);
      addSalonsToMap(props.salonsData);
    }
  },
  { deep: true },
);

// Lifecycle
onMounted(() => {
  setTimeout(() => {
    void initializeMap();
  }, 100);
});

onUnmounted(() => {
  destroyMap();
});
</script>
<style scoped lang="scss">
.salon-container {
  padding: 20px;
  height: 95vh;
  min-height: 800px;
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;

  h2 {
    margin: 0;
    font-size: 1.75rem;
    color: #1976d2;
  }
}

.main-content {
  flex: 1;
  min-height: 0;
}

.map-wrapper {
  position: relative;
  height: 650px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.map-container {
  height: 100%;
  width: 100%;
  background: #f8f9fa;
}

.map-legend {
  position: absolute;
  bottom: 20px;
  left: 20px;
  background: white;
  padding: 12px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 1000;

  .legend-item {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .legend-color {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 2px solid white;
  }

  .user-marker {
    background-color: #1976d2;
  }
  .salon-marker {
    background-color: #dc2626;
  }
  .route-line {
    background-color: #10b981;
    border-radius: 2px;
    width: 20px;
    height: 6px;
  }

  span {
    font-size: 12px;
    font-weight: 500;
    color: #424242;
  }
}

.map-controls {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  gap: 8px;
}

.salons-list {
  height: 650px;
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.list-header {
  padding: 16px;
  background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h3 {
    margin: 0;
    font-size: 1.3rem;
    font-weight: 600;
  }
}

.scroll-area {
  flex: 1;
}

.no-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #666;
  padding: 20px;

  p {
    margin-top: 12px;
    text-align: center;
  }
}

.salons-grid {
  padding: 12px;
}

.salon-card {
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid transparent;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  &.active-route {
    border-color: #10b981;
    background-color: #f0fdf4;
  }
}

.salon-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  padding-bottom: 12px;
}

.salon-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #e3f2fd;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #1976d2;
}

.salon-info {
  flex: 1;
}

.salon-name {
  margin: 0 0 6px 0;
  font-size: 16px;
  font-weight: 600;
  color: #1976d2;
  line-height: 1.2;
}

.salon-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.rating-text {
  font-size: 13px;
  color: #666;
  font-weight: 500;
}

.salon-details {
  padding: 12px 16px;
}

.detail-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 8px;

  &:last-child {
    margin-bottom: 0;
  }
}

.detail-text {
  font-size: 13px;
  color: #555;
  line-height: 1.3;
}

.distance {
  font-weight: 600;
  color: #1976d2;
}

.salon-actions {
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.route-info {
  background: #10b981;
  color: white;
  padding: 8px 16px;
  font-size: 12px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
  border-bottom-left-radius: inherit;
  border-bottom-right-radius: inherit;
}

// Responsividade
@media (max-width: 768px) {
  .salon-container {
    padding: 12px;
    height: auto;
    min-height: 100vh;
  }

  .map-wrapper,
  .salons-list {
    height: 500px;
  }

  .header h2 {
    font-size: 1.4rem;
  }

  .salon-actions {
    flex-direction: column;

    button {
      width: 100%;
    }
  }

  .list-header {
    padding: 12px;
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;

    h3 {
      font-size: 1.2rem;
    }
  }
}

/* ✅ ESTILOS PARA LEAFLET (ATUALIZADOS) */
:deep(.leaflet-marker-icon) {
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }
}

:deep(.leaflet-popup) {
  max-width: 250px;
}

:deep(.leaflet-popup-content) {
  border-radius: 8px;
  padding: 12px;
  font-family: inherit;
}

:deep(.leaflet-popup-content-wrapper) {
  border-radius: 8px;
}

:deep(.custom-marker) {
  cursor: pointer;
}

/* Remover estilos do MapLibre que não são mais necessários */
:deep(.maplibregl-marker),
:deep(.maplibregl-popup),
:deep(.maplibregl-popup-content) {
  /* Estes estilos não são mais necessários para Leaflet */
}
</style>
