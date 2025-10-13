// src/types/staff.ts
export interface Client {
  id: number;
  name: string;
  phone: string;
  email: string;
  avatar: string;
}

export interface Appointment {
  id: number;
  date: Date;
  startTime: string;
  endTime: string;
  client: Client;
  service: string;
  notes?: string;
  status?: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'attending';
}

export interface TimeSlot {
  time: string;
  status: string;
  isCurrent: boolean;
  isExpired: boolean;
  appointment: Appointment | null;
}

export interface Material {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  minQuantity: number;
}

export interface MaterialRequest {
  id: number;
  materialName: string;
  quantity: number;
  unit: string;
  date: Date;
  status: string;
  statusLabel: string;
  materialId: number;
  reason: string;
  urgent: boolean;
}

export interface PeakHour {
  time: string;
  count: number;
  percentage: number;
}

export interface StatItem {
  label: string;
  value: number;
}

export interface RejectionData {
  appointment: Appointment;
  reason: string;
  notes?: string;
}

export interface RescheduleData {
  appointment: Appointment;
  newDate: Date;
  newTime: string;
}

export interface MaterialUse {
  materialId: number;
  quantity: number;
  appointmentId?: string;
  notes?: string;
}

export interface MaterialUseData {
  materialId: number;
  quantity: number;
  appointmentId?: string;
  notes?: string;
}

export interface MaterialRequestFormData {
  materialId: number;
  quantity: number;
  reason: string;
  urgent: boolean;
}

export interface MaterialRequestForm {
  id: number;
  materialId: number;
  quantity: number;
  reason: string;
  urgent: boolean;
  date: string;
  status: string;
  statusLabel: string;
  staffId: number;
  materialName: string;
}

// NOVO TIPO: Para compatibilidade com o modal
export type MaterialRequestEmit = Partial<MaterialRequest> & {
  materialId: number;
  quantity: number;
  reason: string;
  urgent: boolean;
};

// Interface para dados de solicitação de material
export interface MaterialRequestData {
  materialId?: string | number;
  id?: string | number;
  quantity: string | number;
  reason?: string;
  urgent?: boolean;
}

// Tipos para o dashboard do staff
export interface StaffDashboardStats {
  totalAppointments: number;
  completedAppointments: number;
  pendingAppointments: number;
  monthlyRevenue: number;
  averageRating: number;
  clientSatisfaction: number;
}

export interface StaffPerformance {
  staffId: number;
  name: string;
  appointmentsCompleted: number;
  revenueGenerated: number;
  clientRating: number;
  efficiency: number;
}
