export interface UserProfile {
  id: string;
  name: string; // ✅ Espera string, NÃO undefined
  email: string;
  role: 'client' | 'professional' | 'manager';
  avatar?: string | undefined;
  phone?: string | undefined;
}

export interface Booking {
  id: string;
  service: string;
  date: string;
  time: string;
  salonName: string;
  salonAddress: string;
  status: 'confirmed' | 'pending' | 'canceled' | 'completed';
  professional?: string;
  price?: number;
}

export interface Promotion {
  id: number;
  title: string;
  description: string;
  discount: number;
  validUntil: string;
  salonId?: string;
}

export interface Feedback {
  id: string;
  name: string;
  salon: string;
  date: string;
  rating: number;
  comment: string;
  service: string;
  gender: 'male' | 'female';
  clientId?: string;
}

export interface Service {
  id: number;
  name: string;
  icon: string;
  category: string;
  description?: string;
  duration?: number;
  price?: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  createdAt: string;
}

export interface FilterState {
  salon: string;
  service?: string;
  date?: string;
  status?: string;
}

export interface AppState {
  user: UserProfile | null;
  bookings: Booking[];
  promotions: Promotion[];
  feedbacks: Feedback[];
  services: Service[];
  notifications: Notification[];
  filters: FilterState;
  loading: boolean;
  error: string | null;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface BookingFormData {
  serviceId: number;
  date: string;
  time: string;
  salonId: string;
  professionalId?: string;
  notes?: string;
}

export interface FeedbackFormData {
  bookingId: string;
  rating: number;
  comment: string;
  service: string;
}


export interface TeamMember {
  id: number;
  name: string;
  role: string;
  bookings: number;
  performance: number;
}

export interface InventoryItem {
  id: number;
  name: string;
  category: string;
  currentStock: number;
  idealStock: number;
}

