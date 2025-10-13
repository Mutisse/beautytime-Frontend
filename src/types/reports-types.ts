// types/reports-types.ts
export interface FilterOption {
  label: string;
  value: string;
}

export interface SalonMetric {
  id: number;
  label: string;
  value: string;
  icon: string;
  color: string;
  trend: number;
}

export interface ServiceMetric {
  id: number;
  name: string;
  value: string;
  revenue: string;
  icon: string;
  color: string;
}

export interface SalonPerformance {
  id: number;
  name: string;
  logo: string;
  performance: number;
  revenue: string;
  appointments: number;
}

export interface ProfitableService {
  id: number;
  name: string;
  salon: string;
  bookings: number;
  revenue: string;
  popularity: number;
  icon: string;
  categoryColor: string;
}

export interface ServiceDetail {
  id: number;
  name: string;
  salon: string;
  bookings: number;
  revenue: string;
  popularity: number;
  rating: number;
}

export interface ReportsState {
  selectedPeriod: FilterOption;
  selectedSalon: FilterOption;
  selectedService: FilterOption;
  salonMetrics: SalonMetric[];
  serviceMetrics: ServiceMetric[];
  salonPerformance: SalonPerformance[];
  profitableServices: ProfitableService[];
  serviceDetails: ServiceDetail[];
}
