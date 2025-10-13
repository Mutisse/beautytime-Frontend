// types/Salon-Types.ts

// Tipos básicos de coordenadas e localização
export interface LocationCoordinates {
  latitude: number;
  longitude: number;
  lat: number; // Para compatibilidade
  lng: number; // Para compatibilidade
}

export type ID = string;

export interface SalonLocation {
  type: string;
  coordinates: [number, number]; // [longitude, latitude]
  address?: string | undefined;
  province?: string | undefined;
  district?: string | undefined;
}

// Interface para salões processados (usada no componente)
export interface ProcessedSalon {
  salonId: string;
  salonName: string;
  salonAddress: string;
  salonCity: string;
  salonLatitude: number;
  salonLongitude: number;
  salonRating: number;
  salonPriceRange: string;
  salonDistance: number;
  salonEstimatedTime: number;
  salonServices: Array<{
    serviceId: string;
    serviceName: string;
    servicePrice?: number | undefined;
    serviceDuration?: number | undefined;
    serviceCategory?: string | undefined;
    serviceDescription?: string | undefined;
  }>;
  isOpen: boolean;
}

// Serviços do salão
export interface SalonService {
  _id?: string | undefined;
  name: string;
  description: string;
  price: number;
  duration: number;
  category: string;
  type: string;
  difficulty?: string | undefined;
  materials?: Array<{ name: string; quantity: number }> | undefined;
  professionalsRequired?: number | undefined;
  isActive?: boolean | undefined;
  image?: string | undefined;
  createdAt?: Date | undefined;
}

// Horário de funcionamento
export interface OpeningHours {
  day: string;
  open: string;
  close: string;
  isClosed: boolean;
}

// Localização completa
export interface Location {
  address: string;
  neighborhood: string;
  city: string;
  province: string;
  community?: string | undefined;
  zipCode?: string | undefined;
  complement?: string | undefined;
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
  fullAddress?: string | undefined;
}

// Contato
export interface Contact {
  phone: string;
  email: string;
  website?: string | undefined;
  whatsapp?: string | undefined;
  socialMedia?: {
    facebook?: string | undefined;
    instagram?: string | undefined;
  } | undefined;
}

// Políticas
export interface Policies {
  cancellation: string;
  lateArrival: string;
  children: string;
}

// Dados do formulário do salão
export interface SalonFormData {
  // Informações básicas
  nameSalon: string;
  description: string;
  category: string;
  priceRange: string;
  featured: boolean;
  mainImage?: string | undefined;

  // Localização
  address: string;
  city: string;
  neighborhood: string;
  province: string;
  community?: string | undefined;
  zipCode?: string | undefined;
  latitude: number;
  longitude: number;

  // Contato
  phone: string;
  email: string;
  website?: string | undefined;
  whatsapp?: string | undefined;
  facebook?: string | undefined;
  instagram?: string | undefined;

  // Serviços
  services: SalonService[];

  // Horário de funcionamento
  openingHours: OpeningHours[];

  // Comodidades
  amenities: string[];

  // Métodos de pagamento
  paymentMethods: string[];
  mobileWallets: string[];

  // Políticas
  cancellationPolicy: string;
  lateArrivalPolicy: string;
  childrenPolicy: string;

  // Status e metadados
  status: string;
  isOpen?: boolean | undefined;

  // Campos temporários para desenvolvimento
  metadata?: {
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
  } | undefined;
  employees_owner: string;
}

