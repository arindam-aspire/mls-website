"use client";

import { useTranslations } from "next-intl";
import {
  AUTH_VIEW,
  isAgencyAuthView,
  isAuthView,
  type AuthOtpFlow,
  type AuthView,
} from "../authViews";

export function resolveAuthReturnView(
  from: string | null,
  fallback: AuthView,
): AuthView {
  if (isAuthView(from)) {
    return from;
  }
  return fallback;
}

export function resolveAuthReturnViewOrNull(from: string | null): AuthView | null {
  if (isAuthView(from)) {
    return from;
  }
  return null;
}

export function resolveOtpFlow(value: string | null): AuthOtpFlow {
  return value === "forgot" ? "forgot" : "signin";
}

export function resolveOtpBackView(
  otpFlow: AuthOtpFlow,
  returnView: AuthView,
): AuthView {
  if (otpFlow === "forgot") {
    return AUTH_VIEW.forgotPassword;
  }
  if (isAgencyAuthView(returnView)) {
    return AUTH_VIEW.agencySignIn;
  }
  return AUTH_VIEW.signInOtp;
}

export function useAuthScreenLegalFooter() {
  const t = useTranslations("auth");
  const tCommon = useTranslations("common");

  return {
    termsText: t("termsOfService"),
    privacyText: tCommon("privacyPolicy"),
  };
}
