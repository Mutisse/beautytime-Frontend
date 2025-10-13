// Tipos para a página de serviços e agendamento
export interface Service {
  serviceId: string;
  serviceName: string;
  servicePrice: number;
  serviceDuration: number;
  serviceCategory: string;
  serviceDescription: string;
  serviceImage?: string;
}

export interface Salon {
  salonId: string;
  salonName: string;
  salonAddress: string;
  salonDistance: number;
  salonRating: number;
  salonEstimatedTime: number;
  salonServices: Service[];
  salonAmenities: string[];
  isOpen: boolean;
  salonLatitude?: number;
  salonLongitude?: number;
}

export interface SelectedService extends Service {
  salonId: string;
}

export interface SalonFromAPI {
  _id: string;
  nameSalon: string;
  location?: {
    fullAddress: string;
    coordinates: [number, number]; // [longitude, latitude]
  };
  services?: Array<{
    _id?: string;
    id?: string;
    name: string;
    price: number;
    duration: number;
    category: string;
    description: string;
  }>;
  amenities?: string[];
  isOpen?: boolean;
}

export interface ServiceSearchFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  duration?: number;
  searchTerm?: string;
}

export interface BookingFormData {
  selectedServices: SelectedService[];
  appointmentDate: Date;
  appointmentTime: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  notes?: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
  isPeakHour: boolean;
}

export interface Appointment {
  id: string;
  salonId: string;
  services: SelectedService[];
  date: Date;
  time: string;
  clientInfo: {
    name: string;
    phone: string;
    email: string;
  };
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  totalPrice: number;
  totalDuration: number;
  notes?: string;
  createdAt: Date;
}

export interface ServiceCategory {
  id: string;
  name: string;
  icon?: string;
  description?: string;
}

export interface ServiceReview {
  id: string;
  serviceId: string;
  clientName: string;
  rating: number;
  comment: string;
  date: Date;
  verified: boolean;
}

export interface ServiceAvailability {
  serviceId: string;
  availableDates: Date[];
  availableTimeSlots: string[];
  nextAvailableDate?: Date;
}

// Tipos para notificações e feedback
export interface ServiceNotification {
  type: 'success' | 'warning' | 'error' | 'info';
  message: string;
  action?: string;
  duration?: number;
}

// Tipos para estado da store
export interface ServicesState {
  availableSalons: Salon[];
  selectedSalon: Salon | null;
  filteredServices: Service[];
  selectedServices: SelectedService[];
  searchFilters: ServiceSearchFilters;
  isLoading: boolean;
  error: string | null;
}

// Enums para categorias de serviços
export enum ServiceCategoryEnum {
  HAIR = 'Cabelo',
  NAILS = 'Unhas',
  SKIN = 'Pele',
  MASSAGE = 'Massagem',
  MAKEUP = 'Maquiagem',
  BARBER = 'Barbearia',
  SPA = 'SPA',
  OTHER = 'Outros',
}

// Enums para status de agendamento
export enum AppointmentStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

// Tipos utilitários
export type PriceRange = {
  min: number;
  max: number;
};

export type DurationRange = {
  min: number;
  max: number;
};

// Response types para API
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
  timestamp: Date;
}

export interface ServicesResponse {
  salon: Salon;
  services: Service[];
  categories: ServiceCategory[];
  availability: ServiceAvailability[];
}

export interface BookingResponse {
  appointment: Appointment;
  confirmationCode: string;
  qrCode?: string;
}

// Payload types para ações
export interface SearchServicesPayload {
  salonId: string;
  filters: ServiceSearchFilters;
}

export interface SelectServicePayload {
  service: Service;
  salonId: string;
}

export interface BookAppointmentPayload {
  bookingData: BookingFormData;
  salonId: string;
}
