import type { SignInTokens } from "./signIn.types";

export type SignInWithOtpRequest = {
  username: string;
};

export type SignInWithOtpResponseData = {
  session: string;
  /** Local/dev only when the backend sets EXPOSE_OTP_IN_RESPONSE. Never show in production UI. */
  otp?: string | null;
  dev_email_otp?: string | null;
};

export type SignInWithOtpResponse = {
  success: boolean;
  message: string;
  data: SignInWithOtpResponseData;
  error: unknown;
  meta: Record<string, unknown>;
};

export type SignInWithOtpVerifyRequest = {
  username: string;
  code: string;
  session: string;
};

export type SignInWithOtpVerifyResponse = {
  success: boolean;
  message: string;
  data: SignInTokens;
  error: unknown;
  meta: Record<string, unknown>;
};
