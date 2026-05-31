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

export type ResetPasswordRequest = {
  email: string;
  code: string;
  new_password: string;
};

export type ResetPasswordResponse = {
  success: boolean;
  message: string;
  data: unknown;
  error: unknown;
  meta: Record<string, unknown>;
};
