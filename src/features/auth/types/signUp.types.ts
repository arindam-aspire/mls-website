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
  /** `email` sends only to the mailbox. `phone` sends only by SMS. */
  channel?: "email" | "phone";
};

export type SendPhoneOtpRequest = {
  phone_number?: string;
};

export type VerifyPhoneOtpRequest = {
  phone_number: string;
  phone_otp: string;
};

export type PhoneOtpResponseData = {
  phone_verified?: boolean;
  verified?: boolean;
};

export type PhoneOtpResponse = {
  success: boolean;
  message: string | null;
  data: PhoneOtpResponseData | null;
  error: unknown;
  meta: Record<string, unknown>;
};

export type ResendConfirmationResponse = {
  success: boolean;
  message: string;
  data: unknown;
  error: unknown;
  meta: Record<string, unknown>;
};
