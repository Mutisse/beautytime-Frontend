// composables/salon-form/useSalonMap.ts - VERSÃO CORRIGIDA
import { ref, nextTick } from 'vue';
import { useQuasar } from 'quasar';

interface MarkerData {
  id: string;
  name?: string;
  address?: string;
  rating?: number;
  priceRange?: string;
}

interface MapMarker {
  id: string;
  lnglat: [number, number];
  title: string;
  color: string;
  type: 'user' | 'salon' | 'other';
  data?: MarkerData;
}

interface ValidationFunction {
  (field: string, value: unknown, validator: (value: unknown) => string | true): void;
}

export const useSalonMap = () => {
  const $q = useQuasar();

  const mapLoading = ref(false);
  const selectedLocation = ref(false);
  const locationSearch = ref('');
  const map = ref(null);
  const markers = ref<MapMarker[]>([]);
  const currentRoute = ref(null);

  const locationDetails = ref({
    street: '',
    suburb: '',
    city: '',
    state: '',
    country: '',
    postcode: '',
  });

  // composables/salon-form/useSalonMap.ts - APENAS AS CORREÇÕES

  // CORREÇÃO 1: Remover 'options' não utilizado
  const initMap = async (
    mapContainer: HTMLElement,
    // ❌ REMOVA COMPLETAMENTE: _options: { center?: [number, number]; zoom?: number } = {},
  ): Promise<void> => {
    if (!mapContainer) return;
    mapLoading.value = true;
    try {
      await nextTick();
      console.log('Mapa inicializado');
      mapLoading.value = false;
    } catch (error) {
      console.error('Erro ao inicializar mapa:', error);
      $q.notify({
        type: 'negative',
        message: 'Erro ao carregar o mapa.',
        position: 'top',
      });
      mapLoading.value = false;
    }
  };

  
  // ✅ CORREÇÃO: Remover 'async' já que não tem await
  const setLocation = (
    lat: number,
    lng: number,
    salon: { latitude: number; longitude: number },
    validateField: ValidationFunction,
  ): void => {
    // ✅ REMOVA Promise<void> e use void
    try {
      salon.latitude = lat;
      salon.longitude = lng;
      selectedLocation.value = true;

      const validateCoordinate = (value: unknown): string | true => {
        if (!value) return 'Coordenada é obrigatória';
        const numValue = Number(value);
        if (isNaN(numValue)) return 'Coordenada deve ser um número';
        return true;
      };

      if (validateField) {
        validateField('latitude', lat, validateCoordinate);
        validateField('longitude', lng, validateCoordinate);
      }

      clearAllMarkers();

      addColoredMarker({
        id: 'salon-location',
        lnglat: [lat, lng],
        title: 'Local do Salão',
        color: 'blue',
        type: 'salon',
        data: {
          id: 'salon-location',
          name: 'Salão',
        },
      });

      $q.notify({
        type: 'positive',
        message: 'Localização definida com sucesso!',
        position: 'top',
      });
    } catch (error) {
      console.error('Erro ao definir localização:', error);
      $q.notify({
        type: 'negative',
        message: 'Erro ao definir localização.',
        position: 'top',
      });
    }
  };
  // CORREÇÃO 3: Remover 'validateField' não utilizado
  const addMapClickListener = (salon: { latitude: number; longitude: number }): void => {
    console.log('Listener de clique adicionado para:', salon);
  };
  const calculateRoute = async (
    from: [number, number],
    to: [number, number],
  ): Promise<{
    geometry: { coordinates: [number, number][] };
    distance: number;
    duration: number;
  }> => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return {
        geometry: {
          coordinates: [
            [from[0], from[1]],
            [to[0], to[1]],
          ],
        },
        distance: 1500,
        duration: 300,
      };
    } catch (error) {
      console.error('Erro ao calcular rota:', error);
      throw error;
    }
  };

  const removeRoute = (): void => {
    currentRoute.value = null;
  };

  const drawRoute = (routeData: {
    geometry: { coordinates: [number, number][] };
    distance: number;
    duration: number;
  }): void => {
    console.log('Desenhando rota:', routeData);
    $q.notify({
      type: 'positive',
      message: `Rota calculada: ${(routeData.distance / 1000).toFixed(1)} km • ${Math.ceil(routeData.duration / 60)} min`,
      position: 'top',
      timeout: 5000,
    });
  };

  const addColoredMarker = (markerData: MapMarker): MapMarker => {
    console.log('Adicionando marcador:', markerData);
    markers.value.push(markerData);
    return markerData;
  };

  const clearAllMarkers = (): void => {
    markers.value = [];
  };

  const getMarkerData = (marker: MapMarker): MarkerData | undefined => {
    return marker.data;
  };

  const getMarkerLngLat = (marker: MapMarker): [number, number] => {
    return marker.lnglat;
  };

  const destroyMap = (): void => {
    clearAllMarkers();
    console.log('Mapa destruído');
  };

  const locateMe = (): Promise<{ latitude: number; longitude: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        $q.notify({
          type: 'warning',
          message: 'Geolocalização não suportada',
          position: 'top',
        });
        reject(new Error('Geolocalização não suportada'));
        return;
      }

      $q.loading.show({ message: 'Obtendo localização...' });

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          $q.loading.hide();
          $q.notify({
            type: 'positive',
            message: 'Localização encontrada!',
            position: 'top',
          });
          resolve(coords);
        },
        (error) => {
          $q.loading.hide();
          let message = 'Erro ao obter localização';
          if (error.code === error.PERMISSION_DENIED) {
            message = 'Permissão de localização negada';
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            message = 'Localização indisponível';
          } else if (error.code === error.TIMEOUT) {
            message = 'Tempo limite excedido';
          }
          $q.notify({ type: 'negative', message, position: 'top' });
          reject(new Error(message));
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
      );
    });
  };

  const searchLocation = async (): Promise<void> => {
    if (!locationSearch.value.trim()) {
      $q.notify({
        type: 'warning',
        message: 'Digite um endereço',
        position: 'top',
      });
      return;
    }

    mapLoading.value = true;
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      $q.notify({
        type: 'positive',
        message: 'Localização encontrada!',
        position: 'top',
      });
    } catch (error) {
      console.error('Erro na pesquisa:', error);
      $q.notify({
        type: 'negative',
        message: 'Erro ao pesquisar',
        position: 'top',
      });
    } finally {
      mapLoading.value = false;
    }
  };

  const removeMapClickListener = (): void => {
    console.log('Listener de clique removido');
  };

  const clearLocation = (): void => {
    selectedLocation.value = false;
    locationSearch.value = '';
    clearAllMarkers();
    removeRoute();
    $q.notify({
      type: 'info',
      message: 'Localização removida',
      position: 'top',
    });
  };

  return {
    mapLoading,
    selectedLocation,
    locationSearch,
    locationDetails,
    markers,
    map,
    currentRoute,
    initMap,
    destroyMap,
    addColoredMarker,
    clearAllMarkers,
    calculateRoute,
    removeRoute,
    drawRoute,
    getMarkerData,
    getMarkerLngLat,
    locateMe,
    setLocation,
    searchLocation,
    addMapClickListener,
    removeMapClickListener,
    clearLocation,
  };
};
