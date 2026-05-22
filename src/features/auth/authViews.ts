export const AUTH_QUERY_KEY = "auth";
export const AUTH_RETURN_VIEW_QUERY_KEY = "from";
export const AUTH_OTP_FLOW_QUERY_KEY = "otp-flow";
export const AUTH_OTP_EMAIL_QUERY_KEY = "otp-email";
export const AUTH_OTP_PHONE_QUERY_KEY = "otp-phone";
export const AUTH_OTP_PHONE_COUNTRY_QUERY_KEY = "otp-phone-country";
export const CHOOSE_ACCOUNT_QUERY_KEY = "choose-account";

export type AuthOtpFlow = "signin" | "forgot";

export type AuthModalUrlOptions = {
  returnView?: AuthView;
  otpFlow?: AuthOtpFlow;
  contactEmail?: string;
  contactPhone?: string;
  contactPhoneCountry?: string;
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

  return `${pathname}?${params.toString()}`;
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

export function isAuthView(value: string | null): value is AuthView {
  return value != null && VALID_AUTH_VIEWS.has(value);
}
