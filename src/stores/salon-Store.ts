// stores/salon-Store.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type {
  SalonFormData,
  SalonResponse,
  CreateSalonPayload,
  SalonService,
  LocationCoordinates,
  ID,
  PaymentMethod,
  Province,
  OpeningHours,
} from '../types/Salon-Types';
import { SalonStatus } from '../types/SalonStatus-Types';
import { api } from 'boot/axios';

// Interface para os filtros
interface SalonFilters {
  searchQuery: string;
  city: string;
  maxDistance: number | null;
  distanceUnit: 'metros' | 'quilômetros';
  sortBy: 'distance' | 'rating' | 'price';
  services: string[];
  minRating: number;
  priceRange: [number, number];
  category: string;
  province: Province | '';
  amenities: string[];
  paymentMethods: PaymentMethod[];
}

// Interface para update data compatível com exactOptionalPropertyTypes
interface SalonUpdateData {
  nameSalon?: string | undefined;
  description?: string | undefined;
  category?: string | undefined;
  priceRange?: string | undefined;
  featured?: boolean | undefined;
  mainImage?: string | undefined;
  address?: string | undefined;
  city?: string | undefined;
  neighborhood?: string | undefined;
  province?: string | undefined;
  community?: string | undefined;
  zipCode?: string | undefined;
  latitude?: number | undefined;
  longitude?: number | undefined;
  phone?: string | undefined;
  email?: string | undefined;
  website?: string | undefined;
  whatsapp?: string | undefined;
  facebook?: string | undefined;
  instagram?: string | undefined;
  services?: SalonService[] | undefined;
  openingHours?: OpeningHours[] | undefined;
  amenities?: string[] | undefined;
  paymentMethods?: string[] | undefined;
  mobileWallets?: string[] | undefined;
  cancellationPolicy?: string | undefined;
  lateArrivalPolicy?: string | undefined;
  childrenPolicy?: string | undefined;
  status?: string | undefined;
  isOpen?: boolean | undefined;
  metadata?:
    | {
        createdBy?: string | undefined;
        createdAt?: Date | undefined;
        updatedAt?: Date | undefined;
      }
    | undefined;
  employees_owner?: string | undefined;
}

