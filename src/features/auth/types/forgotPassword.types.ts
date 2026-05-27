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
