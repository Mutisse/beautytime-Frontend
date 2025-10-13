import type { Appointment } from './staff-Type';

export interface RejectionData {
  appointment: Appointment;
  reason: string;
  notes: string;
}

export interface RescheduleData {
  appointment: Appointment;
  newDate: Date;
  newTime: string;
}

export interface MaterialRequest {
  materialId: number;
  materialName: string;
  quantity: number;
  unit: string;
  notes: string;
}

export interface MaterialUse {
  materialId: number;
  quantity: number;
  notes: string;
}