export const useSalonStore = defineStore('salon', () => {
  // State
  const salons = ref<SalonResponse[]>([]);
  const currentSalon = ref<SalonResponse | null>(null);
  const userLocation = ref<LocationCoordinates | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Filtros atualizados
  const filters = ref<SalonFilters>({
    searchQuery: '',
    city: '',
    maxDistance: null,
    distanceUnit: 'metros',
    sortBy: 'distance',
    services: [],
    minRating: 0,
    priceRange: [0, 1000],
    category: '',
    province: '',
    amenities: [],
    paymentMethods: [],
  });

  // Getters
  const filteredSalons = computed(() => {
    let filtered = [...salons.value];

    // Filtro por texto
    if (filters.value.searchQuery) {
      const query = filters.value.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (salon: SalonResponse) =>
          salon.nameSalon.toLowerCase().includes(query) ||
          salon.description.toLowerCase().includes(query) ||
          salon.location.address.toLowerCase().includes(query) ||
          salon.location.city?.toLowerCase().includes(query) ||
          salon.services?.some((service: SalonService) =>
            service.name.toLowerCase().includes(query),
          ),
      );
    }

    // Filtro por cidade
    if (filters.value.city) {
      filtered = filtered.filter(
        (salon: SalonResponse) => salon.location.city === filters.value.city,
      );
    }

    // Filtro por província - CORREÇÃO: Comparação de string com enum
    if (filters.value.province) {
      filtered = filtered.filter(
        (salon: SalonResponse) => salon.location.province === filters.value.province.toString(),
      );
    }

    // Filtro por categoria
    if (filters.value.category) {
      filtered = filtered.filter(
        (salon: SalonResponse) => salon.category === filters.value.category,
      );
    }

    // Filtro por serviços
    if (filters.value.services.length > 0) {
      filtered = filtered.filter((salon: SalonResponse) =>
        filters.value.services.every((serviceCategory) =>
          salon.services?.some((service) => service.category === serviceCategory),
        ),
      );
    }

    // Filtro por comodidades
    if (filters.value.amenities.length > 0) {
      filtered = filtered.filter((salon: SalonResponse) =>
        filters.value.amenities.every((amenity) => salon.amenities.includes(amenity)),
      );
    }

    // Filtro por métodos de pagamento
    if (filters.value.paymentMethods.length > 0) {
      filtered = filtered.filter((salon: SalonResponse) =>
        filters.value.paymentMethods.every((method) =>
          salon.paymentMethods.includes(method.toString()),
        ),
      );
    }

    // Filtro por rating mínimo
    if (filters.value.minRating > 0) {
      // Implementar quando tiver sistema de ratings
    }

    // Filtro por preço
    if (filters.value.priceRange[0] > 0 || filters.value.priceRange[1] < 1000) {
      filtered = filtered.filter((salon: SalonResponse) => {
        if (!salon.services || salon.services.length === 0) return false;

        const minServicePrice = Math.min(...salon.services.map((service) => service.price));
        return (
          minServicePrice >= filters.value.priceRange[0] &&
          minServicePrice <= filters.value.priceRange[1]
        );
      });
    }

    // Ordenação
    switch (filters.value.sortBy) {
      case 'distance':
        // Ordenar por distância quando implementado
        break;
      case 'rating':
        // Ordenar por rating quando implementado
        break;
      case 'price':
        filtered.sort((a: SalonResponse, b: SalonResponse) => {
          const aMinPrice = Math.min(...(a.services || []).map((s) => s.price));
          const bMinPrice = Math.min(...(b.services || []).map((s) => s.price));
          return aMinPrice - bMinPrice;
        });
        break;
      default:
        // Ordenação padrão por nome
        filtered.sort((a: SalonResponse, b: SalonResponse) =>
          a.nameSalon.localeCompare(b.nameSalon),
        );
        break;
    }

    return filtered;
  });

  const availableCities = computed(() => {
    return [
      ...new Set(
        salons.value.map((salon) => salon.location.city).filter((city) => city !== undefined),
      ),
    ] as string[];
  });

  const availableProvinces = computed(() => {
    return [
      ...new Set(
        salons.value
          .map((salon) => salon.location.province)
          .filter((province) => province !== undefined),
      ),
    ] as string[];
  });

  const availableCategories = computed(() => {
    return [...new Set(salons.value.map((salon) => salon.category))];
  });

  const availableServices = computed(() => {
    const allServices = salons.value.flatMap((salon) => salon.services || []);
    return [...new Map(allServices.map((service) => [service._id, service])).values()];
  });

  // Helper functions
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371000; // Raio da Terra em metros
    const toRad = (val: number) => (val * Math.PI) / 180;

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const setUserLocation = (location: LocationCoordinates): void => {
    userLocation.value = location;
  };

  const updateFilters = (newFilters: Partial<SalonFilters>): void => {
    filters.value = { ...filters.value, ...newFilters };
  };

  // CORREÇÃO CRÍTICA: Coordenadas na ordem MongoDB GeoJSON [longitude, latitude]
  const formatSalonData = (formData: SalonFormData): CreateSalonPayload => {
    const payload: CreateSalonPayload = {
      nameSalon: formData.nameSalon || 'Salão Sem Nome',
      description: formData.description || 'Descrição não fornecida',
      featured: Boolean(formData.featured),

      location: {
        address: formData.address || 'Endereço não fornecido',
        // ORDEM CORRETA PARA MONGODB GEOJSON: [LONGITUDE, LATITUDE]
        coordinates: [
          formData.longitude || 32.5699, // ← LONGITUDE primeiro (leste-oeste)
          formData.latitude || -25.9689, // ← LATITUDE depois (norte-sul)
        ] as [number, number],
        city: formData.city || 'Maputo',
        neighborhood: formData.neighborhood || 'Centro',
        province: formData.province || 'maputo_cidade',
        community: formData.community,
        zipCode: formData.zipCode,
        fullAddress: formData.address || 'Endereço não fornecido',
      },

      contact: {
        email: formData.email || 'email@exemplo.com',
        phone: formData.phone || '+258841234567',
        website: formData.website,
        whatsapp: formData.whatsapp,
        socialMedia: {
          facebook: formData.facebook,
          instagram: formData.instagram,
        },
      },

      category: formData.category || 'beauty-salon',
      priceRange: formData.priceRange || '$$',

      services: (formData.services || []).map((service) => ({
        name: service.name || 'Serviço sem nome',
        description: service.description || '',
        price: Number(service.price) || 0,
        duration: Number(service.duration) || 30,
        category: service.category || 'other',
        type: service.type || 'standard',
        difficulty: service.difficulty,
      })),

      workingHours: {
        monday: { isOpen: true, open: '08:00', close: '18:00' },
        tuesday: { isOpen: true, open: '08:00', close: '18:00' },
        wednesday: { isOpen: true, open: '08:00', close: '18:00' },
        thursday: { isOpen: true, open: '08:00', close: '18:00' },
        friday: { isOpen: true, open: '08:00', close: '18:00' },
        saturday: { isOpen: true, open: '08:00', close: '18:00' },
        sunday: { isOpen: false, open: '08:00', close: '18:00' },
      },

      amenities: formData.amenities || ['air_conditioning'],
      images: formData.mainImage ? [formData.mainImage] : undefined,
      mainImage: formData.mainImage,

      paymentMethods: formData.paymentMethods || ['cash'],
      mobileWallets: formData.mobileWallets,

      policies: {
        cancellation: formData.cancellationPolicy || '24 horas de antecedência',
        lateArrival: formData.lateArrivalPolicy || 'Tolerância de 15 minutos',
        children: formData.childrenPolicy || 'Aceita acima de 12 anos sem acompanhante.',
      },

      employees_owner: formData.employees_owner || 'temp-manager-id',
      metadata: {
        createdBy: formData.metadata?.createdBy || 'temp-user-id',
        createdAt: formData.metadata?.createdAt || new Date(),
      },
    };

    console.log('📍 Coordenadas do salão formatadas (MongoDB GeoJSON):', {
      longitude: payload.location.coordinates[0],
      latitude: payload.location.coordinates[1],
      address: payload.location.address,
      ordem: '[longitude, latitude] - Padrão MongoDB GeoJSON',
    });

    return payload;
  };

  // Função auxiliar para extrair coordenadas na ordem correta
  const extractCoordinates = (salon: SalonResponse): { latitude: number; longitude: number } => {
    // MongoDB GeoJSON armazena como [longitude, latitude]
    const [longitude, latitude] = salon.location.coordinates;
    return { latitude, longitude };
  };

  // Calcular distância usando coordenadas MongoDB
  const calculateDistanceFromMongoDB = (
    userLat: number,
    userLng: number,
    salon: SalonResponse,
  ): number => {
    const salonCoords = extractCoordinates(salon);
    return calculateDistance(userLat, userLng, salonCoords.latitude, salonCoords.longitude);
  };

  // Função para criar dados de update compatíveis
  const formatUpdateData = (updateData: SalonUpdateData): SalonUpdateData => {
    return { ...updateData };
  };

  // API Actions
  const fetchAllSalons = async (): Promise<SalonResponse[]> => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await api.get('/salons/all-salons');
      salons.value = response.data;
      console.log('📋 Todos os salões carregados:', salons.value.length);

      // Log das coordenadas para debug
      salons.value.forEach((salon, index) => {
        const coords = extractCoordinates(salon);
        console.log(`📍 Salão ${index + 1} - Coordenadas MongoDB:`, {
          nome: salon.nameSalon,
          mongoDB: salon.location.coordinates, // [longitude, latitude]
          extraido: coords, // {latitude, longitude}
        });
      });

      return response.data;
    } catch (err: unknown) {
      error.value = 'Erro ao carregar salões';
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      console.error('Erro ao buscar salões:', errorMessage);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const fetchSalonById = async (id: ID): Promise<SalonResponse> => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await api.get(`/salons/salons-byId/${id}`);
      currentSalon.value = response.data;

      // Log das coordenadas para debug
      const coords = extractCoordinates(response.data);
      console.log('📍 Coordenadas do salão carregado:', {
        nome: response.data.nameSalon,
        mongoDB: response.data.location.coordinates,
        extraido: coords,
      });

      return response.data;
    } catch (err: unknown) {
      error.value = 'Erro ao carregar salão';
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      console.error('Erro ao buscar salão:', errorMessage);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const createSalon = async (formData: SalonFormData): Promise<SalonResponse> => {
    isLoading.value = true;
    error.value = null;

    try {
      console.log('📤 Formatando dados do salão...');
      const payload = formatSalonData(formData);

      console.log('📤 Enviando dados para API (MongoDB GeoJSON):', {
        name: payload.nameSalon,
        coordinates: payload.location.coordinates,
        ordem: '[longitude, latitude]',
        longitude: payload.location.coordinates[0],
        latitude: payload.location.coordinates[1],
      });

      const response = await api.post('/salons/create/newsalon', payload);

      console.log('✅ Salão criado com sucesso (MongoDB GeoJSON):', {
        id: response.data._id,
        name: response.data.nameSalon,
        coordinates: response.data.location.coordinates,
        ordem: response.data.location.coordinates,
        status: response.data.status,
      });

      // Adiciona o novo salão à lista
      if (response.data) {
        salons.value.push(response.data);
      }

      return response.data;
    } catch (err: unknown) {
      error.value = 'Erro ao criar salão';
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      console.error('❌ Erro detalhado ao criar salão:', {
        message: errorMessage,
        response:
          err instanceof Error && 'response' in err
            ? (err as { response?: unknown }).response
            : undefined,
      });

      throw new Error(errorMessage || 'Erro ao criar salão');
    } finally {
      isLoading.value = false;
    }
  };

  // Função updateSalon corrigida
  const updateSalon = async (id: ID, updateData: SalonUpdateData): Promise<SalonResponse> => {
    isLoading.value = true;
    error.value = null;

    try {
      // Usar função formatUpdateData para garantir compatibilidade
      const formattedUpdateData = formatUpdateData(updateData);

      // Se houver coordenadas no update, formatar corretamente
      if (updateData.latitude !== undefined || updateData.longitude !== undefined) {
        const fullFormData: SalonFormData = {
          nameSalon: updateData.nameSalon || '',
          description: updateData.description || '',
          category: updateData.category || '',
          priceRange: updateData.priceRange || '',
          featured: updateData.featured || false,
          address: updateData.address || '',
          city: updateData.city || '',
          neighborhood: updateData.neighborhood || '',
          province: updateData.province || '',
          community: updateData.community,
          zipCode: updateData.zipCode,
          latitude: updateData.latitude || 0,
          longitude: updateData.longitude || 0,
          phone: updateData.phone || '',
          email: updateData.email || '',
          services: updateData.services || [],
          openingHours: updateData.openingHours || [],
          amenities: updateData.amenities || [],
          paymentMethods: updateData.paymentMethods || [],
          mobileWallets: updateData.mobileWallets || [],
          cancellationPolicy: updateData.cancellationPolicy || '',
          lateArrivalPolicy: updateData.lateArrivalPolicy || '',
          childrenPolicy: updateData.childrenPolicy || '',
          status: updateData.status || '',
          employees_owner: updateData.employees_owner || '',
          metadata: updateData.metadata
            ? {
                createdBy: updateData.metadata.createdBy || 'temp-user-id',
                createdAt: updateData.metadata.createdAt || new Date(),
                updatedAt: updateData.metadata.updatedAt || new Date(),
              }
            : undefined,
          isOpen: updateData.isOpen,
          mainImage: updateData.mainImage,
          website: updateData.website,
          whatsapp: updateData.whatsapp,
          facebook: updateData.facebook,
          instagram: updateData.instagram,
        };
        const formattedData = formatSalonData(fullFormData);
        Object.assign(formattedUpdateData, formattedData);
      }

      const response = await api.put(`/salons/${id}`, formattedUpdateData);

      // Verificar se o salão existe antes de atualizar
      const index = salons.value.findIndex((salon) => salon._id === id);
      if (index !== -1 && salons.value[index]) {
        salons.value[index] = { ...salons.value[index], ...response.data };
      }

      return response.data;
    } catch (err: unknown) {
      error.value = 'Erro ao atualizar salão';
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      console.error('Erro ao atualizar salão:', errorMessage);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const deleteSalon = async (id: ID): Promise<boolean> => {
    isLoading.value = true;
    error.value = null;

    try {
      await api.delete(`/salons/${id}/delete`);

      // Remove o salão da lista
      salons.value = salons.value.filter((salon) => salon._id !== id);

      return true;
    } catch (err: unknown) {
      error.value = 'Erro ao deletar salão';
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      console.error('Erro ao deletar salão:', errorMessage);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // Operações de administração corrigidas
  const approveSalon = async (id: ID): Promise<SalonResponse> => {
    try {
      const response = await api.patch(`/salons/${id}/approve`);

      // Verificar se o salão existe antes de atualizar
      const index = salons.value.findIndex((salon) => salon._id === id);
      if (index !== -1 && salons.value[index]) {
        salons.value[index].status = SalonStatus.APPROVED;
      }

      return response.data;
    } catch (err: unknown) {
      error.value = 'Erro ao aprovar salão';
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      console.error('Erro ao aprovar salão:', errorMessage);
      throw err;
    }
  };

  const rejectSalon = async (id: ID, reason?: string): Promise<SalonResponse> => {
    try {
      const response = await api.patch(`/salons/${id}/reject`, { reason });

      // Verificar se o salão existe antes de atualizar
      const index = salons.value.findIndex((salon) => salon._id === id);
      if (index !== -1 && salons.value[index]) {
        salons.value[index].status = SalonStatus.REJECTED;
      }

      return response.data;
    } catch (err: unknown) {
      error.value = 'Erro ao rejeitar salão';
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      console.error('Erro ao rejeitar salão:', errorMessage);
      throw err;
    }
  };

  const assignManager = async (id: ID, managerId: ID): Promise<SalonResponse> => {
    try {
      const response = await api.patch(`/salons/${id}/assign-manager`, { managerId });
      return response.data;
    } catch (err: unknown) {
      error.value = 'Erro ao atribuir gerente';
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      console.error('Erro ao atribuir gerente:', errorMessage);
      throw err;
    }
  };

  // Upload de imagens
  const addImagesToSalon = async (id: ID, images: File[]): Promise<SalonResponse> => {
    isLoading.value = true;
    error.value = null;

    try {
      const formData = new FormData();
      images.forEach((image) => {
        formData.append('images', image);
      });

      const response = await api.post(`/salons/${id}/images`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (err: unknown) {
      error.value = 'Erro ao adicionar imagens';
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      console.error('Erro ao adicionar imagens:', errorMessage);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // BUSCA CORRIGIDA - Usando coordenadas MongoDB
  const fetchSalonsByDistance = async (
    coordinates: LocationCoordinates,
    maxDistance?: number,
  ): Promise<SalonResponse[]> => {
    isLoading.value = true;
    error.value = null;

    try {
      // CORREÇÃO: Enviar coordenadas do usuário normalmente (lat, lng)
      const params: Record<string, string> = {
        latitude: coordinates.latitude.toString(),
        longitude: coordinates.longitude.toString(),
      };

      if (maxDistance) {
        params.distance = maxDistance.toString();
      }

      console.log('📍 Buscando salões próximos (MongoDB GeoJSON):', {
        params,
        userCoords: coordinates,
        maxDistance,
      });

      const response = await api.get('/salons/nearby/search', {
        params,
        paramsSerializer: {
          serialize: (params) => {
            const searchParams = new URLSearchParams();
            Object.entries(params).forEach(([key, value]) => {
              searchParams.append(key, value);
            });
            return searchParams.toString();
          },
        },
      });

      console.log('✅ Salões encontrados:', response.data.length);

      // Log detalhado das coordenadas retornadas
      response.data.forEach((salon: SalonResponse, index: number) => {
        const coords = extractCoordinates(salon);
        console.log(`📍 Salão ${index + 1}:`, {
          nome: salon.nameSalon,
          mongoDB: salon.location.coordinates,
          extraido: coords,
          distancia: calculateDistanceFromMongoDB(
            coordinates.latitude,
            coordinates.longitude,
            salon,
          ),
        });
      });

      salons.value = response.data;
      setUserLocation(coordinates);

      return response.data;
    } catch (err: unknown) {
      error.value = 'Erro ao buscar salões próximos';
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      console.error('Erro ao buscar salões por distância:', errorMessage);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // FUNÇÃO DE DEBUG PARA TESTAR
  const debugSalonSearch = async (): Promise<void> => {
    try {
      console.log('🔍 Iniciando debug da busca de salões (MongoDB GeoJSON)...');

      // Teste com as coordenadas do seu salão
      const testCoordinates: LocationCoordinates = {
        latitude: -25.88, // Latitude
        longitude: 32.52, // Longitude
        lat: -25.88,
        lng: 32.52,
      };

      // Buscar todos os salões primeiro
      await fetchAllSalons();
      console.log('📋 Total de salões no sistema:', salons.value.length);

      // Mostrar detalhes de cada salão
      salons.value.forEach((salon, index) => {
        const coords = extractCoordinates(salon);
        console.log(`🏠 Salão ${index + 1}:`, {
          nome: salon.nameSalon,
          mongoDB: salon.location.coordinates,
          extraido: coords,
          status: salon.status,
          cidade: salon.location.city,
        });
      });

      // Buscar por proximidade
      console.log('📍 Buscando salões próximos às coordenadas:', testCoordinates);
      await fetchSalonsByDistance(testCoordinates, 20000);
      console.log('📍 Salões próximos encontrados:', salons.value.length);
    } catch (error) {
      console.error('❌ Erro no debug:', error);
    }
  };

  // Métodos auxiliares
  const getSalonById = (salonId: ID): SalonResponse | undefined => {
    return salons.value.find((salon) => salon._id === salonId);
  };

  const getSalonServices = (salonId: ID): SalonService[] => {
    const salon = getSalonById(salonId);
    return salon?.services || [];
  };

  const getSalonOpeningHours = (
    salonId: ID,
  ): Record<
    string,
    { isOpen: boolean; open: string; close: string; breaks: Array<{ start: string; end: string }> }
  > => {
    const salon = getSalonById(salonId);
    return salon?.workingHours || {};
  };

  const getPopularServices = (limit: number = 5): SalonService[] => {
    const serviceCount = new Map<string, { service: SalonService; count: number }>();

    salons.value.forEach((salon) => {
      salon.services?.forEach((service) => {
        const existing = serviceCount.get(service._id || '');
        if (existing) {
          existing.count++;
        } else {
          serviceCount.set(service._id || '', { service, count: 1 });
        }
      });
    });

    return Array.from(serviceCount.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, limit)
      .map((item) => item.service);
  };

  // NOVO: Função para obter coordenadas de forma consistente
  const getSalonCoordinates = (salonId: ID): { latitude: number; longitude: number } | null => {
    const salon = getSalonById(salonId);
    if (!salon) return null;
    return extractCoordinates(salon);
  };

  // Inicialização
  const initializeStore = async (): Promise<void> => {
    await fetchAllSalons();
  };

  // Limpar erros
  const clearError = (): void => {
    error.value = null;
  };

  return {
    // State
    salons: salons,
    currentSalon: currentSalon,
    userLocation: userLocation,
    filters: filters,
    isLoading: isLoading,
    error: error,

    // Getters
    filteredSalons: filteredSalons,
    availableCities: availableCities,
    availableProvinces: availableProvinces,
    availableCategories: availableCategories,
    availableServices: availableServices,

    // Actions
    setUserLocation,
    updateFilters,
    fetchAllSalons,
    fetchSalonById,
    createSalon,
    updateSalon,
    deleteSalon,
    approveSalon,
    rejectSalon,
    assignManager,
    addImagesToSalon,
    fetchSalonsByDistance,
    getSalonById,
    getSalonServices,
    getSalonOpeningHours,
    getPopularServices,
    getSalonCoordinates,
    initializeStore,
    clearError,
    formatSalonData,
    debugSalonSearch,
  };
});