// Resposta da API para salão
export interface SalonResponse {
  _id: string;
  nameSalon: string;
  description: string;
  featured: boolean;
  location: Location;
  contact: Contact;
  paymentMethods: string[];
  mobileWallets: string[];
  amenities: string[];
  workingHours: Record<
    string,
    {
      isOpen: boolean;
      open: string;
      close: string;
      breaks: Array<{ start: string; end: string }>;
    }
  >;
  services: SalonService[];
  images: string[];
  mainImage?: string | undefined;
  employees_owner: string;
  status: string;
  isOpen: boolean;
  isDeleted: boolean;
  metadata: {
    createdBy: string;
    createdAt: Date;
    updatedBy?: string | undefined;
    updatedAt?: Date | undefined;
    approvedBy?: string | undefined;
    approvedAt?: Date | undefined;
    rejectedBy?: string | undefined;
    rejectedAt?: Date | undefined;
    rejectionReason?: string | undefined;
    lastModifiedBy?: string | undefined;
    lastModifiedAt?: Date | undefined;
  };
  policies: Policies;
  category: string;
  priceRange: string;
  createdAt: Date;
  updatedAt: Date;
}

// Payload para criação de salão
export interface CreateSalonPayload {
  nameSalon: string;
  description: string;
  featured?: boolean | undefined;
  location: {
    address: string;
    coordinates: [number, number];
    city: string;
    neighborhood: string;
    province: string;
    community?: string | undefined;
    zipCode?: string | undefined;
    fullAddress: string;
  };
  contact: {
    email: string;
    phone: string;
    website?: string | undefined;
    whatsapp?: string | undefined;
    socialMedia?: {
      facebook?: string | undefined;
      instagram?: string | undefined;
    } | undefined;
  };
  category: string;
  priceRange: string;
  services: Array<{
    name: string;
    description: string;
    price: number;
    duration: number;
    category: string;
    type: string;
    difficulty?: string | undefined;
  }>;
  workingHours: {
    monday: { isOpen: boolean; open: string; close: string };
    tuesday: { isOpen: boolean; open: string; close: string };
    wednesday: { isOpen: boolean; open: string; close: string };
    thursday: { isOpen: boolean; open: string; close: string };
    friday: { isOpen: boolean; open: string; close: string };
    saturday: { isOpen: boolean; open: string; close: string };
    sunday: { isOpen: boolean; open: string; close: string };
  };
  amenities: string[];
  images?: string[] | undefined;
  mainImage?: string | undefined;
  paymentMethods: string[];
  mobileWallets?: string[] | undefined;
  policies: {
    cancellation: string;
    lateArrival: string;
    children: string;
  };
  employees_owner: string;
  metadata: {
    createdBy: string;
    createdAt: Date;
  };
}

// Enums para o frontend
export enum PaymentMethod {
  CASH = 'cash',
  CARD = 'card',
  BANK_TRANSFER = 'bank_transfer',
  MOBILE_WALLET = 'mobile_wallet',
}

export enum MobileWallet {
  MPESA = 'mpesa',
  E_MOLA = 'e_mola',
  MOVITEL_MOCAMBA = 'movitel_mocamba',
}

export enum Province {
  MAPUTO_CIDADE = 'maputo_cidade',
  MAPUTO_PROVINCIA = 'maputo_provincia',
  GAZA = 'gaza',
  INHAMBANE = 'inhambane',
  SOFALA = 'sofala',
  MANICA = 'manica',
  TETE = 'tete',
  ZAMBEZIA = 'zambezia',
  NAMPULA = 'nampula',
  CABO_DELGADO = 'cabo_delgado',
  NIASSA = 'niassa',
}

export enum ServiceCategory {
  HAIR = 'hair',
  NAILS = 'nails',
  SKIN = 'skin',
  BEARD = 'beard',
  MASSAGE = 'massage',
  OTHER = 'other',
}

export enum ServiceType {
  STANDARD = 'standard',
  PREMIUM = 'premium',
  VIP = 'vip',
}

export enum ServiceDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}

// Tipos para validação
export interface ValidationResult {
  isValid: boolean;
  error: string;
}

// Tipos para o store
export interface SalonState {
  salons: SalonResponse[];
  currentSalon: SalonResponse | null;
  loading: boolean;
  error: string | null;
  userLocation: LocationCoordinates | null;
}

// Tipos para formulários
export interface ServiceFormData {
  name: string;
  price: number;
  duration: number;
  category: string;
  description?: string | undefined;
}

