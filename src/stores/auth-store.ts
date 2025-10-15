import { defineStore } from 'pinia';
import { api } from 'boot/axios';
import { useRouter } from 'vue-router';
import {
  UserMainRole,
  type RegisterPayload,
  type LoginCredentials,
  type ApiResponse,
  type UserData,
  type AuthResponseData,
  type OtpRequestPayload,
  type AuthState,
  type Tokens,
  type UserSubRoleType,
  type StartRegistrationResponse,
  type OtpVerificationResponse,
  type OtpResendResponse,
  type PasswordResetResponse,
  type OtpState,
} from '../types/auth-Types';

class ApiServiceMapper {
  static getRegisterEndpoint(role: UserMainRole): string {
    const registerPaths = {
      [UserMainRole.CLIENT]: '/Users/clients/register',
      [UserMainRole.EMPLOYEE]: '/Users/employees/register',
      [UserMainRole.ADMINSYSTEM]: '/Users/admins/register',
    };
    return `/api${registerPaths[role]}`;
  }

  static getOtpEndpoint(action: 'send' | 'verify' | 'resend'): string {
    const otpPaths = {
      send: '/OTP/send',
      verify: '/OTP/verify',
      resend: '/OTP/resend',
    };
    return `/api${otpPaths[action]}`;
  }

  static getLoginEndpoint(): string {
    return '/api/Auth/login';
  }

  static getRefreshTokenEndpoint(): string {
    return '/api/Auth/refresh-token';
  }

  static getLogoutEndpoint(): string {
    return '/api/Auth/logout';
  }

  static getProfileEndpoint(role: UserMainRole): string {
    const profilePaths = {
      [UserMainRole.CLIENT]: '/Users/clients/profile',
      [UserMainRole.EMPLOYEE]: '/Users/employees/profile',
      [UserMainRole.ADMINSYSTEM]: '/Users/admins/profile',
    };
    return `/api${profilePaths[role]}`;
  }

  static getForgotPasswordEndpoint(): string {
    return '/api/Auth/forgot-password';
  }

  static getResetPasswordEndpoint(): string {
    return '/api/Auth/reset-password';
  }

  static getCheckEmailEndpoint(): string {
    return '/api/Auth/check-email';
  }
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState & {
    otp: OtpState;
    pendingRegistration: RegisterPayload | null;
    isVerifyingOtp: boolean;
  } => ({
    user: null,
    tokens: {
      accessToken: null,
      refreshToken: null,
    },
    isLoading: false,
    isInitialized: false,
    otp: {
      email: null,
      isVerified: false,
      isSent: false,
      attempts: 0,
    },
    pendingRegistration: null,
    isVerifyingOtp: false,
  }),

