// ── Sign Up ──────────────────────────────────────────────────────────────────

export type SignUpFormValues = {
  full_name: string;
  email: string;
  phone_number: string;
  password: string;
};

export type SignUpRequest = {
  full_name: string;
  email: string;
  phone_number: string;
  password: string;
};

export type SignUpResponse = {
  success: boolean;
  message: string;
  data: unknown;
  error: unknown;
  meta: Record<string, unknown>;
};

export type ConfirmSignUpRequest = {
  email: string;
  otp: string;
};

export type ConfirmSignUpResponse = {
  success: boolean;
  message: string;
  data: unknown;
  error: unknown;
  meta: Record<string, unknown>;
};

// ── Sign In ──────────────────────────────────────────────────────────────────

export type SignInFormValues = {
  username: string;
  password: string;
  rememberMe: boolean;
};

export type SignInRequest = {
  username: string;
  password: string;
  rememberMe: boolean;
};

export type SignInTokens = {
  access_token: string;
  refresh_token: string;
  id_token: string;
  token_type: string;
  expires_in: number;
  requires_password_set: boolean;
  remember_me_cookie: boolean;
};

export type SignInResponse = {
  success: boolean;
  message: string;
  data: SignInTokens;
  error: unknown;
  meta: Record<string, unknown>;
};

// ── Sign In with OTP ────────────────────────────────────────────────────────

export type SignInWithOtpVerifyRequest = {
  otp: string;
  email?: string;
  phone_number?: string;
};

export type SignInWithOtpVerifyResponse = {
  success: boolean;
  message: string;
  data: SignInTokens;
  error: unknown;
  meta: Record<string, unknown>;
};

// ── Forgot Password ─────────────────────────────────────────────────────────

export type ForgotPasswordFormValues = {
  email: string;
  phoneCountryCode: string;
  phoneNationalNumber: string;
};

export type ForgotPasswordRequest = {
  email?: string;
  phoneCountryCode?: string;
  phoneNationalNumber?: string;
};

export type ForgotPasswordResponse = {
  success: boolean;
  message: string;
  data: boolean;
  error: unknown;
  meta: Record<string, unknown>;
};

// ── User & Auth Session ─────────────────────────────────────────────────────

export type Permission = {
  code: string;
  description: string;
  id: string;
  created_at: string;
};

export type Role = {
  name: string;
  description: string;
  id: string;
  permissions: Permission[];
  created_at: string;
};

export type LoggedInUser = {
  email: string;
  full_name: string;
  phone_number: string;
  id: string;
  is_active: boolean;
  is_email_verified: boolean;
  is_phone_verified: boolean;
  profile_picture_url: string | null;
  roles: Role[];
  created_at: string;
  requires_password_set: boolean;
  status: string;
};

export type LoggedInUserResponse = {
  success: boolean;
  message: string | null;
  data: LoggedInUser;
  error: unknown;
  meta: Record<string, unknown>;
};

// ── Logout ──────────────────────────────────────────────────────────────────

export type LogoutResponse = {
  success: boolean;
  message: string;
  data: boolean;
  error: unknown;
  meta: Record<string, unknown>;
};
