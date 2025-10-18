// src/boot/api-routes.ts
import type {
  ApiRouteConfig,
  ApiEndpoint,
  RoleEndpoints,
  AuthRouteKey,
  OtpRouteKey,
  NotificationRouteKey,
  DiagnosticRouteKey,
  HealthRouteKey,
  TestRouteKey,
  PingRouteKey,
  RoleEndpointKey,
} from '../types/route-types';
import { HttpMethod, UserMainRole } from '../types/route-types';

// ✅ CONFIGURAÇÃO CENTRALIZADA DE TODAS AS ROTAS - ATUALIZADA PARA MINÚSCULAS
export const API_ROUTES: ApiRouteConfig = {
  // 🔐 AUTENTICAÇÃO - ATUALIZADO PARA MINÚSCULAS
  auth: {
    login: {
      path: '/api/auth/login',  // ✅ 'auth' minúsculo
      method: HttpMethod.POST,
      description: 'Login de usuário',
      rateLimited: true,
    },
    register: {
      path: '/api/auth/register',  // ✅ 'auth' minúsculo
      method: HttpMethod.POST,
      description: 'Registro de usuário',
      rateLimited: true,
    },
    refreshToken: {
      path: '/api/auth/refresh-token',  // ✅ 'auth' minúsculo
      method: HttpMethod.POST,
      description: 'Refresh token',
      requiresAuth: true,
    },
    logout: {
      path: '/api/auth/logout',  // ✅ 'auth' minúsculo
      method: HttpMethod.POST,
      description: 'Logout',
      requiresAuth: true,
    },
    forgotPassword: {
      path: '/api/auth/forgot-password',  // ✅ 'auth' minúsculo
      method: HttpMethod.POST,
      description: 'Solicitar reset de senha',
      rateLimited: true,
    },
    resetPassword: {
      path: '/api/auth/reset-password',  // ✅ 'auth' minúsculo
      method: HttpMethod.POST,
      description: 'Confirmar reset de senha',
    },
    checkEmail: {
      path: '/api/auth/check-email',  // ✅ 'auth' minúsculo
      method: HttpMethod.POST,
      description: 'Verificar email',
      rateLimited: true,
    },
    checkEmailCached: {
      path: '/api/auth/check-email-cached',  // ✅ 'auth' minúsculo
      method: HttpMethod.POST,
      description: 'Verificar email com cache',
      rateLimited: true,
    },
  },

  // 📧 EMAIL - NOVO! (baseado na sua organização)
  email: {
    checkEmailCached: {
      path: '/api/email/check-email-cached',  // ✅ 'email' minúsculo
      method: HttpMethod.POST,
      description: 'Verificar email com cache',
      rateLimited: true,
    },
    checkEmail: {
      path: '/api/email/check-email',  // ✅ 'email' minúsculo
      method: HttpMethod.POST,
      description: 'Verificar email simples',
      rateLimited: true,
    },
  },

  // 📱 OTP - ATUALIZADO PARA MINÚSCULAS
  otp: {
    send: {
      path: '/api/otp/send',  // ✅ 'otp' minúsculo
      method: HttpMethod.POST,
      description: 'Enviar código OTP',
      rateLimited: true,
    },
    verify: {
      path: '/api/otp/verify',  // ✅ 'otp' minúsculo
      method: HttpMethod.POST,
      description: 'Verificar código OTP',
    },
    resend: {
      path: '/api/otp/resend',  // ✅ 'otp' minúsculo
      method: HttpMethod.POST,
      description: 'Reenviar código OTP',
      rateLimited: true,
    },
  },

  // 👥 USUÁRIOS - ATUALIZADO PARA MINÚSCULAS
  users: {
    clients: {
      register: {
        path: '/api/users/clients/register',  // ✅ 'users' minúsculo
        method: HttpMethod.POST,
        description: 'Registro de cliente',
        rateLimited: true,
      },
      profile: {
        path: '/api/users/clients/profile',  // ✅ 'users' minúsculo
        method: HttpMethod.GET,
        description: 'Perfil do cliente',
        requiresAuth: true,
      },
      updateProfile: {
        path: '/api/users/clients/profile',  // ✅ 'users' minúsculo
        method: HttpMethod.PATCH,
        description: 'Atualizar perfil do cliente',
        requiresAuth: true,
      },
      preferences: {
        path: '/api/users/clients/preferences',  // ✅ 'users' minúsculo
        method: HttpMethod.PATCH,
        description: 'Preferências do cliente',
        requiresAuth: true,
      },
    },
    employees: {
      register: {
        path: '/api/users/employees/register',  // ✅ 'users' minúsculo
        method: HttpMethod.POST,
        description: 'Registro de funcionário',
        rateLimited: true,
      },
      profile: {
        path: '/api/users/employees/profile',  // ✅ 'users' minúsculo
        method: HttpMethod.GET,
        description: 'Perfil do funcionário',
        requiresAuth: true,
      },
      updateProfile: {
        path: '/api/users/employees/profile',  // ✅ 'users' minúsculo
        method: HttpMethod.PATCH,
        description: 'Atualizar perfil do funcionário',
        requiresAuth: true,
      },
    },
    admins: {
      register: {
        path: '/api/users/admins/register',  // ✅ 'users' minúsculo
        method: HttpMethod.POST,
        description: 'Registro de administrador',
        requiresAuth: true,
      },
      profile: {
        path: '/api/users/admins/profile',  // ✅ 'users' minúsculo
        method: HttpMethod.GET,
        description: 'Perfil do administrador',
        requiresAuth: true,
      },
      updateProfile: {
        path: '/api/users/admins/profile',  // ✅ 'users' minúsculo
        method: HttpMethod.PATCH,
        description: 'Atualizar perfil do administrador',
        requiresAuth: true,
      },
    },
  },

  // 🔔 NOTIFICAÇÕES - ATUALIZADO PARA MINÚSCULAS
  notifications: {
    send: {
      path: '/api/notifications/send',  // ✅ 'notifications' minúsculo
      method: HttpMethod.POST,
      description: 'Enviar notificação',
    },
    sendBulk: {
      path: '/api/notifications/send-bulk',  // ✅ 'notifications' minúsculo
      method: HttpMethod.POST,
      description: 'Enviar notificações em massa',
    },
    history: {
      path: '/api/notifications/history',  // ✅ 'notifications' minúsculo
      method: HttpMethod.GET,
      description: 'Histórico de notificações',
      requiresAuth: true,
    },
    preferences: {
      path: '/api/notifications/preferences',  // ✅ 'notifications' minúsculo
      method: HttpMethod.GET,
      description: 'Preferências de notificação',
      requiresAuth: true,
    },
    templates: {
      path: '/api/notifications/templates',  // ✅ 'notifications' minúsculo
      method: HttpMethod.GET,
      description: 'Templates de notificação',
    },
    analytics: {
      path: '/api/notifications/analytics',  // ✅ 'notifications' minúsculo
      method: HttpMethod.GET,
      description: 'Analytics de notificações',
      requiresAuth: true,
    },
    stats: {
      path: '/api/notifications/stats',  // ✅ 'notifications' minúsculo
      method: HttpMethod.GET,
      description: 'Estatísticas de notificações',
      requiresAuth: true,
    },
    health: {
      path: '/api/notifications/health',  // ✅ 'notifications' minúsculo
      method: HttpMethod.GET,
      description: 'Health check do serviço de notificações',
    },
  },

  // 🩺 DIAGNÓSTICO - ATUALIZADO PARA MINÚSCULAS
  diagnostic: {
    gatewayRoutes: {
      path: '/api/diagnostic/gateway-routes',  // ✅ 'diagnostic' minúsculo
      method: HttpMethod.GET,
      description: 'Listar rotas disponíveis no gateway',
    },
    gatewayStatus: {
      path: '/api/diagnostic/gateway-status',  // ✅ 'diagnostic' minúsculo
      method: HttpMethod.GET,
      description: 'Status do gateway',
    },
    gatewayPerformance: {
      path: '/api/diagnostic/gateway-performance',  // ✅ 'diagnostic' minúsculo
      method: HttpMethod.GET,
      description: 'Performance do gateway',
    },
    gatewayConfig: {
      path: '/api/diagnostic/gateway-config',  // ✅ 'diagnostic' minúsculo
      method: HttpMethod.GET,
      description: 'Configuração do gateway',
    },
    health: {
      path: '/api/diagnostic/health',  // ✅ 'diagnostic' minúsculo
      method: HttpMethod.GET,
      description: 'Health check do gateway',
    },
  },

  // 🏥 HEALTH - ATUALIZADO PARA MINÚSCULAS
  health: {
    userService: {
      path: '/api/health/user-service',  // ✅ 'health' minúsculo
      method: HttpMethod.GET,
      description: 'Health check do user service',
    },
    servicesHealth: {
      path: '/api/health/services',  // ✅ 'health' minúsculo
      method: HttpMethod.GET,
      description: 'Health check de todos os serviços',
    },
    serviceHealth: {
      path: '/api/health/services/:serviceName',  // ✅ 'health' minúsculo
      method: HttpMethod.GET,
      description: 'Health check de serviço específico',
    },
    servicesStatus: {
      path: '/api/health/status',  // ✅ 'health' minúsculo
      method: HttpMethod.GET,
      description: 'Status resumido dos serviços',
    },
  },

  // 🧪 TESTES - ATUALIZADO PARA MINÚSCULAS
  test: {
    connection: {
      path: '/api/test/connection',  // ✅ 'test' minúsculo
      method: HttpMethod.GET,
      description: 'Teste de conexão básica',
    },
    microservicesConnection: {
      path: '/api/test/microservices-connection',  // ✅ 'test' minúsculo
      method: HttpMethod.GET,
      description: 'Teste de conexão com todos microserviços',
    },
    authServiceConnection: {
      path: '/api/test/auth-service-connection',  // ✅ 'test' minúsculo
      method: HttpMethod.GET,
      description: 'Teste de conexão com auth service',
    },
    performance: {
      path: '/api/test/performance',  // ✅ 'test' minúsculo
      method: HttpMethod.GET,
      description: 'Teste de performance',
    },
  },

  // 📡 PING - ATUALIZADO PARA MINÚSCULAS
  ping: {
    users: {
      path: '/api/ping/users',  // ✅ 'ping' minúsculo
      method: HttpMethod.GET,
      description: 'Ping para user service',
    },
    scheduling: {
      path: '/api/ping/scheduling',  // ✅ 'ping' minúsculo
      method: HttpMethod.GET,
      description: 'Ping para scheduling service',
    },
    employees: {
      path: '/api/ping/employees',  // ✅ 'ping' minúsculo
      method: HttpMethod.GET,
      description: 'Ping para employees service',
    },
    salons: {
      path: '/api/ping/salons',  // ✅ 'ping' minúsculo
      method: HttpMethod.GET,
      description: 'Ping para salons service',
    },
    payments: {
      path: '/api/ping/payments',  // ✅ 'ping' minúsculo
      method: HttpMethod.GET,
      description: 'Ping para payments service',
    },
    analytics: {
      path: '/api/ping/analytics',  // ✅ 'ping' minúsculo
      method: HttpMethod.GET,
      description: 'Ping para analytics service',
    },
    notifications: {
      path: '/api/ping/notifications',  // ✅ 'ping' minúsculo
      method: HttpMethod.GET,
      description: 'Ping para notifications service',
    },
    admin: {
      path: '/api/ping/admin',  // ✅ 'ping' minúsculo
      method: HttpMethod.GET,
      description: 'Ping para admin service',
    },
    all: {
      path: '/api/ping/all',  // ✅ 'ping' minúsculo
      method: HttpMethod.GET,
      description: 'Ping para todos os serviços',
    },
  },
};

