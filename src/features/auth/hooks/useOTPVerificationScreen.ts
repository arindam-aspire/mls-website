"use client";

import { useCallback } from "react";
import { useTranslations } from "next-intl";
import { AUTH_VIEW } from "../authViews";
import {
  useForgotPassword,
  useSignInWithOtpRequest,
  useSignInWithOtpVerify,
} from "../mutations/auth.mutation";
import { useAuthStore } from "@/src/features/auth/store/auth.store";
import { resolveSignInOtpUsername } from "../utils/signInOtpUsername";
import { useAuthModalNavigation } from "./useAuthPortal";
import { useAuthFlowContext, useAuthScreenLegalFooter } from "./authScreen.utils";

export function useOTPVerificationScreen() {
  const t = useTranslations("auth");
  const { termsText, privacyText } = useAuthScreenLegalFooter();
  const navigate = useAuthStore((state) => state.navigate);
  const { onBack, canGoBack } = useAuthModalNavigation();
  const otpFlow = useAuthStore((state) => state.otpFlow);
  const pendingEmail = useAuthStore((state) => state.pendingEmail);
  const pendingPhone = useAuthStore((state) => state.pendingPhone);
  const pendingPhoneCountry = useAuthStore((state) => state.pendingPhoneCountry);
  const otpSession = useAuthStore((state) => state.otpSession);
  const setOtpCode = useAuthStore((state) => state.setOtpCode);
  const setOtpSession = useAuthStore((state) => state.setOtpSession);
  const {
    isAgency,
    isAgent,
    signUpView,
  } = useAuthFlowContext();
  const showAgencyCreateAccount = isAgency && !isAgent;
  const showUserCreateAccount = !showAgencyCreateAccount && !isAgency;

  const { mutate: resendOtp, isPending: isResending } = useForgotPassword();
  const { mutate: resendSignInOtp, isPending: isResendingSignInOtp } =
    useSignInWithOtpRequest();
  const { mutate: verifyOtp, isPending: isVerifying } = useSignInWithOtpVerify();
  const isResendingOtp = otpFlow === "forgot" ? isResending : isResendingSignInOtp;

  const signInUsername = resolveSignInOtpUsername({
    email: pendingPhone?.trim() ? null : pendingEmail,
    phoneNationalNumber: pendingPhone,
    phoneCountryCode: pendingPhoneCountry,
  });

  const onResend = useCallback(() => {
    if (otpFlow === "forgot") {
      if (pendingEmail?.trim()) {
        resendOtp({ email: pendingEmail.trim() });
      }
      return;
    }

    if (!signInUsername) return;

    resendSignInOtp(
      { username: signInUsername },
      {
        onSuccess: (response) => {
          setOtpSession(response.data.session);
        },
      },
    );
  }, [
    otpFlow,
    pendingEmail,
    resendOtp,
    resendSignInOtp,
    setOtpSession,
    signInUsername,
  ]);

  const onSubmit = useCallback(
    (code: string) => {
      if (otpFlow === "forgot") {
        setOtpCode(code);
        navigate(AUTH_VIEW.resetPassword);
        return;
      }

      if (otpSession == null || !signInUsername) {
        navigate(AUTH_VIEW.signInOtp);
        return;
      }

      verifyOtp({
        username: signInUsername,
        code,
        session: otpSession,
      });
    },
    [otpFlow, otpSession, signInUsername, navigate, setOtpCode, verifyOtp],
  );

  const onCreateAccountClick = useCallback(() => {
    navigate(signUpView);
  }, [navigate, signUpView]);

  return {
    contactEmail: pendingEmail ?? undefined,
    contactPhone: pendingPhone ?? undefined,
    contactPhoneCountry: pendingPhoneCountry ?? undefined,
    otpFlow: otpFlow ?? "signin",
    onSubmit,
    onResend,
    isLoading: isVerifying,
    isResending: isResendingOtp,
    showBack: canGoBack,
    onBack,
    showAgencyCreateAccount,
    showUserCreateAccount,
    agencyNoAccountText: t("agencySignInNoAccount"),
    agencyCreateAccountText: t("agencyCreateAccount"),
    userNoAccountText: t("chooseAccountNoAccount"),
    userCreateAccountText: t("chooseAccountCreateAccount"),
    onCreateAccountClick,
    termsText,
    privacyText,
  };
}
