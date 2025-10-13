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
  purpose?: string;
}

export interface OtpRequestPayload {
  email: string;
  purpose: string;
  name?: string;
}

// ✅ INTERFACES PARA STORE STATE
export interface AuthState {
  user: UserData | null;
  tokens: {
    accessToken: string | null;
    refreshToken: string | null;
  };
  isLoading: boolean;
  isInitialized: boolean;
}

// ✅ TIPO PARA O GETTER CORRIGIDO
export type UserSubRoleType = EmployeeSubRole | string | undefined;