// ✅ ATUALIZAR OS TYPES NO route-types.ts
// Adicione esta interface no seu arquivo route-types.ts:
/*
export interface ApiRouteConfig {
  // ... outros
  email: {
    checkEmailCached: ApiEndpoint;
    checkEmail: ApiEndpoint;
  };
  // ... outros
}

export type EmailRouteKey = keyof ApiRouteConfig['email'];
*/

// ✅ HELPER FUNCTIONS - ATUALIZADO COM EMAIL
export class RouteMapper {
  // 🔐 AUTH
  static getAuthEndpoint(key: AuthRouteKey): ApiEndpoint {
    const endpoint = API_ROUTES.auth[key];
    if (!endpoint) {
      throw new Error(`Auth endpoint '${String(key)}' não encontrado`);
    }
    return endpoint;
  }

  // 📧 EMAIL - NOVO!
  static getEmailEndpoint(key: keyof ApiRouteConfig['email']): ApiEndpoint {
    const endpoint = API_ROUTES.email[key];
    if (!endpoint) {
      throw new Error(`Email endpoint '${String(key)}' não encontrado`);
    }
    return endpoint;
  }

  // 📱 OTP
  static getOtpEndpoint(key: OtpRouteKey): ApiEndpoint {
    const endpoint = API_ROUTES.otp[key];
    if (!endpoint) {
      throw new Error(`OTP endpoint '${String(key)}' não encontrado`);
    }
    return endpoint;
  }

