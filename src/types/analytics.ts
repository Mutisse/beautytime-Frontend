// src/types/analytics.ts
export interface DashboardData {
  overview: {
    totalRevenue: number;
    totalAppointments: number;
    totalCustomers: number;
    activeEmployees: number;
    averageRating: number;
    occupancyRate: number;
  };
  realTime: RealTimeMetrics; // ✅ CORREÇÃO: Usando a interface correta
  financial: {
    revenue: RevenueAnalytics;
    growth: number;
    projections: RevenueProjection[];
  };
  operational: {
    appointments: AppointmentMetrics;
    employees: EmployeePerformance[];
    efficiency: number;
  };
  customers: {
    analytics: CustomerAnalytics;
    segmentation: CustomerSegment[];
    satisfaction: number;
  };
  intelligence: {
    kpis: {
      customerLifetimeValue: number;
      churnRate: number;
      acquisitionCost: number;
      employeeProductivity: number;
    };
    trends: {
      revenueGrowth: number;
      customerGrowth: number;
      appointmentTrend: TrendData[];
    };
    predictions: {
      revenueProjections: RevenueProjection[];
      demandPrediction: DemandPrediction;
      growthOpportunities: GrowthOpportunity[];
    };
  };
  alerts: SystemAlert[];
  timestamp: string;
}

// ✅ ADICIONE ESTA INTERFACE QUE ESTAVA FALTANDO
export interface RealTimeMetrics {
  liveAppointments: number;
  todayRevenue: number;
  activeEmployees: number;
  systemHealth: Record<string, boolean>;
  lastUpdated: string;
}

export interface RevenueAnalytics {
  totalRevenue: number;
  todayRevenue: number;
  revenueByService: RevenueByService[];
  revenueBySalon: RevenueBySalon[];
  revenueTrend: RevenueTrend[];
}

export interface RevenueByService {
  serviceId: string;
  serviceName: string;
  revenue: number;
  percentage: number;
  appointments: number;
}

export interface RevenueBySalon {
  salonId: string;
  salonName: string;
  revenue: number;
  percentage: number;
  appointments: number;
}

export interface RevenueTrend {
  period: string;
  revenue: number;
  growth: number;
  appointments: number;
}

export interface RevenueProjection {
  month: string;
  predictedRevenue: number;
  confidence: number;
}

export interface AppointmentMetrics {
  total: number;
  completed: number;
  cancelled: number;
  noShow: number;
  revenue: number;
  averageTicket: number;
  conversionRate: number;
  averageDuration: number;
  averageRating: number;
  occupancyRate: number;
}

export interface EmployeePerformance {
  employeeId: string;
  employeeName: string;
  totalAppointments: number;
  completedAppointments: number;
  revenue: number;
  averageRating: number;
  productivity?: number;
}

export interface CustomerAnalytics {
  totalCustomers: number;
  newCustomers: number;
  returningCustomers: number;
  lostCustomers: number;
  averageRevenuePerCustomer: number;
  customerSegmentation: CustomerSegment[];
  averageRating?: number;
  satisfactionRate?: number;
}

export interface CustomerSegment {
  segment: string;
  count: number;
  percentage: number;
  averageRevenue: number;
}

export interface TrendData {
  period: string;
  value: number;
  growth: number;
}

export interface DemandPrediction {
  nextWeek: number;
  nextMonth: number;
  peakHours: string[];
}

export interface GrowthOpportunity {
  type: string;
  title: string;
  description: string;
  potentialImpact: 'high' | 'medium' | 'low';
}
// src/types/analytics.ts - ADICIONE ESTA INTERFACE

export interface BusinessIntelligence {
  kpis: {
    customerLifetimeValue: number;
    churnRate: number;
    acquisitionCost: number;
    employeeProductivity: number;
  };
  trends: {
    revenueGrowth: number;
    customerGrowth: number;
    appointmentTrend: TrendData[];
  };
  predictions: {
    revenueProjections: RevenueProjection[];
    demandPrediction: DemandPrediction;
    growthOpportunities: GrowthOpportunity[];
  };
}
export interface SystemAlert {
  id: number;
  type: 'performance' | 'revenue' | 'operational' | 'system';
  severity: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: string;
  salonId?: string;
}

// ✅ ADICIONE TAMBÉM ESTA INTERFACE PARA SERVICE HEALTH
export interface ServiceHealthStatus {
  [key: string]: boolean;
}
