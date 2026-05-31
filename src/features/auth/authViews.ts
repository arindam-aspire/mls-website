import type { SignInRole } from "./types/signIn.types";

export const AUTH_QUERY_KEY = "auth";
export const AUTH_RETURN_VIEW_QUERY_KEY = "from";
export const AUTH_OTP_FLOW_QUERY_KEY = "otp-flow";
export const AUTH_OTP_EMAIL_QUERY_KEY = "otp-email";
export const AUTH_OTP_PHONE_QUERY_KEY = "otp-phone";
export const AUTH_OTP_PHONE_COUNTRY_QUERY_KEY = "otp-phone-country";
export const AUTH_OTP_SESSION_QUERY_KEY = "otp-session";
export const AUTH_OTP_CODE_QUERY_KEY = "otp-code";
export const CHOOSE_ACCOUNT_QUERY_KEY = "choose-account";
export const AUTH_PORTAL_QUERY_KEY = "portal";

export type AuthPortalContext = "agency" | "agent";

export type AuthOtpFlow = "signin" | "forgot" | "signup";

export type AuthModalUrlOptions = {
  returnView?: AuthView;
  otpFlow?: AuthOtpFlow;
  contactEmail?: string;
  contactPhone?: string;
  contactPhoneCountry?: string;
  portal?: AuthPortalContext;
  otpSession?: string;
  otpCode?: string;
};

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

export function buildAuthModalUrl(
  pathname: string,
  view: AuthView,
  returnViewOrOptions?: AuthView | AuthModalUrlOptions,
): string {
  const options: AuthModalUrlOptions =
    typeof returnViewOrOptions === "string"
      ? { returnView: returnViewOrOptions }
      : (returnViewOrOptions ?? {});

  const params = new URLSearchParams({ [AUTH_QUERY_KEY]: view });

  if (options.returnView != null) {
    params.set(AUTH_RETURN_VIEW_QUERY_KEY, options.returnView);
  }
  if (options.otpFlow != null) {
    params.set(AUTH_OTP_FLOW_QUERY_KEY, options.otpFlow);
  }
  if (options.contactEmail?.trim()) {
    params.set(AUTH_OTP_EMAIL_QUERY_KEY, options.contactEmail.trim());
  }
  if (options.contactPhone?.trim()) {
    params.set(AUTH_OTP_PHONE_QUERY_KEY, options.contactPhone.trim());
  }
  if (options.contactPhoneCountry?.trim()) {
    params.set(
      AUTH_OTP_PHONE_COUNTRY_QUERY_KEY,
      options.contactPhoneCountry.trim(),
    );
  }
  if (options.portal != null) {
    params.set(AUTH_PORTAL_QUERY_KEY, options.portal);
  }
  if (options.otpSession?.trim()) {
    params.set(AUTH_OTP_SESSION_QUERY_KEY, options.otpSession.trim());
  }
  if (options.otpCode?.trim()) {
    params.set(AUTH_OTP_CODE_QUERY_KEY, options.otpCode.trim());
  }

  return `${pathname}?${params.toString()}`;
}

export function buildChooseAccountUrl(pathname: string): string {
  return `${pathname}?${CHOOSE_ACCOUNT_QUERY_KEY}=true`;
}

export function resolveAgencySignUpBackUrl(
  pathname: string,
  returnView: AuthView | null,
): string {
  if (
    returnView === AUTH_VIEW.agencySignIn ||
    returnView === AUTH_VIEW.agencyEmailSignIn
  ) {
    return buildAuthModalUrl(pathname, returnView);
  }

  return buildChooseAccountUrl(pathname);
}

export type SignInOtpSessionParams = {
  session: string;
  otp: string;
};

export function readSignInOtpSessionFromSearchParams(
  searchParams: Pick<URLSearchParams, "get">,
): SignInOtpSessionParams | null {
  const session = searchParams.get(AUTH_OTP_SESSION_QUERY_KEY)?.trim();
  if (!session) {
    return null;
  }

  return {
    session,
    otp: searchParams.get(AUTH_OTP_CODE_QUERY_KEY)?.trim() ?? "",
  };
}

export function resolveSignInOtpSession(
  searchParams: Pick<URLSearchParams, "get">,
  pendingOtpSession: SignInOtpSessionParams | null,
): SignInOtpSessionParams | null {
  return readSignInOtpSessionFromSearchParams(searchParams) ?? pendingOtpSession;
}

export function parseAuthPortal(
  value: string | null | undefined,
): AuthPortalContext | null {
  if (value === "agency" || value === "agent") {
    return value;
  }
  return null;
}

export function isAgentAuthPortal(portal: AuthPortalContext | null): boolean {
  return portal === "agent";
}

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
  portal: AuthPortalContext | null = null,
): SignInRole {
  if (isAgencyAuthView(returnView)) {
    return portal === "agent" ? "agent" : "admin";
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
