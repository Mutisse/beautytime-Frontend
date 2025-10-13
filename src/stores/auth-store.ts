import { defineStore } from 'pinia';
import { api } from 'boot/axios';
import { useRouter } from 'vue-router';
import {
  UserMainRole,
  type RegisterPayload,
  type LoginCredentials,
  type UserName,
  type ApiResponse,
  type UserData,
  type AuthResponseData,
  type OtpVerificationPayload,
  type OtpRequestPayload,
  type AuthState,
  type Tokens,
  type UserSubRoleType,
} from '../types/auth-Types';

// ✅ SERVICE MAPPER - ROTAS ESPECÍFICAS POR ROLE
class ApiServiceMapper {
  // 🎯 ROTAS DE REGISTRO - CADA TIPO TEM SUA PRÓPRIA ROTA
  static getRegisterEndpoint(role: UserMainRole): string {
    const registerPaths = {
      [UserMainRole.CLIENT]: '/clients/register',
      [UserMainRole.EMPLOYEE]: '/employees/register',
      [UserMainRole.ADMINSYSTEM]: '/admins/register',
    };

    return `/api${registerPaths[role]}`;
  }

  // 🎯 ROTAS DE LOGIN - AUTENTICAÇÃO GERAL
  static getLoginEndpoint(): string {
    return '/api/auth/login';
  }

  // 🎯 ROTAS DE OTP
  static getOtpEndpoint(action: 'send' | 'verify' | 'resend'): string {
    const otpPaths = {
      send: '/otp/send',
      verify: '/otp/verify',
      resend: '/otp/resend',
    };
    return `/api${otpPaths[action]}`;
  }

  // 🎯 ROTAS DE PERFIL
  static getProfileEndpoint(role: UserMainRole): string {
    const profilePaths = {
      [UserMainRole.CLIENT]: '/clients/profile',
      [UserMainRole.EMPLOYEE]: '/employees/profile',
      [UserMainRole.ADMINSYSTEM]: '/admins/profile',
    };
    return `/api${profilePaths[role]}`;
  }