  // 👥 USUÁRIOS
  static getUserEndpoint(role: UserMainRole, key: RoleEndpointKey): ApiEndpoint {
    const roleMap: Record<UserMainRole, RoleEndpoints> = {
      [UserMainRole.CLIENT]: API_ROUTES.users.clients,
      [UserMainRole.EMPLOYEE]: API_ROUTES.users.employees,
      [UserMainRole.ADMINSYSTEM]: API_ROUTES.users.admins,
    };

    const roleEndpoints = roleMap[role];
    if (!roleEndpoints) {
      throw new Error(`Role '${role}' não encontrada`);
    }

    const endpoint = roleEndpoints[key];
    if (!endpoint) {
      throw new Error(`Endpoint '${String(key)}' não encontrado para role '${role}'`);
    }

    return endpoint;
  }

  // 🔔 NOTIFICAÇÕES
  static getNotificationEndpoint(key: NotificationRouteKey): ApiEndpoint {
    const endpoint = API_ROUTES.notifications[key];
    if (!endpoint) {
      throw new Error(`Notification endpoint '${String(key)}' não encontrado`);
    }
    return endpoint;
  }

  // 🩺 DIAGNÓSTICO
  static getDiagnosticEndpoint(key: DiagnosticRouteKey): ApiEndpoint {
    const endpoint = API_ROUTES.diagnostic[key];
    if (!endpoint) {
      throw new Error(`Diagnostic endpoint '${String(key)}' não encontrado`);
    }
    return endpoint;
  }

