// Enums para roles e status
export enum UserMainRole {
  CLIENT = 'client',
  EMPLOYEE = 'employee',
  ADMINSYSTEM = 'admin_system',
}

export enum EmployeeSubRole {
  SALON_OWNER = 'salon_owner',
  MANAGER = 'manager',
  STAFF = 'staff',
  RECEPTIONIST = 'receptionist',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING = 'pending',
}

export enum OtpPurpose {
  REGISTRATION = 'registration',
  LOGIN = 'login',
  PASSWORD_RESET = 'password_reset',
  EMAIL_VERIFICATION = 'email_verification'
}

export type Role = UserMainRole | `${UserMainRole.EMPLOYEE}:${EmployeeSubRole}`;

/* User Interfaces */
export interface UserName {
  firstName: string;
  middleName?: string;
  lastName: string;
  display?: string;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserMainRole;
  acceptTerms: boolean;
  phone?: string;
  subRole?: EmployeeSubRole;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

// ✅ INTERFACES PARA NOSSO BACKEND
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  statusCode: number;
  code?: string;
}

export interface UserData {
  id: string;
  email: string;
  role: UserMainRole;
  subRole?: EmployeeSubRole | null;
  isVerified: boolean;
  isActive: boolean;
  fullName: UserName;
  phoneNumber?: string;
  profileImage?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponseData {
  user: UserData;
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
}

export interface Tokens {
  accessToken: string;
  refreshToken?: string;
}

export interface OtpVerificationPayload {
  email: string;
  code: string;
  purpose?: OtpPurpose | string;
}

export interface OtpRequestPayload {
  email: string;
  purpose: OtpPurpose | string;
  name?: string;
}

// ✅ INTERFACES PARA OTP FLOW
export interface StartRegistrationResponse {
  requiresOtp: boolean;
  otpSent: boolean;
  message?: string;
}

export interface OtpVerificationResponse {
  verified: boolean;
  message: string;
}

export interface OtpResendResponse {
  sent: boolean;
  message: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  newPassword: string;
}

export interface PasswordResetResponse {
  success: boolean;
  message: string;
}

// ✅ INTERFACES PARA STORE STATE COM OTP
export interface OtpState {
  email: string | null;
  isVerified: boolean;
  isSent: boolean;
  attempts: number;
}

export interface AuthState {
  user: UserData | null;
  tokens: {
    accessToken: string | null;
    refreshToken: string | null;
  };
  isLoading: boolean;
  isInitialized: boolean;
  otp: OtpState;
  pendingRegistration: RegisterPayload | null;
}

// ✅ TIPO PARA O GETTER CORRIGIDO
export type UserSubRoleType = EmployeeSubRole | string | undefined;

// ✅ INTERFACES PARA OS NOVOS MÉTODOS DO STORE
export interface AuthStoreActions {
  // ✅ FLUXO OTP DE REGISTRO
  startRegistration(payload: RegisterPayload): Promise<StartRegistrationResponse>;
  verifyOtp(payload: { email: string; code: string }): Promise<OtpVerificationResponse>;
  completeOtpRegistration(otpCode: string): Promise<AuthResponseData>;
  resendOtp(payload: { email: string }): Promise<OtpResendResponse>;
  cancelRegistration(): void;
  
  // ✅ MÉTODOS LEGACY (COMPATIBILIDADE)
  register(payload: RegisterPayload): Promise<AuthResponseData>;
  
  // ✅ AUTENTICAÇÃO
  login(credentials: LoginCredentials): Promise<AuthResponseData>;
  logout(): Promise<void>;
  fetchCurrentUser(): Promise<void>;
  
  // ✅ RECUPERAÇÃO DE SENHA
  requestPasswordReset(email: string): Promise<PasswordResetResponse>;
  confirmPasswordReset(payload: PasswordResetConfirm): Promise<PasswordResetResponse>;
  
  // ✅ GERENCIAMENTO DE ESTADO
  initialize(): Promise<void>;
  loadFromStorage(): void;
  saveToStorage(): void;
  clearStorage(): void;
}

// ✅ GETTERS DO STORE
export interface AuthStoreGetters {
  isAuthenticated: boolean;
  currentUser: UserData | null;
  userRole: UserMainRole | undefined;
  userSubRole: UserSubRoleType;
  isLoadingState: boolean;
  userFullName: string;
  hasProfileImage: boolean;
  userSubRoleString: string | undefined;
  isEmployeeWithSubRole: boolean;
  
  // ✅ NOVOS GETTERS OTP
  isOtpRequired: boolean;
  isOtpVerified: boolean;
  isOtpSent: boolean;
  otpEmail: string | null;
  otpAttempts: number;
  hasPendingRegistration: boolean;
}

// ✅ TIPOS PARA COMPONENTES
export type OtpVerificationResult = OtpVerificationResponse;
export type OtpResendResult = OtpResendResponse;
export type StartRegistrationResult = StartRegistrationResponse;