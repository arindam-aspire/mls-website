"use client";

import { useCallback } from "react";
import { useTranslations } from "next-intl";
import { AUTH_VIEW, resolveSignInRoleFromAuthContext } from "../authViews";
import {
  useForgotPassword,
  useSignInWithOtpRequest,
  useSignInWithOtpVerify,
} from "../mutations/auth.mutation";
import { useAuthStore } from "../store/auth.store";
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
  const otpCode = useAuthStore((state) => state.otpCode);
  const setOtpCode = useAuthStore((state) => state.setOtpCode);
  const setOtpSession = useAuthStore((state) => state.setOtpSession);
  const agentPortal = useAuthStore((state) => state.agentPortal);
  const {
    contextView,
    isAgency,
    isAgent,
    signUpView,
  } = useAuthFlowContext();
  const showAgencyCreateAccount = isAgency && !isAgent;
  const showUserCreateAccount = !showAgencyCreateAccount && !isAgency;
  const signInRole = resolveSignInRoleFromAuthContext(contextView, agentPortal);

  const { mutate: resendOtp, isPending: isResending } = useForgotPassword();
  const { mutate: resendSignInOtp, isPending: isResendingSignInOtp } =
    useSignInWithOtpRequest();
  const { mutate: verifyOtp, isPending: isVerifying } = useSignInWithOtpVerify();
  const isResendingOtp = otpFlow === "forgot" ? isResending : isResendingSignInOtp;

  const onResend = useCallback(() => {
    if (otpFlow === "forgot") {
      resendOtp({
        email: pendingEmail ?? undefined,
        phoneCountryCode: pendingPhoneCountry ?? undefined,
        phoneNationalNumber: pendingPhone ?? undefined,
      });
      return;
    }

    if (pendingEmail?.trim()) {
      resendSignInOtp(
        {
          username: pendingEmail.trim(),
          role: signInRole,
        },
        {
          onSuccess: (response) => {
            setOtpSession(response.data.session);
            setOtpCode(response.data.otp);
          },
        },
      );
    }
  }, [
    otpFlow,
    pendingEmail,
    pendingPhone,
    pendingPhoneCountry,
    resendOtp,
    resendSignInOtp,
    setOtpCode,
    setOtpSession,
    signInRole,
  ]);

  const onSubmit = useCallback(
    (code: string) => {
      if (otpFlow === "forgot") {
        setOtpCode(code);
        navigate(AUTH_VIEW.resetPassword);
        return;
      }

      if (otpSession == null || !pendingEmail?.trim()) {
        navigate(AUTH_VIEW.signInOtp);
        return;
      }

      verifyOtp({
        username: pendingEmail.trim(),
        code,
        session: otpSession,
        role: signInRole,
      });
    },
    [otpFlow, otpSession, pendingEmail, navigate, setOtpCode, signInRole, verifyOtp],
  );

  const onCreateAccountClick = useCallback(() => {
    navigate(signUpView);
  }, [navigate, signUpView]);

  return {
    contactEmail: pendingEmail ?? undefined,
    contactPhone: pendingPhone ?? undefined,
    contactPhoneCountry: pendingPhoneCountry ?? undefined,
    displayOtp: otpFlow === "signin" ? otpCode ?? undefined : undefined,
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
