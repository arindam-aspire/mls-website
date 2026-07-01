"use client";

import { useCallback } from "react";
import { useTranslations } from "next-intl";
import { useResetPassword } from "../mutations/auth.mutation";
import { useAuthStore } from "@/src/features/auth/store/auth.store";
import { useAuthModalNavigation } from "./useAuthPortal";
import { useAuthFlowContext, useAuthScreenLegalFooter } from "./authScreen.utils";
import { useToast } from "@/src/hooks/useToast";

export function useResetPasswordScreen() {
  const t = useTranslations("auth");
  const { termsText, privacyText } = useAuthScreenLegalFooter();
  const navigate = useAuthStore((state) => state.navigate);
  const { onBack, canGoBack } = useAuthModalNavigation();
  const pendingEmail = useAuthStore((state) => state.pendingEmail);
  const otpCode = useAuthStore((state) => state.otpCode);
  const clearOtpSession = useAuthStore((state) => state.clearOtpSession);
  const { signInViewAfterReset } = useAuthFlowContext();
  const toast = useToast();
  const { mutate: resetPasswordMutate, isPending } = useResetPassword();

  const onSubmit = useCallback(
    (newPassword: string) => {
      if (!pendingEmail?.trim()) {
        toast.info("Unable to reset password", {
          description: "Email address is missing.",
        });
        return;
      }

      if (!otpCode?.trim()) {
        toast.info("Unable to reset password", {
          description: "Verification code is missing. Please verify OTP again.",
        });
        return;
      }

      resetPasswordMutate(
        {
          email: pendingEmail.trim(),
          code: otpCode.trim(),
          new_password: newPassword,
        },
        {
          onSuccess: () => {
            clearOtpSession();
            navigate(signInViewAfterReset);
          },
        },
      );
    },
    [
      clearOtpSession,
      otpCode,
      pendingEmail,
      navigate,
      resetPasswordMutate,
      signInViewAfterReset,
      toast,
    ],
  );

  const onSignInClick = useCallback(() => {
    navigate(signInViewAfterReset);
  }, [navigate, signInViewAfterReset]);

  return {
    title: t("resetPasswordTitle"),
    subtitle: t("resetPasswordSubtitle"),
    onSubmit,
    isLoading: isPending,
    showBack: canGoBack,
    onBack,
    hasAccountText: t("socialSignUpHasAccount"),
    signInText: t("socialSignUpLogIn"),
    onSignInClick,
    termsText,
    privacyText,
  };
}
