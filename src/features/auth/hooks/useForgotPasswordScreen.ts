"use client";

import { useCallback, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { AUTH_VIEW } from "../authViews";
import type { ForgotPasswordMethod } from "../components/ForgotPasswordForm";
import type { ForgotPasswordFormValues } from "../types/auth.types";
import { useForgotPassword } from "../mutations/auth.mutation";
import { useToast } from "@/src/hooks/useToast";
import { useAuthStore } from "@/src/features/auth/store/auth.store";
import { useAuthModalNavigation } from "./useAuthPortal";
import { useAuthScreenLegalFooter } from "./authScreen.utils";

export function useForgotPasswordScreen() {
  const t = useTranslations("auth");
  const { termsText, privacyText } = useAuthScreenLegalFooter();
  const navigate = useAuthStore((state) => state.navigate);
  const { onBack, canGoBack } = useAuthModalNavigation();
  const setOtpFlow = useAuthStore((state) => state.setOtpFlow);
  const setPendingEmail = useAuthStore((state) => state.setPendingEmail);
  const setPendingPhone = useAuthStore((state) => state.setPendingPhone);
  const setPendingPhoneCountry = useAuthStore((state) => state.setPendingPhoneCountry);
  const toast = useToast();

  const { mutate: forgotPasswordMutate, isPending, isSuccess } = useForgotPassword();
  const lastSubmitRef = useRef<{
    values: ForgotPasswordFormValues;
    method: ForgotPasswordMethod;
  } | null>(null);

  const onSubmit = useCallback(
    (values: ForgotPasswordFormValues, method: ForgotPasswordMethod) => {
      if (method === "phone") {
        toast.info("Coming Soon", {
          description:
            "Password reset via phone number is not available yet. Please use email instead.",
        });
        return;
      }

      lastSubmitRef.current = { values, method };
      setPendingEmail(values.email);
      forgotPasswordMutate({ email: values.email });
    },
    [forgotPasswordMutate, setPendingEmail, toast],
  );

  useEffect(() => {
    if (isSuccess && lastSubmitRef.current) {
      const { values, method } = lastSubmitRef.current;
      setOtpFlow("forgot");
      setPendingEmail(method === "email" ? values.email : null);
      setPendingPhone(method === "phone" ? values.phoneNationalNumber : null);
      setPendingPhoneCountry(method === "phone" ? values.phoneCountryCode : null);
      navigate(AUTH_VIEW.otpVerify);
    }
  }, [
    isSuccess,
    navigate,
    setOtpFlow,
    setPendingEmail,
    setPendingPhone,
    setPendingPhoneCountry,
  ]);

  return {
    title: t("forgotPasswordTitle"),
    subtitle: t("forgotPasswordSubtitle"),
    onSubmit,
    isLoading: isPending,
    showBack: canGoBack,
    onBack,
    hasAccountText: t("socialSignUpHasAccount"),
    signInText: t("socialSignUpLogIn"),
    onSignInClick: onBack,
    termsText,
    privacyText,
  };
}
