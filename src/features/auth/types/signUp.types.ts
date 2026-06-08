import type { SignInRole } from "./signIn.types";

export type SignUpFormValues = {
  full_name: string;
  email: string;
  phone_number: string;
  password: string;
};

export type SignUpRequest = SignUpFormValues & {
  role: SignInRole;
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
  code: string;
};

export type ConfirmSignUpResponse = {
  success: boolean;
  message: string;
  data: unknown;
  error: unknown;
  meta: Record<string, unknown>;
};