  // 🎯 ROTAS DE MUDANÇA DE SENHA
  static getChangePasswordEndpoint(role: UserMainRole): string {
    const passwordPaths = {
      [UserMainRole.CLIENT]: '/clients/change-password',
      [UserMainRole.EMPLOYEE]: '/employees/change-password',
      [UserMainRole.ADMINSYSTEM]: '/admins/change-password',
    };
    return `/api${passwordPaths[role]}`;
  }
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    tokens: {
      accessToken: null,
      refreshToken: null,
    },
    isLoading: false,
    isInitialized: false,
  }),

  actions: {
    // ✅ MÉTODOS AUXILIARES
    detectUserRole(email: string): UserMainRole {
      const emailLower = email.toLowerCase();
      if (emailLower.includes('admin') || emailLower.includes('system')) {
        return UserMainRole.ADMINSYSTEM;
      }
      if (
        emailLower.includes('employee') ||
        emailLower.includes('staff') ||
        emailLower.includes('funcionario')
      ) {
        return UserMainRole.EMPLOYEE;
      }
      return UserMainRole.CLIENT;
    },

    // ✅ REGISTRO
    async register(payload: RegisterPayload): Promise<AuthResponseData> {
      try {
        this.isLoading = true;
        console.log('📝 Iniciando registro para:', payload.email);

        // 1. Primeiro envia OTP
        await this.requestOtp({
          email: payload.email,
          purpose: 'registration',
          name: `${payload.firstName} ${payload.lastName}`,
        });

        // 2. Se OTP foi enviado, completa registro
        return await this.completeRegistration(payload);
      } catch (error: unknown) {
        console.error('❌ Registration error:', error);
        const errorMessage =
          error instanceof Error ? error.message : 'Erro desconhecido no registro';
        throw new Error(errorMessage);
      } finally {
        this.isLoading = false;
      }
    },

    // ✅ COMPLETAR REGISTRO
    async completeRegistration(payload: RegisterPayload): Promise<AuthResponseData> {
      try {
        this.isLoading = true;

        // 🎯 DADOS PARA REGISTRO
        const registerData = {
          fullName: {
            firstName: payload.firstName.trim(),
            lastName: payload.lastName.trim(),
          },
          email: payload.email.trim(),
          password: payload.password,
          phoneNumber: payload.phone,
          ...(payload.role === UserMainRole.EMPLOYEE &&
            payload.subRole && {
              subRole: payload.subRole,
            }),
        };

        // 🎯 USA ROTA ESPECÍFICA DO TIPO DE USUÁRIO
        const endpoint = ApiServiceMapper.getRegisterEndpoint(payload.role);

        console.log('🚀 Enviando registro para:', endpoint, 'com dados:', registerData);

        const response = await api.post<ApiResponse<AuthResponseData>>(endpoint, registerData);

        if (!response.data.success) {
          throw new Error(response.data.error || 'Erro no registro');
        }

        const responseData = response.data.data;
        if (!responseData) {
          throw new Error('Dados de resposta não encontrados');
        }

        // ✅ SALVA TOKENS E USUÁRIO
        this.tokens.accessToken = responseData.accessToken;
        this.tokens.refreshToken = responseData.refreshToken || null;
        this.user = responseData.user;

        this.saveToStorage();

        // ✅ CONFIGURA HEADER DE AUTORIZAÇÃO
        if (responseData.accessToken) {
          api.defaults.headers.common['Authorization'] = `Bearer ${responseData.accessToken}`;
        }

        console.log('✅ Registro realizado com sucesso');
        return responseData;
      } catch (error: unknown) {
        console.error('❌ Complete registration error:', error);
        const errorMessage =
          error instanceof Error ? error.message : 'Erro desconhecido no registro';
        throw new Error(errorMessage);
      } finally {
        this.isLoading = false;
      }
    },

    // ✅ LOGIN
    async login(credentials: LoginCredentials): Promise<AuthResponseData> {
      try {
        this.isLoading = true;
        console.log('🔐 Tentando login para:', credentials.email);

        const endpoint = ApiServiceMapper.getLoginEndpoint();

        console.log('🚀 Enviando login para:', endpoint);
        const response = await api.post<ApiResponse<AuthResponseData>>(endpoint, {
          email: credentials.email,
          password: credentials.password,
        });

        if (!response.data.success) {
          throw new Error(response.data.error || 'Erro no login');
        }

        const responseData = response.data.data;
        if (!responseData) {
          throw new Error('Dados de resposta não encontrados');
        }

        this.tokens.accessToken = responseData.accessToken;
        this.tokens.refreshToken = responseData.refreshToken || null;
        this.user = responseData.user;

        this.saveToStorage();

        if (responseData.accessToken) {
          api.defaults.headers.common['Authorization'] = `Bearer ${responseData.accessToken}`;
        }

        console.log('✅ Login realizado com sucesso');
        return responseData;
      } catch (error: unknown) {
        console.error('❌ Login error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido no login';
        throw new Error(errorMessage);
      } finally {
        this.isLoading = false;
      }
    },

    // ✅ OTP METHODS
    async requestOtp(payload: OtpRequestPayload): Promise<{ sent: boolean }> {
      try {
        const endpoint = ApiServiceMapper.getOtpEndpoint('send');
        console.log('📤 Enviando OTP para:', endpoint);

        const response = await api.post<ApiResponse<{ sent: boolean }>>(endpoint, payload);

        if (!response.data.success) {
          throw new Error(response.data.error || 'Erro ao enviar OTP');
        }

        if (!response.data.data) {
          throw new Error('Dados de OTP não encontrados');
        }

        console.log('✅ OTP enviado com sucesso');
        return response.data.data;
      } catch (error: unknown) {
        console.error('❌ OTP request error:', error);

        if (error instanceof Error && error.message.includes('404')) {
          throw new Error(
            'Serviço de OTP temporariamente indisponível. Tente novamente em alguns instantes.',
          );
        }

        const errorMessage =
          error instanceof Error ? error.message : 'Erro ao enviar código de verificação';
        throw new Error(errorMessage);
      }
    },

    async verifyOtp(payload: OtpVerificationPayload): Promise<{ verified: boolean }> {
      try {
        const endpoint = ApiServiceMapper.getOtpEndpoint('verify');
        console.log('✅ Verificando OTP via:', endpoint);

        const response = await api.post<ApiResponse<{ verified: boolean }>>(endpoint, payload);

        if (!response.data.success) {
          throw new Error(response.data.error || 'Erro na verificação OTP');
        }

        if (!response.data.data) {
          throw new Error('Dados de verificação não encontrados');
        }

        console.log('✅ OTP verificado com sucesso');
        return response.data.data;
      } catch (error: unknown) {
        console.error('❌ OTP verification error:', error);
        const errorMessage =
          error instanceof Error ? error.message : 'Erro desconhecido na verificação';
        throw new Error(errorMessage);
      }
    },

    async resendOtp(payload: { email: string; name?: string }): Promise<{ sent: boolean }> {
      try {
        const endpoint = ApiServiceMapper.getOtpEndpoint('resend');
        console.log('🔄 Reenviando OTP via:', endpoint);

        const response = await api.post<ApiResponse<{ sent: boolean }>>(endpoint, payload);

        if (!response.data.success) {
          throw new Error(response.data.error || 'Erro ao reenviar OTP');
        }

        if (!response.data.data) {
          throw new Error('Dados de reenvio não encontrados');
        }

        console.log('✅ OTP reenviado com sucesso');
        return response.data.data;
      } catch (error: unknown) {
        console.error('❌ OTP resend error:', error);
        const errorMessage =
          error instanceof Error ? error.message : 'Erro desconhecido ao reenviar';
        throw new Error(errorMessage);
      }
    },

    // ✅ MÉTODOS DE PERFIL
    async fetchCurrentUser(): Promise<void> {
      try {
        if (!this.tokens.accessToken) {
          throw new Error('Token de acesso não encontrado');
        }

        if (this.user && this.isInitialized) {
          return;
        }

        if (!this.user?.role) {
          throw new Error('Role do usuário não definida');
        }

        const endpoint = ApiServiceMapper.getProfileEndpoint(this.user.role);

        console.log('👤 Buscando usuário via:', endpoint);
        const response = await api.get<ApiResponse<UserData>>(endpoint);

        if (!response.data.success) {
          throw new Error(response.data.error || 'Erro ao buscar usuário');
        }

        if (!response.data.data) {
          throw new Error('Dados do usuário não encontrados');
        }

        this.user = response.data.data;
        this.isInitialized = true;
        this.saveToStorage();

        console.log('✅ Usuário carregado com sucesso');
      } catch (error: unknown) {
        console.error('❌ Failed to fetch current user:', error);
        if (error instanceof Error && error.message.includes('401')) {
          await this.logout();
        }
        throw error;
      }
    },

    // ✅ ATUALIZAR PERFIL
    async updateProfile(
      profileData: Partial<{
        fullName: UserName;
        phoneNumber: string;
        profileImage: string;
      }>,
    ): Promise<UserData> {
      try {
        this.isLoading = true;

        if (!this.user?.role) {
          throw new Error('Role do usuário não definida');
        }

        const endpoint = ApiServiceMapper.getProfileEndpoint(this.user.role);

        console.log('✏️ Atualizando perfil via:', endpoint);
        const response = await api.patch<ApiResponse<UserData>>(endpoint, profileData);

        if (!response.data.success) {
          throw new Error(response.data.error || 'Erro ao atualizar perfil');
        }

        if (!response.data.data) {
          throw new Error('Dados atualizados não encontrados');
        }

        this.user = response.data.data;
        this.saveToStorage();

        console.log('✅ Perfil atualizado com sucesso');
        return response.data.data;
      } catch (error: unknown) {
        console.error('❌ Update profile error:', error);
        const errorMessage =
          error instanceof Error ? error.message : 'Erro desconhecido ao atualizar perfil';
        throw new Error(errorMessage);
      } finally {
        this.isLoading = false;
      }
    },

    // ✅ ALTERAR SENHA
    async changePassword(passwordData: {
      currentPassword: string;
      newPassword: string;
    }): Promise<{ success: boolean }> {
      try {
        this.isLoading = true;

        if (!this.user?.role) {
          throw new Error('Role do usuário não definida');
        }

        const endpoint = ApiServiceMapper.getChangePasswordEndpoint(this.user.role);

        console.log('🔒 Alterando senha via:', endpoint);
        const response = await api.post<ApiResponse<{ success: boolean }>>(endpoint, passwordData);

        if (!response.data.success) {
          throw new Error(response.data.error || 'Erro ao alterar senha');
        }

        if (!response.data.data) {
          throw new Error('Dados de resposta não encontrados');
        }

        console.log('✅ Senha alterada com sucesso');
        return response.data.data;
      } catch (error: unknown) {
        console.error('❌ Change password error:', error);
        const errorMessage =
          error instanceof Error ? error.message : 'Erro desconhecido ao alterar senha';
        throw new Error(errorMessage);
      } finally {
        this.isLoading = false;
      }
    },

    // ✅ REFRESH TOKEN
    async refreshToken(): Promise<Tokens> {
      try {
        if (!this.tokens.refreshToken) {
          throw new Error('Refresh token não disponível');
        }

        console.log('🔄 Renovando token...');
        const response = await api.post<ApiResponse<Tokens>>('/api/auth/refresh-token', {
          refreshToken: this.tokens.refreshToken,
        });

        if (!response.data.success) {
          throw new Error(response.data.error || 'Erro ao renovar token');
        }

        if (!response.data.data) {
          throw new Error('Dados de token não encontrados');
        }

        const tokens = response.data.data;
        this.tokens.accessToken = tokens.accessToken;
        this.tokens.refreshToken = tokens.refreshToken || this.tokens.refreshToken;

        this.saveToStorage();
        api.defaults.headers.common['Authorization'] = `Bearer ${tokens.accessToken}`;

        console.log('✅ Token renovado com sucesso');
        return tokens;
      } catch (error: unknown) {
        console.error('❌ Refresh token error:', error);
        await this.logout();
        throw error;
      }
    },

    // ✅ LOGOUT
    async logout(): Promise<void> {
      try {
        if (this.tokens.accessToken) {
          try {
            await api.post('/api/auth/logout');
          } catch {
            console.warn('Logout endpoint not available, continuing with client-side logout');
          }
        }

        this.user = null;
        this.tokens = { accessToken: null, refreshToken: null };
        this.isInitialized = false;

        this.clearStorage();

        const router = useRouter();
        await router.push('/auth/login');

        console.log('✅ Logout realizado com sucesso');
      } catch {
        console.error('❌ Logout error');
        this.user = null;
        this.tokens = { accessToken: null, refreshToken: null };
        this.clearStorage();
      }
    },

    // ✅ MÉTODOS DE STORAGE
    loadFromStorage(): void {
      try {
        const stored = localStorage.getItem('auth-store');
        if (stored) {
          const parsed = JSON.parse(stored) as AuthState;
          this.user = parsed.user;
          this.tokens = parsed.tokens;
          this.isInitialized = parsed.isInitialized || false;

          if (this.tokens.accessToken) {
            api.defaults.headers.common['Authorization'] = `Bearer ${this.tokens.accessToken}`;
          }
        }
      } catch (error) {
        console.error('❌ Error loading from storage:', error);
        this.clearStorage();
      }
    },

    saveToStorage(): void {
      try {
        const storageData: AuthState = {
          user: this.user,
          tokens: this.tokens,
          isLoading: this.isLoading,
          isInitialized: this.isInitialized,
        };
        localStorage.setItem('auth-store', JSON.stringify(storageData));
      } catch (error) {
        console.error('❌ Error saving to storage:', error);
      }
    },

    clearStorage(): void {
      try {
        localStorage.removeItem('auth-store');
        sessionStorage.removeItem('auth-store');
        delete api.defaults.headers.common['Authorization'];
      } catch (error) {
        console.error('❌ Error clearing storage:', error);
      }
    },

    // ✅ INICIALIZAÇÃO
    async initialize(): Promise<void> {
      if (this.isInitialized) {
        return;
      }

      try {
        this.loadFromStorage();

        if (this.tokens.accessToken && this.user) {
          await this.fetchCurrentUser();
        }

        this.isInitialized = true;
      } catch (error: unknown) {
        console.error('❌ Store initialization error:', error);
        this.clearStorage();
        this.isInitialized = true;
      }
    },

    // ✅ RESET DE SENHA - SOLICITAÇÃO
    async requestPasswordReset(email: string): Promise<{ success: boolean; message: string }> {
      try {
        this.isLoading = true;
        console.log('📧 Solicitando reset de senha para:', email);

        const response = await api.post<ApiResponse<{ success: boolean; message: string }>>(
          '/api/auth/forgot-password',
          { email },
        );

        if (!response.data.success) {
          throw new Error(response.data.error || 'Erro ao solicitar reset de senha');
        }

        if (!response.data.data) {
          throw new Error('Dados de resposta não encontrados');
        }

        console.log('✅ Solicitação de reset de senha enviada com sucesso');
        return response.data.data;
      } catch (error: unknown) {
        console.error('❌ Password reset request error:', error);
        const errorMessage =
          error instanceof Error ? error.message : 'Erro ao solicitar reset de senha';
        throw new Error(errorMessage);
      } finally {
        this.isLoading = false;
      }
    },

    // ✅ RESET DE SENHA - CONFIRMAÇÃO
    async confirmPasswordReset(payload: {
      token: string;
      newPassword: string;
    }): Promise<{ success: boolean; message: string }> {
      try {
        this.isLoading = true;
        console.log('🔑 Confirmando reset de senha');

        const response = await api.post<ApiResponse<{ success: boolean; message: string }>>(
          '/api/auth/reset-password',
          payload,
        );

        if (!response.data.success) {
          throw new Error(response.data.error || 'Erro ao confirmar reset de senha');
        }

        if (!response.data.data) {
          throw new Error('Dados de resposta não encontrados');
        }

        console.log('✅ Reset de senha confirmado com sucesso');
        return response.data.data;
      } catch (error: unknown) {
        console.error('❌ Password reset confirmation error:', error);
        const errorMessage =
          error instanceof Error ? error.message : 'Erro ao confirmar reset de senha';
        throw new Error(errorMessage);
      } finally {
        this.isLoading = false;
      }
    },
  },

  getters: {
    isAuthenticated: (state): boolean => !!state.tokens.accessToken && !!state.user,
    currentUser: (state): UserData | null => state.user,
    userRole: (state): UserMainRole | undefined => state.user?.role,
    userSubRole: (state): UserSubRoleType => state.user?.subRole || undefined,
    isLoadingState: (state): boolean => state.isLoading,
    userFullName: (state): string => {
      if (!state.user?.fullName) return '';
      const { firstName, lastName } = state.user.fullName;
      return `${firstName} ${lastName}`.trim();
    },
    hasProfileImage: (state): boolean => !!state.user?.profileImage,
    userSubRoleString: (state): string | undefined => {
      if (!state.user?.subRole) return undefined;
      return state.user.subRole.toString();
    },
    isEmployeeWithSubRole: (state): boolean => {
      return state.user?.role === UserMainRole.EMPLOYEE && !!state.user?.subRole;
    },
  },
});