  // 🏥 HEALTH
  static getHealthEndpoint(key: HealthRouteKey): ApiEndpoint {
    const endpoint = API_ROUTES.health[key];
    if (!endpoint) {
      throw new Error(`Health endpoint '${String(key)}' não encontrado`);
    }
    return endpoint;
  }

  // 🧪 TESTES
  static getTestEndpoint(key: TestRouteKey): ApiEndpoint {
    const endpoint = API_ROUTES.test[key];
    if (!endpoint) {
      throw new Error(`Test endpoint '${String(key)}' não encontrado`);
    }
    return endpoint;
  }

  // 📡 PING
  static getPingEndpoint(key: PingRouteKey): ApiEndpoint {
    const endpoint = API_ROUTES.ping[key];
    if (!endpoint) {
      throw new Error(`Ping endpoint '${String(key)}' não encontrado`);
    }
    return endpoint;
  }

  // 🌐 URL COMPLETA
  static buildUrl(endpoint: ApiEndpoint, params?: Record<string, string>): string {
    let url = endpoint.path;

    if (params) {
      Object.keys(params).forEach((key) => {
        const value = params[key];
        if (value) {
          url = url.replace(`:${key}`, value);
        }
      });
    }

    return url;
  }

  // ✅ MÉTODO PARA OBTER MÉTODO HTTP
  static getMethod(endpoint: ApiEndpoint): HttpMethod {
    return endpoint.method;
  }

  // ✅ MÉTODO PARA VERIFICAR SE REQUER AUTENTICAÇÃO
  static requiresAuth(endpoint: ApiEndpoint): boolean {
    return endpoint.requiresAuth || false;
  }

  // ✅ MÉTODO PARA VERIFICAR SE TEM RATE LIMITING
  static isRateLimited(endpoint: ApiEndpoint): boolean {
    return endpoint.rateLimited || false;
  }
}