export interface ContactFormData {
  phone: string;
  email: string;
  website?: string | undefined;
  whatsapp?: string | undefined;
  facebook?: string | undefined;
  instagram?: string | undefined;
}

export interface LocationFormData {
  address: string;
  city: string;
  neighborhood: string;
  province: string;
  community?: string | undefined;
  zipCode?: string | undefined;
  latitude: number;
  longitude: number;
}

// Tipos para filtros
export interface SalonFilters {
  priceRange?: string[] | undefined;
  categories?: string[] | undefined;
  rating?: number | undefined;
  distance?: number | undefined;
  services?: string[] | undefined;
  isOpenNow?: boolean | undefined;
}

// Tipos para busca
export interface SearchParams {
  query?: string | undefined;
  location?: LocationCoordinates | undefined;
  radius?: number | undefined;
  filters?: SalonFilters | undefined;
  sortBy?: string | undefined;
  sortOrder?: 'asc' | 'desc' | undefined;
}

// Tipos para agendamento
export interface TimeSlot {
  start: Date;
  end: Date;
  isAvailable: boolean;
}

export interface AvailableSlot {
  date: string;
  slots: TimeSlot[];
}

export interface BookingRequest {
  salonId: string;
  serviceId: string;
  date: Date;
  time: string;
  professionalId?: string | undefined;
  customerNotes?: string | undefined;
}

export interface BookingResponse {
  _id: string;
  salonId: string;
  serviceId: string;
  customerId: string;
  date: Date;
  time: string;
  status: BookingStatus;
  totalPrice: number;
  duration: number;
  professionalId?: string | undefined;
  customerNotes?: string | undefined;
  createdAt: Date;
  updatedAt: Date;
}

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show',
}

// Tipos para avaliações
export interface Review {
  _id: string;
  salonId: string;
  customerId: string;
  rating: number;
  comment?: string | undefined;
  serviceType: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingBreakdown: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

// Tipos para profissionais
export interface Professional {
  _id: string;
  salonId: string;
  name: string;
  email: string;
  phone: string;
  specialization: string[];
  bio?: string | undefined;
  experience: number;
  image?: string | undefined;
  isActive: boolean;
  workingHours: Record<string, { start: string; end: string }>;
  services: string[];
  rating?: number | undefined;
  createdAt: Date;
  updatedAt: Date;
}

// Tipos para notificações
export interface Notification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  relatedEntity?: {
    type: 'booking' | 'salon' | 'review';
    id: string;
  } | undefined;
  createdAt: Date;
}

export enum NotificationType {
  BOOKING_CONFIRMATION = 'booking_confirmation',
  BOOKING_REMINDER = 'booking_reminder',
  BOOKING_CANCELLATION = 'booking_cancellation',
  NEW_REVIEW = 'new_review',
  SALON_UPDATE = 'salon_update',
  PROMOTIONAL = 'promotional',
}

// Tipos para upload de imagens
export interface ImageUpload {
  file: File;
  url?: string | undefined;
  progress: number;
  error?: string | undefined;
}

export interface UploadResult {
  success: boolean;
  url?: string | undefined;
  error?: string | undefined;
}

// Tipos para paginação
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string | undefined;
  sortOrder?: 'asc' | 'desc' | undefined;
}

// Tipos para analytics
export interface SalonAnalytics {
  totalBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  revenue: number;
  averageRating: number;
  popularServices: Array<{
    serviceId: string;
    serviceName: string;
    bookingCount: number;
    revenue: number;
  }>;
  bookingTrends: Array<{
    date: string;
    bookings: number;
    revenue: number;
  }>;
}

// Tipos para relatórios
export interface ReportParams {
  startDate: Date;
  endDate: Date;
  salonId?: string | undefined;
  serviceId?: string | undefined;
  professionalId?: string | undefined;
}

export interface BookingReport {
  totalBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  revenue: number;
  averageServiceTime: number;
  customerSatisfaction: number;
}

// Utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type WithRequired<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type Nullable<T> = T | null;
export type Maybe<T> = T | undefined;