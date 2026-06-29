import type { SignInTokens } from "./signIn.types";

export type SignInWithOtpRequest = {
  username: string;
};

export type SignInWithOtpResponseData = {
  session: string;
  otp: string;
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
