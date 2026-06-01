import { authClient } from "@/src/apis/clients/api.client";
import { authEndpoints } from "@/src/apis/endpoints/authEndpoints";
import type { AgencySignUpRequest, AgencySignUpResponse, ConfirmSignUpRequest, ConfirmSignUpResponse, ForgotPasswordRequest, ForgotPasswordResponse, LoggedInUserResponse, LogoutResponse, ResetPasswordRequest, ResetPasswordResponse, SignInRequest, SignInResponse, SignInWithOtpRequest, SignInWithOtpResponse, SignInWithOtpVerifyRequest, SignInWithOtpVerifyResponse, SignUpRequest, SignUpResponse } from "../types/auth.types";

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

export async function signInWithOtpRequest(data: SignInWithOtpRequest): Promise<SignInWithOtpResponse> {
  return authClient.request<SignInWithOtpResponse>({
    endpoint: authEndpoints.SIGN_IN_WITH_OTP,
    method: "POST",
    body: data,
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

export async function agencySignUp(
  data: AgencySignUpRequest,
): Promise<AgencySignUpResponse> {
  const formData = new FormData();
  formData.append("agency_name", data.agency_name);
  formData.append("agency_trade_name", data.agency_trade_name);
  formData.append("email", data.email);
  formData.append("phone_number", data.phone_number);
  formData.append("password", data.password);
  formData.append("legal_document", data.legal_document);

  return authClient.request<AgencySignUpResponse>({
    endpoint: authEndpoints.AGENCY_REGISTER,
    method: "POST",
    body: formData,
    isFormData: true,
    auth: false,
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

export async function resetPassword(
  data: ResetPasswordRequest,
): Promise<ResetPasswordResponse> {
  return authClient.request<ResetPasswordResponse>({
    endpoint: authEndpoints.FORGOT_PASSWORD_CONFIRM,
    method: "POST",
    body: data,
  });
}