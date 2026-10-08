import type { SignInResponse } from "./signIn.types";

/**
 * Providers accepted by `POST /auth/login/social`.
 * Google and Facebook both send the Cognito ID token. Apple stays unwired in the UI.
 */
export type SocialLoginProvider = "google" | "facebook" | "apple";

/** Roles the social API will create or accept. Agency, agent, and super admin are rejected. */
export type SocialAccountRole = "registered_user" | "owner";

export type SocialLoginRequest = {
  provider: SocialLoginProvider;
  /** Cognito ID token (`token_use=id`). The website sends `code` instead. */
  id_token?: string;
  /** Kept for the API contract. The web flow does not send a provider access token. */
  access_token?: string;
  /** Cognito hosted-UI authorization code. The API exchanges it. */
  code?: string;
  code_verifier?: string;
  redirect_uri?: string;
  role: SocialAccountRole;
};

export type SocialLoginResponse = SignInResponse;

export function isSocialAccountRole(value: string): value is SocialAccountRole {
  return value === "registered_user" || value === "owner";
}
