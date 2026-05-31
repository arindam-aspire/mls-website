"use client";

import { useCallback, useMemo } from "react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/src/i18n/navigation";
import { useSearchParams } from "next/navigation";
import {
  AUTH_OTP_EMAIL_QUERY_KEY,
  AUTH_OTP_FLOW_QUERY_KEY,
  AUTH_OTP_PHONE_COUNTRY_QUERY_KEY,
  AUTH_OTP_PHONE_QUERY_KEY,
  AUTH_RETURN_VIEW_QUERY_KEY,
  AUTH_VIEW,
  buildAuthModalUrl,
  resolveSignInViewAfterPasswordReset,
} from "../authViews";
import { useAuthPortal } from "./useAuthPortal";
import { useResetPassword } from "../mutations/auth.mutation";
import { useAuthStore } from "../store/auth.store";
import { useToast } from "@/src/hooks/useToast";
import {
  resolveAuthReturnView,
  resolveOtpFlow,
  useAuthScreenLegalFooter,
} from "./authScreen.utils";

export function useResetPasswordScreen() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations("auth");
  const { termsText, privacyText } = useAuthScreenLegalFooter();
  const toast = useToast();

  const returnView = resolveAuthReturnView(
    searchParams.get(AUTH_RETURN_VIEW_QUERY_KEY),
    AUTH_VIEW.userSignIn,
  );
  const otpFlow = resolveOtpFlow(searchParams.get(AUTH_OTP_FLOW_QUERY_KEY));
  const contactEmail = searchParams.get(AUTH_OTP_EMAIL_QUERY_KEY) ?? undefined;
  const contactPhone = searchParams.get(AUTH_OTP_PHONE_QUERY_KEY) ?? undefined;
  const contactPhoneCountry =
    searchParams.get(AUTH_OTP_PHONE_COUNTRY_QUERY_KEY) ?? undefined;

  const signInView = resolveSignInViewAfterPasswordReset(returnView);
  const portal = useAuthPortal();
  const forgotPasswordOtp = useAuthStore((s) => s.forgotPasswordOtp);
  const clearForgotPasswordOtp = useAuthStore((s) => s.clearForgotPasswordOtp);
  const { mutate: resetPasswordMutate, isPending } = useResetPassword();

  const portalOptions = useMemo(
    () => (portal ? { portal } : undefined),
    [portal],
  );

  const onSubmit = useCallback(
    (newPassword: string) => {
      if (!contactEmail?.trim()) {
        toast.info("Unable to reset password", {
          description: "Email address is missing.",
        });
        return;
      }

      if (!forgotPasswordOtp?.trim()) {
        toast.info("Unable to reset password", {
          description: "Verification code is missing. Please verify OTP again.",
        });
        return;
      }

      resetPasswordMutate(
        {
          email: contactEmail.trim(),
          code: forgotPasswordOtp.trim(),
          new_password: newPassword,
        },
        {
          onSuccess: () => {
            clearForgotPasswordOtp();
            router.replace(
              buildAuthModalUrl(pathname, signInView, portalOptions),
            );
          },
        },
      );
    },
    [
      clearForgotPasswordOtp,
      contactEmail,
      forgotPasswordOtp,
      pathname,
      portalOptions,
      resetPasswordMutate,
      router,
      signInView,
      toast,
    ],
  );

  const onBack = useCallback(() => {
    if (otpFlow === "forgot") {
      router.replace(
        buildAuthModalUrl(pathname, AUTH_VIEW.otpVerify, {
          returnView,
          otpFlow: "forgot",
          contactEmail,
          contactPhone,
          contactPhoneCountry,
        }),
      );
      return;
    }

    router.replace(
      buildAuthModalUrl(pathname, AUTH_VIEW.signInOtp, returnView),
    );
  }, [
    contactEmail,
    contactPhone,
    contactPhoneCountry,
    otpFlow,
    pathname,
    returnView,
    router,
  ]);

  const onSignInClick = useCallback(() => {
    router.replace(buildAuthModalUrl(pathname, signInView, portalOptions));
  }, [pathname, portalOptions, router, signInView]);

  return {
    title: t("resetPasswordTitle"),
    subtitle: t("resetPasswordSubtitle"),
    onSubmit,
    isLoading: isPending,
    onBack,
    hasAccountText: t("socialSignUpHasAccount"),
    signInText: t("socialSignUpLogIn"),
    onSignInClick,
    termsText,
    privacyText,
  };
}