  actions: {
    validateRegistrationData(payload: RegisterPayload): void {
      if (!payload.firstName?.trim() || !payload.lastName?.trim()) {
        throw new Error('Nome completo é obrigatório');
      }
      if (!payload.email?.trim()) {
        throw new Error('Email é obrigatório');
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(payload.email)) {
        throw new Error('Email inválido');
      }
      if (!payload.password || payload.password.length < 6) {
        throw new Error('Senha deve ter pelo menos 6 caracteres');
      }
      if (!payload.phone?.trim()) {
        throw new Error('Telefone é obrigatório');
      }
      if (!payload.acceptTerms) {
        throw new Error('É necessário aceitar os termos de uso');
      }
    },

    async checkEmailExists(email: string): Promise<boolean> {
      try {
        const endpoint = ApiServiceMapper.getCheckEmailEndpoint();
        const response = await api.post<ApiResponse<{ exists: boolean }>>(endpoint, { email });

        if (!response.data.success) {
          throw new Error(response.data.error || 'Erro ao verificar email');
        }

        return response.data.data?.exists || false;
      } catch (error: unknown) {
        if (error instanceof Error) {
          if (error.message.includes('404') || error.message.includes('Not Found')) {
            return false;
          }
          throw new Error('Erro ao verificar disponibilidade do email: ' + error.message);
        }
        throw new Error('Erro desconhecido ao verificar disponibilidade do email');
      }
    },

    async startRegistration(payload: RegisterPayload): Promise<StartRegistrationResponse> {
      try {
        this.isLoading = true;
        this.validateRegistrationData(payload);

        const emailExists = await this.checkEmailExists(payload.email);
        if (emailExists) {
          throw new Error('Este email já está registrado. Por favor, use outro email.');
        }

        this.pendingRegistration = payload;
        this.otp.email = payload.email;
        this.otp.isSent = true;
        this.otp.isVerified = false;
        this.otp.attempts = 0;
        this.isVerifyingOtp = false;

        return {
          requiresOtp: true,
          otpSent: true,
          message: 'Código de verificação enviado para seu email',
        };
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Erro ao iniciar registro';
        throw new Error(errorMessage);
      } finally {
        this.isLoading = false;
      }
    },

    async verifyOtpAndCompleteRegistration(otpCode: string): Promise<AuthResponseData> {
      if (this.isVerifyingOtp) {
        throw new Error('Verificação de OTP já em andamento. Aguarde...');
      }

      this.isVerifyingOtp = true;

      try {
        this.isLoading = true;

        if (!this.pendingRegistration) {
          throw new Error('Nenhum registro pendente encontrado');
        }

        if (!this.otp.email) {
          throw new Error('Email não encontrado para verificação');
        }

        const endpoint = ApiServiceMapper.getOtpEndpoint('verify');
        const verifyResponse = await api.post<ApiResponse<{ verified: boolean }>>(endpoint, {
          email: this.otp.email,
          otpCode: otpCode,
          purpose: 'registration',
        });

        if (!verifyResponse.data.success) {
          this.otp.attempts += 1;
          throw new Error(verifyResponse.data.error || 'Código de verificação inválido');
        }

        this.otp.isVerified = true;
        this.otp.attempts = 0;

        const result = await this.register(this.pendingRegistration);
        this.resetOtpState();

        return result;
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Erro ao completar registro';
        throw new Error(errorMessage);
      } finally {
        this.isLoading = false;
        this.isVerifyingOtp = false;
      }
    },

    async requestOtp(payload: OtpRequestPayload): Promise<{ sent: boolean }> {
      try {
        const endpoint = ApiServiceMapper.getOtpEndpoint('send');
        const response = await api.post<ApiResponse<{ sent: boolean }>>(endpoint, {
          email: payload.email,
          purpose: payload.purpose,
          ...(payload.name && { name: payload.name }),
        });

        if (!response.data.success) {
          throw new Error(response.data.error || 'Erro ao enviar OTP');
        }

        return response.data.data || { sent: true };
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : 'Erro ao enviar código de verificação';
        throw new Error(errorMessage);
      }
    },

    async verifyOtp(payload: { email: string; code: string }): Promise<OtpVerificationResponse> {
      if (this.isVerifyingOtp) {
        return {
          verified: false,
          message: 'Verificação de OTP já em andamento',
        };
      }

      this.isVerifyingOtp = true;

      try {
        const endpoint = ApiServiceMapper.getOtpEndpoint('verify');
        const requestData = {
          email: payload.email,
          otpCode: payload.code,
          purpose: 'registration',
        };

        const response = await api.post<ApiResponse<{ verified: boolean }>>(endpoint, requestData);

        if (!response.data.success) {
          this.otp.attempts += 1;
          throw new Error(response.data.error || 'Código OTP inválido');
        }

        this.otp.isVerified = true;
        this.otp.attempts = 0;

        return {
          verified: true,
          message: 'Código verificado com sucesso',
        };
      } catch (error: unknown) {
        let errorMessage = 'Erro na verificação do código';
        if (error instanceof Error) {
          if (error.message.includes('400')) {
            errorMessage = 'Código OTP inválido ou expirado';
          } else if (error.message.includes('404')) {
            errorMessage = 'Serviço de verificação indisponível';
          } else {
            errorMessage = error.message;
          }
        }

        return {
          verified: false,
          message: errorMessage,
        };
      } finally {
        this.isVerifyingOtp = false;
      }
    },

    async register(payload: RegisterPayload): Promise<AuthResponseData> {
      try {
        this.isLoading = true;

        if (!payload.firstName?.trim() || !payload.lastName?.trim()) {
          throw new Error('Nome completo é obrigatório');
        }
        if (!payload.email?.trim()) {
          throw new Error('Email é obrigatório');
        }
        if (!payload.password) {
          throw new Error('Senha é obrigatória');
        }
        if (!payload.phone?.trim()) {
          throw new Error('Telefone é obrigatório');
        }
        if (!payload.acceptTerms) {
          throw new Error('É necessário aceitar os termos de uso');
        }

        const registerData = {
          fullName: {
            firstName: payload.firstName.trim(),
            lastName: payload.lastName.trim(),
          },
          email: payload.email.trim(),
          password: payload.password,
          phone: payload.phone,
          acceptTerms: payload.acceptTerms,
          ...(payload.role === UserMainRole.EMPLOYEE &&
            payload.subRole && {
              subRole: payload.subRole,
            }),
        };

        const endpoint = ApiServiceMapper.getRegisterEndpoint(payload.role);
        const response = await api.post<ApiResponse<AuthResponseData>>(endpoint, registerData);

        if (!response.data.success) {
          throw new Error(response.data.error || 'Erro no registro');
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

        return responseData;
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Erro ao realizar registro';
        throw new Error(errorMessage);
      } finally {
        this.isLoading = false;
      }
    },

    cancelRegistration(): void {
      this.resetOtpState();
      this.isVerifyingOtp = false;
    },

    async resendOtp(payload: { email: string }): Promise<OtpResendResponse> {
      try {
        const endpoint = ApiServiceMapper.getOtpEndpoint('resend');
        const response = await api.post<ApiResponse<{ sent: boolean }>>(endpoint, {
          email: payload.email,
          purpose: 'registration',
        });

        if (!response.data.success) {
          throw new Error(response.data.error || 'Erro ao reenviar OTP');
        }

        this.otp.isSent = true;
        this.otp.attempts = 0;
        this.isVerifyingOtp = false;

        return {
          sent: true,
          message: 'Código reenviado com sucesso',
        };
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Erro ao reenviar código';
        throw new Error(errorMessage);
      }
    },

    resetOtpState(): void {
      this.otp = {
        email: null,
        isVerified: false,
        isSent: false,
        attempts: 0,
      };
      this.pendingRegistration = null;
      this.isVerifyingOtp = false;
    },

    async login(credentials: LoginCredentials): Promise<AuthResponseData> {
      try {
        this.isLoading = true;
        const endpoint = ApiServiceMapper.getLoginEndpoint();

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

        return responseData;
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido no login';
        throw new Error(errorMessage);
      } finally {
        this.isLoading = false;
      }
    },

    async refreshToken(): Promise<Tokens> {
      try {
        if (!this.tokens.refreshToken) {
          throw new Error('Refresh token não disponível');
        }

        const endpoint = ApiServiceMapper.getRefreshTokenEndpoint();
        const response = await api.post<ApiResponse<Tokens>>(endpoint, {
          refreshToken: this.tokens.refreshToken,
        });

        if (!response.data.success) {
          throw new Error(response.data.error || 'Erro ao renovar token');
        }

        const tokens = response.data.data;
        if (!tokens) {
          throw new Error('Dados de token não encontrados');
        }

        this.tokens.accessToken = tokens.accessToken;
        this.tokens.refreshToken = tokens.refreshToken || this.tokens.refreshToken;

        this.saveToStorage();
        api.defaults.headers.common['Authorization'] = `Bearer ${tokens.accessToken}`;

        return tokens;
      } catch (error: unknown) {
        await this.logout();
        throw error;
      }
    },

    async logout(): Promise<void> {
      try {
        if (this.tokens.accessToken) {
          try {
            const endpoint = ApiServiceMapper.getLogoutEndpoint();
            await api.post(endpoint);
          } catch {
            // Continue com logout client-side
          }
        }

        this.user = null;
        this.tokens = { accessToken: null, refreshToken: null };
        this.isInitialized = false;
        this.resetOtpState();
        this.clearStorage();

        const router = useRouter();
        await router.push('/auth/login');
      } catch {
        this.user = null;
        this.tokens = { accessToken: null, refreshToken: null };
        this.resetOtpState();
        this.clearStorage();
      }
    },

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
      } catch (error: unknown) {
        if (error instanceof Error && error.message.includes('401')) {
          await this.logout();
        }
        throw error;
      }
    },

