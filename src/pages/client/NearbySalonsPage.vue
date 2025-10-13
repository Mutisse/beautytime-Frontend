<template>
  <q-page class="salon-view">
    <!-- Estados de loading, error -->
    <div v-if="isLoading" class="loading-state text-center q-pa-xl">
      <q-spinner-gears size="xl" color="primary" />
      <p class="q-mt-md text-body1">Buscando salões próximos...</p>
    </div>

    <div v-else-if="hasError" class="error-state text-center q-pa-xl">
      <q-icon name="warning" size="xl" color="negative" />
      <h3 class="q-mt-md text-h6">Não foi possível carregar os salões</h3>
      <p class="q-mb-md">Verifique sua conexão com a internet e tente novamente</p>
      <q-btn 
        icon="refresh" 
        label="Tentar novamente" 
        color="primary" 
        @click="retryLoading"
        unelevated
      />
    </div>

    <div v-else class="content-container full-height">
      <!-- Componente do mapa -->
      <SalonFinderComponent 
        v-if="showMap"
        :salons-data="salonsWithDistance"
        :user-coords="userCoords"
        @open-services-gallery="openServicesGallery"
      />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { useSalonStore } from '../../stores/salon-Store'
import type { 
  LocationCoordinates, 
  ProcessedSalon,
  SalonService 
} from '../../types/Salon-Types'
import SalonFinderComponent from '../../components/client/map/SalonFinder.vue'

const $q = useQuasar()
const router = useRouter()
const salonStore = useSalonStore()

const isLoading = ref<boolean>(true)
const hasError = ref<boolean>(false)
const userCoords = ref<LocationCoordinates | null>(null)
const showMap = ref<boolean>(false)

// Calcular distância entre dois pontos
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371000 // Raio da Terra em metros
  const toRad = (val: number) => (val * Math.PI) / 180

  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)

  const lat1Rad = toRad(lat1)
  const lat2Rad = toRad(lat2)

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1Rad) * Math.cos(lat2Rad)
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  
  return R * c
}

// Processar serviços do salão para garantir que serviceId seja sempre string
const processSalonServices = (services: SalonService[] | undefined): Array<{
  serviceId: string;
  serviceName: string;
  servicePrice?: number;
  serviceDuration?: number;
  serviceCategory?: string;
  serviceDescription?: string;
}> => {
  if (!services) return []

  return services.map(service => ({
    serviceId: service._id || `temp-${Math.random().toString(36).substr(2, 9)}`,
    serviceName: service.name,
    servicePrice: service.price,
    serviceDuration: service.duration,
    serviceCategory: service.category,
    serviceDescription: service.description
  }))
}

// Calcular rating médio do salão (função auxiliar)
const calculateAverageRating = (): number => {
  // Por enquanto, vamos usar um valor padrão
  // Futuramente você pode implementar lógica baseada em reviews
  return 4.5
}

// Salões com distâncias calculadas
const salonsWithDistance = computed<ProcessedSalon[]>(() => {
  if (!userCoords.value) return []

  return salonStore.salons.map(salon => {
    let distance = 0
    
    if (salon.location.coordinates && salon.location.coordinates.length === 2) {
      distance = calculateDistance(
        userCoords.value!.latitude,
        userCoords.value!.longitude,
        salon.location.coordinates[1], // latitude
        salon.location.coordinates[0]  // longitude
      )
    }

    return {
      salonId: salon._id,
      salonName: salon.nameSalon,
      salonAddress: salon.location.address,
      salonCity: salon.location.city || 'Maputo',
      salonLatitude: salon.location.coordinates[1],
      salonLongitude: salon.location.coordinates[0],
      salonRating: calculateAverageRating(),
      salonPriceRange: salon.priceRange || '$$',
      salonDistance: distance,
      salonEstimatedTime: Math.round(distance / 80),
      salonServices: processSalonServices(salon.services),
      isOpen: salon.isOpen !== false
    }
  })
})

// Obter localização do usuário
const getUserLocation = (): Promise<LocationCoordinates> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocalização não suportada'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords: LocationCoordinates = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          lat: position.coords.latitude, // mantendo compatibilidade
          lng: position.coords.longitude // mantendo compatibilidade
        }
        userCoords.value = coords
        salonStore.setUserLocation(coords)
        resolve(coords)
      },
      (error) => {
        reject(new Error(`Erro: ${error.message}`))
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  })
}

// Carregar dados
const loadData = async (): Promise<void> => {
  try {
    isLoading.value = true
    hasError.value = false

    // Obter localização do usuário
    await getUserLocation()
    
    if (userCoords.value) {
      // Buscar salões próximos
      await salonStore.fetchSalonsByDistance(userCoords.value, 20000)
    }

    // Mostrar mapa se houver salões
    if (salonsWithDistance.value.length > 0) {
      showMap.value = true
      $q.notify({
        message: `Encontrados ${salonsWithDistance.value.length} salões próximos`,
        icon: 'check',
        color: 'positive',
        timeout: 3000
      })
    } else {
      $q.notify({
        message: 'Nenhum salão encontrado na sua área',
        icon: 'info',
        color: 'info'
      })
    }
  } catch (error: unknown) {
    hasError.value = true
    const errorMessage = error instanceof Error ? error.message : 'Erro ao buscar salões'
    
    $q.notify({
      message: errorMessage,
      icon: 'error',
      color: 'negative'
    })
  } finally {
    isLoading.value = false
  }
}

// Inicialização
onMounted(() => {
  void loadData()
})

const retryLoading = (): void => {
  void loadData()
}

async function openServicesGallery(salonId: string): Promise<void> {
  await router.push({ name: 'ServicesGallery', params: { salonId } })
}
</script>

<style scoped>
.loading-state, .error-state {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}

.content-container {
  position: relative;
  height: 100%;
}

.salon-view {
  position: relative;
  height: 100%;
}
</style>