import type { SignInRole } from "./signIn.types";

export type SignUpFormValues = {
  full_name: string;
  email: string;
  phone_number: string;
  password: string;
};

export type SignUpRequest = {
  full_name: string;
  email: string;
  phone_number?: string;
  password: string;
  role: SignInRole;
};

export type SignUpResponseData = {
  otp?: string | null;
  dev_email_otp?: string | null;
};

export type SignUpResponse = {
  success: boolean;
  message: string;
  data: SignUpResponseData | unknown;
  error: unknown;
  meta: Record<string, unknown>;
};

export type ConfirmSignUpRequest = {
  email: string;
  code: string;
};

export type ConfirmSignUpResponse = {
  success: boolean;
  message: string;
  data: unknown;
  error: unknown;
  meta: Record<string, unknown>;
};

export type ResendConfirmationRequest = {
  email: string;
};

export type ResendConfirmationResponse = {
  success: boolean;
  message: string;
  data: unknown;
  error: unknown;
  meta: Record<string, unknown>;
};
