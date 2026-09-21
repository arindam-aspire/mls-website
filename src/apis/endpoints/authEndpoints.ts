export const authEndpoints = {
  SIGN_IN_WITH_PASSWORD: "/auth/login/password",
  SIGN_IN_WITH_OTP: "/auth/login/otp/request",
  SIGN_IN_WITH_OTP_VERIFY: "/auth/login/otp/verify",
  LOGGED_IN_USER: "/auth/me",
  FORGOT_PASSWORD: "/auth/forgot-password/request",
  FORGOT_PASSWORD_CONFIRM: "/auth/forgot-password/confirm",
  CHANGE_PASSWORD: "/auth/change-password",
  REFRESH: "/auth/refresh",
  LOGOUT: "/auth/logout",

  // Sign up for user and owner
  USER_SIGN_UP: "/auth/signup",
  CONFIRM_SIGN_UP_OTP: "/auth/confirm-signup",
  RESEND_CONFIRMATION: "/auth/resend-confirmation",
  AGENCY_REGISTER: "/agency/register",
} as const;
