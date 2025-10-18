// src/types/route-types.ts

// ✅ TIPOS CENTRALIZADOS PARA ROTAS
export enum UserMainRole {
  CLIENT = 'client',
  EMPLOYEE = 'employee', 
  ADMINSYSTEM = 'admin_system'
}

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH'
}

export interface ApiEndpoint {
  path: string;
  method: HttpMethod;
  description: string;
  requiresAuth?: boolean;
  rateLimited?: boolean;
}

export interface RoleEndpoints {
  register: ApiEndpoint;
  profile: ApiEndpoint;
  updateProfile: ApiEndpoint;
  preferences?: ApiEndpoint;
}

export interface ApiRouteConfig {
  // 🔐 AUTENTICAÇÃO
  auth: {
    login: ApiEndpoint;
    register: ApiEndpoint;
    refreshToken: ApiEndpoint;
    logout: ApiEndpoint;
    forgotPassword: ApiEndpoint;
    resetPassword: ApiEndpoint;
    checkEmail: ApiEndpoint;
    checkEmailCached: ApiEndpoint;
  };
  
  // 📧 EMAIL - ADICIONADO!
  email: {
    checkEmailCached: ApiEndpoint;
    checkEmail: ApiEndpoint;
  };
  
  // 📱 OTP
  otp: {
    send: ApiEndpoint;
    verify: ApiEndpoint;
    resend: ApiEndpoint;
  };
  
  // 👥 USUÁRIOS
  users: {
    clients: RoleEndpoints;
    employees: RoleEndpoints;
    admins: RoleEndpoints;
  };
  
  // 🔔 NOTIFICAÇÕES
  notifications: {
    send: ApiEndpoint;
    sendBulk: ApiEndpoint;
    history: ApiEndpoint;
    preferences: ApiEndpoint;
    templates: ApiEndpoint;
    analytics: ApiEndpoint;
    stats: ApiEndpoint;
    health: ApiEndpoint;
  };
  
  // 🩺 DIAGNÓSTICO
  diagnostic: {
    gatewayRoutes: ApiEndpoint;
    gatewayStatus: ApiEndpoint;
    gatewayPerformance: ApiEndpoint;
    gatewayConfig: ApiEndpoint;
    health: ApiEndpoint;
  };
  
  // 🏥 HEALTH
  health: {
    userService: ApiEndpoint;
    servicesHealth: ApiEndpoint;
    serviceHealth: ApiEndpoint;
    servicesStatus: ApiEndpoint;
  };
  
  // 🧪 TESTES
  test: {
    connection: ApiEndpoint;
    microservicesConnection: ApiEndpoint;
    authServiceConnection: ApiEndpoint;
    performance: ApiEndpoint;
  };
  
  // 📡 PING
  ping: {
    users: ApiEndpoint;
    scheduling: ApiEndpoint;
    employees: ApiEndpoint;
    salons: ApiEndpoint;
    payments: ApiEndpoint;
    analytics: ApiEndpoint;
    notifications: ApiEndpoint;
    admin: ApiEndpoint;
    all: ApiEndpoint;
  };
}

// ✅ TIPOS PARA AS CHAVES (ATUALIZADO COM EMAIL)
export type AuthRouteKey = keyof ApiRouteConfig['auth'];
export type EmailRouteKey = keyof ApiRouteConfig['email']; // ✅ NOVO!
export type OtpRouteKey = keyof ApiRouteConfig['otp'];
export type NotificationRouteKey = keyof ApiRouteConfig['notifications'];
export type DiagnosticRouteKey = keyof ApiRouteConfig['diagnostic'];
export type HealthRouteKey = keyof ApiRouteConfig['health'];
export type TestRouteKey = keyof ApiRouteConfig['test'];
export type PingRouteKey = keyof ApiRouteConfig['ping'];
export type RoleEndpointKey = keyof RoleEndpoints;