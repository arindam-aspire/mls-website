import { authClient } from "@/src/apis/clients/api.client";
import { authEndpoints } from "@/src/apis/endpoints/authEndpoints";
import type { ConfirmSignUpRequest, ConfirmSignUpResponse, ForgotPasswordRequest, ForgotPasswordResponse, LoggedInUserResponse, LogoutResponse, SignInRequest, SignInResponse, SignInWithOtpVerifyRequest, SignInWithOtpVerifyResponse, SignUpRequest, SignUpResponse } from "../types/auth.types";

export async function signInWithPassword(data: SignInRequest): Promise<SignInResponse> {
  return authClient.request<SignInResponse>({
    endpoint: authEndpoints.SIGN_IN_WITH_PASSWORD,
    method: "POST",
    body: data,
  });
}

export async function getLoggedInUser(): Promise<LoggedInUserResponse> {
  return authClient.request<LoggedInUserResponse>({
    endpoint: authEndpoints.LOGGED_IN_USER,
    method: "GET",
    auth: true
  });
}

export async function logout(): Promise<LogoutResponse> {
  return authClient.request<LogoutResponse>({
    endpoint: authEndpoints.LOGOUT,
    method: "POST",
    auth: true,
  });
}

export async function signInWithOtpVerify(data: SignInWithOtpVerifyRequest): Promise<SignInWithOtpVerifyResponse> {
  return authClient.request<SignInWithOtpVerifyResponse>({
    endpoint: authEndpoints.SIGN_IN_WITH_OTP_VERIFY,
    method: "POST",
    body: data,
  });
}

export async function signUp(data: SignUpRequest): Promise<SignUpResponse> {
  return authClient.request<SignUpResponse>({
    endpoint: authEndpoints.USER_SIGN_UP,
    method: "POST",
    body: data,
  });
}

export async function confirmSignUp(data: ConfirmSignUpRequest): Promise<ConfirmSignUpResponse> {
  return authClient.request<ConfirmSignUpResponse>({
    endpoint: authEndpoints.CONFIRM_SIGN_UP_OTP,
    method: "POST",
    body: data,
  });
}

export async function forgotPassword(data: ForgotPasswordRequest): Promise<ForgotPasswordResponse> {
  return authClient.request<ForgotPasswordResponse>({
    endpoint: authEndpoints.FORGOT_PASSWORD,
    method: "POST",
    body: data,
  });
}