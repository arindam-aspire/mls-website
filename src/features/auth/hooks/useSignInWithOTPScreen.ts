"use client";

import { useCallback, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { AUTH_VIEW } from "../authViews";
import type { SignInOtpMethod, SignInWithOTPFormValues } from "../components/SignInWithOTPForm";
import { useSignInWithOtpRequest } from "../mutations/auth.mutation";
import { useAuthStore } from "@/src/features/auth/store/auth.store";
import { resolveSignInOtpUsername } from "../utils/signInOtpUsername";
import { useAuthModalNavigation } from "./useAuthPortal";
import { useAuthFlowContext, useAuthScreenLegalFooter } from "./authScreen.utils";

export function useSignInWithOTPScreen() {
  const t = useTranslations("auth");
  const { termsText, privacyText } = useAuthScreenLegalFooter();
  const navigate = useAuthStore((state) => state.navigate);
  const { onBack, canGoBack } = useAuthModalNavigation();
  const setOtpFlow = useAuthStore((state) => state.setOtpFlow);
  const setPendingEmail = useAuthStore((state) => state.setPendingEmail);
  const setPendingPhone = useAuthStore((state) => state.setPendingPhone);
  const setPendingPhoneCountry = useAuthStore((state) => state.setPendingPhoneCountry);
  const otpSession = useAuthStore((state) => state.otpSession);
  const {
    isAgency,
    isAgent,
    signUpView,
  } = useAuthFlowContext();
  const showAgencyCreateAccount = isAgency && !isAgent;
  const showUserCreateAccount = !showAgencyCreateAccount && !isAgency;

  const { mutate: requestOtp, isPending, isSuccess } = useSignInWithOtpRequest();
  const lastUsernameRef = useRef<string | null>(null);

  const onSubmit = useCallback(
    (values: SignInWithOTPFormValues, method: SignInOtpMethod) => {
      const username =
        method === "phone"
          ? resolveSignInOtpUsername({
              phoneCountryCode: values.phoneCountryCode,
              phoneNationalNumber: values.phoneNationalNumber,
            })
          : values.email.trim();

      if (!username) return;

      if (method === "phone") {
        setPendingEmail(null);
        setPendingPhone(values.phoneNationalNumber);
        setPendingPhoneCountry(values.phoneCountryCode);
      } else {
        setPendingEmail(username);
        setPendingPhone(null);
        setPendingPhoneCountry(null);
      }

      lastUsernameRef.current = username;
      requestOtp({ username });
    },
    [
      requestOtp,
      setPendingEmail,
      setPendingPhone,
      setPendingPhoneCountry,
    ],
  );

  const onCreateAccountClick = useCallback(() => {
    navigate(signUpView);
  }, [navigate, signUpView]);

  useEffect(() => {
    if (isSuccess && lastUsernameRef.current && otpSession) {
      setOtpFlow("signin");
      navigate(AUTH_VIEW.otpVerify);
    }
  }, [isSuccess, otpSession, navigate, setOtpFlow]);

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