    async requestPasswordReset(email: string): Promise<PasswordResetResponse> {
      try {
        this.isLoading = true;
        const endpoint = ApiServiceMapper.getForgotPasswordEndpoint();
        const response = await api.post<ApiResponse<PasswordResetResponse>>(endpoint, { email });

        if (!response.data.success) {
          throw new Error(response.data.error || 'Erro ao solicitar reset de senha');
        }

        return response.data.data || { success: true, message: 'Email enviado com sucesso' };
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : 'Erro ao solicitar reset de senha';
        throw new Error(errorMessage);
      } finally {
        this.isLoading = false;
      }
    },

    async confirmPasswordReset(payload: {
      token: string;
      newPassword: string;
    }): Promise<PasswordResetResponse> {
      try {
        this.isLoading = true;
        const endpoint = ApiServiceMapper.getResetPasswordEndpoint();
        const response = await api.post<ApiResponse<PasswordResetResponse>>(endpoint, payload);

        if (!response.data.success) {
          throw new Error(response.data.error || 'Erro ao confirmar reset de senha');
        }

        return response.data.data || { success: true, message: 'Senha alterada com sucesso' };
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : 'Erro ao confirmar reset de senha';
        throw new Error(errorMessage);
      } finally {
        this.isLoading = false;
      }
    },

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
      } catch {
        this.clearStorage();
      }
    },

    saveToStorage(): void {
      try {
        const storageData = {
          user: this.user,
          tokens: this.tokens,
          isLoading: this.isLoading,
          isInitialized: this.isInitialized,
        };
        localStorage.setItem('auth-store', JSON.stringify(storageData));
      } catch {
        // Silenciosamente falha ao salvar
      }
    },

    clearStorage(): void {
      try {
        localStorage.removeItem('auth-store');
        sessionStorage.removeItem('auth-store');
        delete api.defaults.headers.common['Authorization'];
      } catch {
        // Silenciosamente falha ao limpar
      }
    },

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
      } catch {
        this.clearStorage();
        this.isInitialized = true;
      }
    },
  },

  getters: {
    isOtpRequired: (state): boolean => state.otp.isSent && !state.otp.isVerified,
    isOtpVerified: (state): boolean => state.otp.isVerified,
    isOtpSent: (state): boolean => state.otp.isSent,
    otpEmail: (state): string | null => state.otp.email,
    otpAttempts: (state): number => state.otp.attempts,
    hasPendingRegistration: (state): boolean => !!state.pendingRegistration,
    isVerifyingOtpState: (state): boolean => state.isVerifyingOtp,

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
