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

  // ✅ NOVO: Endpoint para verificar se email existe
  static getCheckEmailEndpoint(): string {
    return '/api/Auth/check-email'; // ✅ CORRETO
  }
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState & {
    otp: OtpState;
    pendingRegistration: RegisterPayload | null;
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
  }),

  actions: {
    // ✅ VALIDAÇÃO LOCAL DOS DADOS
    validateRegistrationData(payload: RegisterPayload): void {
      if (!payload.firstName?.trim() || !payload.lastName?.trim()) {
        throw new Error('Nome completo é obrigatório');
      }

      if (!payload.email?.trim()) {
        throw new Error('Email é obrigatório');
      }

      // Validação básica de email
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
    },

    // ✅ VERIFICAR SE EMAIL JÁ EXISTE

    async checkEmailExists(email: string): Promise<boolean> {
      try {
        console.log('🔍 Verificando se email existe:', email);

        const endpoint = ApiServiceMapper.getCheckEmailEndpoint();
        const response = await api.post<ApiResponse<{ exists: boolean }>>(endpoint, { email });

        console.log('📧 Resposta verificação email:', response.data);

        if (!response.data.success) {
          throw new Error(response.data.error || 'Erro ao verificar email');
        }

        return response.data.data?.exists || false;
      } catch (error: unknown) {
        console.error('❌ Erro ao verificar email:', error);

        // Se o endpoint não existir ainda, assumir que email não existe
        if (error instanceof Error) {
          // Verificar se é um erro 404 (endpoint não encontrado)
          if (error.message.includes('404') || error.message.includes('Not Found')) {
            console.warn('⚠️ Endpoint de verificação não encontrado, continuando...');
            return false;
          }

          // Se for outro tipo de erro, lançar exceção
          throw new Error('Erro ao verificar disponibilidade do email: ' + error.message);
        }

        // Se não for uma instância de Error, lançar mensagem genérica
        throw new Error('Erro desconhecido ao verificar disponibilidade do email');
      }
    },

    // ✅ FLUXO CORRETO: INICIAR REGISTRO COM VALIDAÇÃO
    async startRegistration(payload: RegisterPayload): Promise<StartRegistrationResponse> {
      try {
        this.isLoading = true;
        console.log('🚀 Iniciando registro com validação...');

        // ✅ 1. VALIDAR DADOS LOCALMENTE
        this.validateRegistrationData(payload);

        // ✅ 2. VERIFICAR SE EMAIL JÁ EXISTE
        const emailExists = await this.checkEmailExists(payload.email);
        if (emailExists) {
          throw new Error('Este email já está registrado. Por favor, use outro email.');
        }

        // ✅ 3. SALVAR DADOS TEMPORARIAMENTE
        this.pendingRegistration = payload;
        this.otp.email = payload.email;

        // ✅ 4. ENVIAR OTP PARA VERIFICAÇÃO
        console.log('📤 Enviando OTP para verificação...');
        await this.requestOtp({
          email: payload.email,
          purpose: 'registration',
          name: `${payload.firstName} ${payload.lastName}`,
        });

        // ✅ 5. ATUALIZAR ESTADO
        this.otp.isSent = true;
        this.otp.isVerified = false;
        this.otp.attempts = 0;

        console.log('✅ OTP enviado com sucesso - aguardando verificação');
        return {
          requiresOtp: true,
          otpSent: true,
          message: 'Código de verificação enviado para seu email',
        };
      } catch (error: unknown) {
        console.error('❌ Erro no início do registro:', error);
        const errorMessage = error instanceof Error ? error.message : 'Erro ao iniciar registro';
        throw new Error(errorMessage);
      } finally {
        this.isLoading = false;
      }
    },

    // ✅ VERIFICAR OTP E COMPLETAR REGISTRO
    async verifyOtpAndCompleteRegistration(otpCode: string): Promise<AuthResponseData> {
      try {
        this.isLoading = true;
        console.log('🔐 Verificando OTP e completando registro...');

        if (!this.pendingRegistration) {
          throw new Error('Nenhum registro pendente encontrado');
        }

        // ✅ 1. VERIFICAR OTP
        console.log('✅ Verificando código OTP...');
        const otpResult = await this.verifyOtp({
          email: this.pendingRegistration.email,
          code: otpCode,
        });

        if (!otpResult.verified) {
          throw new Error(otpResult.message);
        }

        console.log('✅ OTP verificado com sucesso!');

        // ✅ 2. COMPLETAR REGISTRO NA BASE DE DADOS
        console.log('💾 Registrando usuário na base de dados...');
        const result = await this.completeRegistration(this.pendingRegistration);

        // ✅ 3. LIMPAR ESTADO TEMPORÁRIO
        this.resetOtpState();

        console.log('🎉 Registro completado com sucesso!');
        return result;
      } catch (error: unknown) {
        console.error('❌ Erro ao verificar OTP e completar registro:', error);
        const errorMessage = error instanceof Error ? error.message : 'Erro ao completar registro';
        throw new Error(errorMessage);
      } finally {
        this.isLoading = false;
      }
    },

    // ✅ MÉTODO ORIGINAL DE REQUEST OTP
    async requestOtp(payload: OtpRequestPayload): Promise<{ sent: boolean }> {
      try {
        console.log('📤 Enviando OTP para:', payload.email);

        const endpoint = ApiServiceMapper.getOtpEndpoint('send');
        const response = await api.post<ApiResponse<{ sent: boolean }>>(endpoint, {
          email: payload.email,
          purpose: payload.purpose,
          ...(payload.name && { name: payload.name }),
        });

        if (!response.data.success) {
          throw new Error(response.data.error || 'Erro ao enviar OTP');
        }

        console.log('✅ OTP enviado com sucesso');
        return response.data.data || { sent: true };
      } catch (error: unknown) {
        console.error('❌ OTP request error:', error);

        if (error instanceof Error) {
          if (error.message.includes('404') || error.message.includes('Not Found')) {
            throw new Error('Serviço de verificação temporariamente indisponível');
          }
          if (error.message.includes('400')) {
            throw new Error('Email inválido ou já registrado');
          }
        }

        const errorMessage =
          error instanceof Error ? error.message : 'Erro ao enviar código de verificação';
        throw new Error(errorMessage);
      }
    },

    // ✅ MÉTODO ORIGINAL DE VERIFICAÇÃO OTP
    async verifyOtp(payload: { email: string; code: string }): Promise<OtpVerificationResponse> {
      try {
        console.log('✅ Verificando OTP para:', payload.email);

        const endpoint = ApiServiceMapper.getOtpEndpoint('verify');

        const response = await api.post<ApiResponse<{ verified: boolean }>>(endpoint, {
          email: payload.email,
          otpCode: payload.code,
          purpose: 'registration',
        });

        if (!response.data.success) {
          this.otp.attempts += 1;
          throw new Error(response.data.error || 'Código OTP inválido');
        }

        this.otp.isVerified = true;
        this.otp.attempts = 0;

        console.log('✅ OTP verificado com sucesso');
        return {
          verified: true,
          message: 'Código verificado com sucesso',
        };
      } catch (error: unknown) {
        console.error('❌ OTP verification error:', error);

        const errorMessage =
          error instanceof Error ? error.message : 'Erro na verificação do código';

        return {
          verified: false,
          message: errorMessage,
        };
      }
    },

    // ✅ MÉTODO ORIGINAL DE REGISTRO
    async completeRegistration(payload: RegisterPayload): Promise<AuthResponseData> {
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

      const registerData = {
        fullName: {
          firstName: payload.firstName.trim(),
          lastName: payload.lastName.trim(),
        },
        email: payload.email.trim(),
        password: payload.password,
        phone: payload.phone,
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
    },

    // ✅ MÉTODO PARA CANCELAR REGISTRO
    cancelRegistration(): void {
      console.log('❌ Registro cancelado pelo usuário');
      this.resetOtpState();
    },

    // ✅ REENVIAR OTP
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

        return {
          sent: true,
          message: 'Código reenviado com sucesso',
        };
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Erro ao reenviar código';
        throw new Error(errorMessage);
      }
    },

    // ✅ RESETAR ESTADO OTP
    resetOtpState(): void {
      this.otp = {
        email: null,
        isVerified: false,
        isSent: false,
        attempts: 0,
      };
      this.pendingRegistration = null;
    },

    // ✅ REGISTER (MÉTODO LEGACY - MANTIDO PARA COMPATIBILIDADE)
    async register(payload: RegisterPayload): Promise<AuthResponseData> {
      console.warn(
        '⚠️ Método register() é legado. Use startRegistration() + verifyOtpAndCompleteRegistration()',
      );

      const result = await this.startRegistration(payload);

      if (result.requiresOtp) {
        throw new Error('Registro requer verificação OTP. Use o fluxo completo com OTP.');
      }

      return await this.completeRegistration(payload);
    },

    // ✅ LOGIN
    async login(credentials: LoginCredentials): Promise<AuthResponseData> {
      try {
        this.isLoading = true;
        console.log('🔐 Tentando login para:', credentials.email);

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

    // ✅ REFRESH TOKEN
    async refreshToken(): Promise<Tokens> {
      try {
        if (!this.tokens.refreshToken) {
          throw new Error('Refresh token não disponível');
        }

        console.log('🔄 Renovando token...');
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
            const endpoint = ApiServiceMapper.getLogoutEndpoint();
            await api.post(endpoint);
          } catch {
            console.warn('Logout endpoint not available, continuing with client-side logout');
          }
        }

        this.user = null;
        this.tokens = { accessToken: null, refreshToken: null };
        this.isInitialized = false;
        this.resetOtpState();

        this.clearStorage();

        const router = useRouter();
        await router.push('/auth/login');

        console.log('✅ Logout realizado com sucesso');
      } catch {
        console.error('❌ Logout error');
        this.user = null;
        this.tokens = { accessToken: null, refreshToken: null };
        this.resetOtpState();
        this.clearStorage();
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

    // ✅ REQUEST PASSWORD RESET
    async requestPasswordReset(email: string): Promise<PasswordResetResponse> {
      try {
        this.isLoading = true;
        console.log('📧 Solicitando reset de senha para:', email);

        const endpoint = ApiServiceMapper.getForgotPasswordEndpoint();

        const response = await api.post<ApiResponse<PasswordResetResponse>>(endpoint, { email });

        if (!response.data.success) {
          throw new Error(response.data.error || 'Erro ao solicitar reset de senha');
        }

        console.log('✅ Solicitação de reset de senha enviada com sucesso');
        return response.data.data || { success: true, message: 'Email enviado com sucesso' };
      } catch (error: unknown) {
        console.error('❌ Password reset request error:', error);
        const errorMessage =
          error instanceof Error ? error.message : 'Erro ao solicitar reset de senha';
        throw new Error(errorMessage);
      } finally {
        this.isLoading = false;
      }
    },

    // ✅ CONFIRM PASSWORD RESET
    async confirmPasswordReset(payload: {
      token: string;
      newPassword: string;
    }): Promise<PasswordResetResponse> {
      try {
        this.isLoading = true;
        console.log('🔑 Confirmando reset de senha');

        const endpoint = ApiServiceMapper.getResetPasswordEndpoint();

        const response = await api.post<ApiResponse<PasswordResetResponse>>(endpoint, payload);

        if (!response.data.success) {
          throw new Error(response.data.error || 'Erro ao confirmar reset de senha');
        }

        console.log('✅ Reset de senha confirmado com sucesso');
        return response.data.data || { success: true, message: 'Senha alterada com sucesso' };
      } catch (error: unknown) {
        console.error('❌ Password reset confirmation error:', error);
        const errorMessage =
          error instanceof Error ? error.message : 'Erro ao confirmar reset de senha';
        throw new Error(errorMessage);
      } finally {
        this.isLoading = false;
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
        const storageData = {
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
  },

  getters: {
    // 🎯 GETTERS PARA OTP
    isOtpRequired: (state): boolean => state.otp.isSent && !state.otp.isVerified,
    isOtpVerified: (state): boolean => state.otp.isVerified,
    isOtpSent: (state): boolean => state.otp.isSent,
    otpEmail: (state): string | null => state.otp.email,
    otpAttempts: (state): number => state.otp.attempts,
    hasPendingRegistration: (state): boolean => !!state.pendingRegistration,

    // 🎯 GETTERS EXISTENTES
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
