import { authClient } from "@/src/apis/clients/api.client";
import { authEndpoints } from "@/src/apis/endpoints/authEndpoints";
import type { LoggedInUserResponse, SignInFormValues, SignInResponse } from "../types/auth.types";

export async function signInWithPassword(data: SignInFormValues): Promise<SignInResponse> {
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