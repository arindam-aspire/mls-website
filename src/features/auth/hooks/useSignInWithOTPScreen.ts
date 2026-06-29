"use client";

import { useCallback, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { AUTH_VIEW } from "../authViews";
import type { SignInOtpMethod, SignInWithOTPFormValues } from "../components/SignInWithOTPForm";
import { useSignInWithOtpRequest } from "../mutations/auth.mutation";
import { useAuthStore } from "../store/auth.store";
import { useAuthModalNavigation } from "./useAuthPortal";
import { useAuthFlowContext, useAuthScreenLegalFooter } from "./authScreen.utils";
import { useToast } from "@/src/hooks/useToast";

export function useSignInWithOTPScreen() {
  const t = useTranslations("auth");
  const { termsText, privacyText } = useAuthScreenLegalFooter();
  const navigate = useAuthStore((state) => state.navigate);
  const { onBack, canGoBack } = useAuthModalNavigation();
  const setOtpFlow = useAuthStore((state) => state.setOtpFlow);
  const setPendingEmail = useAuthStore((state) => state.setPendingEmail);
  const otpSession = useAuthStore((state) => state.otpSession);
  const {
    isAgency,
    isAgent,
    signUpView,
  } = useAuthFlowContext();
  const showAgencyCreateAccount = isAgency && !isAgent;
  const showUserCreateAccount = !showAgencyCreateAccount && !isAgency;
  const toast = useToast();

  const { mutate: requestOtp, isPending, isSuccess } = useSignInWithOtpRequest();
  const lastEmailRef = useRef<string | null>(null);

  const onSubmit = useCallback(
    (values: SignInWithOTPFormValues, method: SignInOtpMethod) => {
      if (method === "phone") {
        toast.info("Coming Soon", {
          description:
            "Sign in via phone number is not available yet. Please use email instead.",
        });
        return;
      }

      lastEmailRef.current = values.email;
      setPendingEmail(values.email);
      requestOtp({ username: values.email });
    },
    [requestOtp, setPendingEmail, toast],
  );

  const onCreateAccountClick = useCallback(() => {
    navigate(signUpView);
  }, [navigate, signUpView]);

  useEffect(() => {
    if (isSuccess && lastEmailRef.current && otpSession) {
      setOtpFlow("signin");
      setPendingEmail(lastEmailRef.current);
      navigate(AUTH_VIEW.otpVerify);
    }
  }, [isSuccess, otpSession, navigate, setOtpFlow, setPendingEmail]);

  return {
    title: t("chooseAccountSignInTitle"),
    subtitle: t("forgotPasswordSubtitle"),
    onSubmit,
    isLoading: isPending,
    showBack: canGoBack,
    onBack,
    showAgencyCreateAccount,
    showUserCreateAccount,
    agencyNoAccountText: t("agencySignInNoAccount"),
    agencyCreateAccountText: t("agencyCreateAccount"),
    onAgencyCreateAccountClick: onCreateAccountClick,
    userNoAccountText: t("chooseAccountNoAccount"),
    userCreateAccountText: t("chooseAccountCreateAccount"),
    onUserCreateAccountClick: onCreateAccountClick,
    termsText,
    privacyText,
  };
}
