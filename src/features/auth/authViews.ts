import type { SignInRole } from "./types/signIn.types";

export type AuthOtpFlow = "signin" | "forgot" | "signup";

export const AUTH_VIEW = {
  chooseAccount: "choose-account",
  userSocialSignIn: "user-social-sign-in",
  userSocialSignUp: "user-social-sign-up",
  ownerSocialSignIn: "owner-social-sign-in",
  ownerSocialSignUp: "owner-social-sign-up",
  userSignIn: "user-sign-in",
  ownerSignIn: "owner-sign-in",
  userSignUp: "user-sign-up",
  ownerSignUp: "owner-sign-up",
  forgotPassword: "forgot-password",
  resetPassword: "reset-password",
  signInOtp: "signin-otp",
  otpVerify: "otp-verify",
  agencySignIn: "agency-sign-in",
  agencySignUp: "agency-sign-up",
  agencyEmailSignIn: "agency-email-sign-in",
  confirmSignUp: "confirm-sign-up",
} as const;

export type AuthView = (typeof AUTH_VIEW)[keyof typeof AUTH_VIEW];

export const VALID_AUTH_VIEWS = new Set<string>(Object.values(AUTH_VIEW));

export function resolveAccountTypeAuthView(
  type: "user" | "owner" | "agency" | "agent",
  mode: "signin" | "signup",
): AuthView | null {
  if (type === "user") {
    return mode === "signin"
      ? AUTH_VIEW.userSocialSignIn
      : AUTH_VIEW.userSocialSignUp;
  }
  if (type === "owner") {
    return mode === "signin"
      ? AUTH_VIEW.ownerSocialSignIn
      : AUTH_VIEW.ownerSocialSignUp;
  }
  if (type === "agency") {
    return mode === "signin"
      ? AUTH_VIEW.agencySignIn
      : AUTH_VIEW.agencySignUp;
  }
  if (type === "agent") {
    return mode === "signin" ? AUTH_VIEW.agencySignIn : null;
  }
  return null;
}

export type EmailAccountType = "user" | "owner" | "agency";

export function resolveEmailSignInView(type: EmailAccountType): AuthView {
  if (type === "user") {
    return AUTH_VIEW.userSignIn;
  }
  if (type === "owner") {
    return AUTH_VIEW.ownerSignIn;
  }
  return AUTH_VIEW.agencyEmailSignIn;
}

export function resolveEmailSignUpView(type: EmailAccountType): AuthView {
  if (type === "user") {
    return AUTH_VIEW.userSignUp;
  }
  if (type === "owner") {
    return AUTH_VIEW.ownerSignUp;
  }
  return AUTH_VIEW.agencySignUp;
}

export function isAgencyAuthView(view: AuthView): boolean {
  return (
    view === AUTH_VIEW.agencySignIn ||
    view === AUTH_VIEW.agencySignUp ||
    view === AUTH_VIEW.agencyEmailSignIn
  );
}

export function resolveSignInRoleFromAuthContext(
  returnView: AuthView,
  agentPortal = false,
): SignInRole {
  if (isAgencyAuthView(returnView)) {
    return agentPortal ? "agent" : "admin";
  }
  if (
    returnView === AUTH_VIEW.ownerSignIn ||
    returnView === AUTH_VIEW.ownerSocialSignIn
  ) {
    return "owner";
  }
  return "registered_user";
}

export function resolveAuthSignUpView(returnView: AuthView): AuthView {
  if (
    returnView === AUTH_VIEW.ownerSignIn ||
    returnView === AUTH_VIEW.ownerSocialSignIn
  ) {
    return AUTH_VIEW.ownerSocialSignUp;
  }
  if (isAgencyAuthView(returnView)) {
    return AUTH_VIEW.agencySignUp;
  }
  return AUTH_VIEW.userSocialSignUp;
}

export function resolveSignInViewFromSignUpReturnView(
  returnView: AuthView,
): AuthView {
  if (returnView === AUTH_VIEW.ownerSignUp) {
    return AUTH_VIEW.ownerSignIn;
  }
  if (returnView === AUTH_VIEW.agencySignUp) {
    return AUTH_VIEW.agencyEmailSignIn;
  }
  return AUTH_VIEW.userSignIn;
}

export function resolveSignInViewAfterPasswordReset(
  returnView: AuthView,
): AuthView {
  if (
    returnView === AUTH_VIEW.ownerSignIn ||
    returnView === AUTH_VIEW.ownerSocialSignIn
  ) {
    return AUTH_VIEW.ownerSignIn;
  }
  if (isAgencyAuthView(returnView)) {
    return AUTH_VIEW.agencyEmailSignIn;
  }
  if (
    returnView === AUTH_VIEW.userSignIn ||
    returnView === AUTH_VIEW.userSocialSignIn
  ) {
    return AUTH_VIEW.userSignIn;
  }
  return AUTH_VIEW.userSignIn;
}

export function isAuthView(value: string | null): value is AuthView {
  return value != null && VALID_AUTH_VIEWS.has(value);
}

export function resolveSignInViewForAccountType(
  type: "user" | "owner",
): AuthView {
  return type === "user" ? AUTH_VIEW.userSignIn : AUTH_VIEW.ownerSignIn;
}

export function resolveSocialSignInViewForAccountType(
  type: "user" | "owner",
): AuthView {
  return type === "user"
    ? AUTH_VIEW.userSocialSignIn
    : AUTH_VIEW.ownerSocialSignIn;
}

export function resolveSocialSignUpViewForAccountType(
  type: "user" | "owner",
): AuthView {
  return type === "user"
    ? AUTH_VIEW.userSocialSignUp
    : AUTH_VIEW.ownerSocialSignUp;
}
