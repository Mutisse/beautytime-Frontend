export interface Service {
  serviceId: string;
  serviceName: string;
  servicePrice: number;
  duration: number;
}

export interface Professional {
  staffMemberId: string;
  staffMemberName: string;
  staffMemberSpecialty?: string | undefined; // ← Adicione | undefined
  staffMemberRating: number;
  staffMemberImage?: string | undefined; // ← Adicione | undefined
}

export interface Salon {
  salonId: string;
  salonName: string;
  salonAddress?: string | undefined; // ← Adicione | undefined
  salonStaff?: Professional[] | undefined; // ← Adicione | undefined
  salonAvailableSlots?: Record<string, string[]> | undefined; // ← Adicione | undefined
}

export interface UserData {
  firstName: string;
  lastName: string;
  phone: string;
  email?: string | undefined; // ← Adicione | undefined
  gender?: 'male' | 'female' | 'undefined' | null | undefined; // ← Adicione | undefined
}

export interface UserAddress {
  road: string;
  number: string;
  block: string;
  neighborhood: string;
  city: string;
  reference?: string | undefined; // ← Adicione | undefined
}

export interface BookingData {
  salon: Salon;
  services: Service[];
  professional?: Professional | null | undefined; // ← Adicione | undefined
  date: string;
  time: string | null;
  total: number;
  duration: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
}

export interface BookingPayload {
  salonId: string;
  salonName: string;
  services: Service[];
  professional?: {
    staffMemberId: string;
    staffMemberName: string;
    staffMemberSpecialty?: string | undefined; // ← Adicione | undefined
    staffMemberRating: number;
  } | null | undefined; // ← Adicione | undefined
  date: string;
  time: string;
  clientData: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    gender?: 'male' | 'female' | 'undefined' | null | undefined; // ← Adicione | undefined
  };
  locationType: 'salon' | 'home';
  address?: {
    road: string;
    number: string;
    block: string;
    neighborhood: string;
    city: string;
  } | undefined; // ← Adicione | undefined
  totalPrice: number;
  status: string;
  notes?: string | undefined; // ← Adicione | undefined
}