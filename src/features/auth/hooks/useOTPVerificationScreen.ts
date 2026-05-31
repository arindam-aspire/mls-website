"use client";

import { useCallback, useEffect, useMemo } from "react";
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
  isAgencyAuthView,
  resolveAuthSignUpView,
  resolveSignInOtpSession,
  resolveSignInRoleFromAuthContext,
  type AuthView,
} from "../authViews";
import {
  useForgotPassword,
  useSignInWithOtpRequest,
  useSignInWithOtpVerify,
} from "../mutations/auth.mutation";
import { useAuthStore } from "../store/auth.store";
import { useAuthPortal, useIsAgentSignInPortal } from "./useAuthPortal";
import {
  resolveAuthReturnView,
  resolveOtpBackView,
  resolveOtpFlow,
  useAuthScreenLegalFooter,
} from "./authScreen.utils";

type UseOTPVerificationScreenParams = {
  onSighinSuccess: () => void;
};

export function useOTPVerificationScreen({
  onSighinSuccess,
}: UseOTPVerificationScreenParams) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations("auth");
  const { termsText, privacyText } = useAuthScreenLegalFooter();

  const returnView = resolveAuthReturnView(
    searchParams.get(AUTH_RETURN_VIEW_QUERY_KEY),
    AUTH_VIEW.userSignIn,
  );
  const otpFlow = resolveOtpFlow(searchParams.get(AUTH_OTP_FLOW_QUERY_KEY));
  const contactEmail = searchParams.get(AUTH_OTP_EMAIL_QUERY_KEY) ?? undefined;
  const contactPhone = searchParams.get(AUTH_OTP_PHONE_QUERY_KEY) ?? undefined;
  const contactPhoneCountry =
    searchParams.get(AUTH_OTP_PHONE_COUNTRY_QUERY_KEY) ?? undefined;
  const signUpView = resolveAuthSignUpView(returnView);
  const isAgency = isAgencyAuthView(returnView);
  const portal = useAuthPortal();
  const isAgent = useIsAgentSignInPortal();
  const showAgencyCreateAccount = isAgency && !isAgent;
  const showUserCreateAccount = !showAgencyCreateAccount && !isAgency;
  const signInRole = resolveSignInRoleFromAuthContext(returnView, portal);
  const { setForgotPasswordOtp, pendingOtpSession } = useAuthStore();
  const signInOtpSession = resolveSignInOtpSession(
    searchParams,
    pendingOtpSession,
  );

  const { mutate: resendOtp, isPending: isResending } = useForgotPassword();
  const { mutate: resendSignInOtp, isPending: isResendingSignInOtp } =
    useSignInWithOtpRequest();
  const {
    mutate: verifyOtp,
    isPending: isVerifying,
    isSuccess: isOtpVerifySuccess,
  } = useSignInWithOtpVerify();
  const isResendingOtp = otpFlow === "forgot" ? isResending : isResendingSignInOtp;

  const portalOptions = useMemo(
    () => (portal ? { portal } : undefined),
    [portal],
  );

  const buildSignInOtpVerifyUrl = useCallback(
    (otpSession: string, otpCode: string) =>
      buildAuthModalUrl(pathname, AUTH_VIEW.otpVerify, {
        otpFlow: "signin",
        returnView,
        contactEmail,
        portal: portal ?? undefined,
        otpSession,
        otpCode,
      }),
    [contactEmail, pathname, portal, returnView],
  );

  const openAuthView = useCallback(
    (view: AuthView) => {
      router.replace(buildAuthModalUrl(pathname, view, portalOptions));
    },
    [pathname, portalOptions, router],
  );

  const onBack = useCallback(() => {
    openAuthView(resolveOtpBackView(otpFlow, returnView));
  }, [openAuthView, otpFlow, returnView]);

  const onResend = useCallback(() => {
    if (otpFlow === "forgot") {
      resendOtp({
        email: contactEmail,
        phoneCountryCode: contactPhoneCountry,
        phoneNationalNumber: contactPhone,
      });
      return;
    }

    if (contactEmail?.trim()) {
      resendSignInOtp(
        {
          username: contactEmail.trim(),
          role: signInRole,
        },
        {
          onSuccess: (response) => {
            router.replace(
              buildSignInOtpVerifyUrl(
                response.data.session,
                response.data.otp,
              ),
            );
          },
        },
      );
    }
  }, [
    buildSignInOtpVerifyUrl,
    contactEmail,
    contactPhone,
    contactPhoneCountry,
    otpFlow,
    resendOtp,
    resendSignInOtp,
    router,
    signInRole,
  ]);

  const onSubmit = useCallback(
    (code: string) => {
      if (otpFlow === "forgot") {
        setForgotPasswordOtp(code);
        router.replace(
          buildAuthModalUrl(pathname, AUTH_VIEW.resetPassword, {
            returnView,
            otpFlow,
            contactEmail,
            contactPhone,
            contactPhoneCountry,
            portal: portal ?? undefined,
          }),
        );
        return;
      }

      if (signInOtpSession?.session == null || !contactEmail?.trim()) {
        router.replace(
          buildAuthModalUrl(pathname, AUTH_VIEW.signInOtp, {
            returnView,
            portal: portal ?? undefined,
          }),
        );
        return;
      }

      verifyOtp({
        username: contactEmail.trim(),
        code,
        session: signInOtpSession.session,
        role: signInRole,
      });
    },
    [
      contactEmail,
      contactPhone,
      contactPhoneCountry,
      otpFlow,
      pathname,
      portal,
      returnView,
      router,
      setForgotPasswordOtp,
      signInOtpSession,
      signInRole,
      verifyOtp,
    ],
  );

  const onCreateAccountClick = useCallback(() => {
    openAuthView(signUpView);
  }, [openAuthView, signUpView]);

  useEffect(() => {
    if (isOtpVerifySuccess && otpFlow === "signin") {
      onSighinSuccess();
    }
  }, [isOtpVerifySuccess, otpFlow, onSighinSuccess]);

  return {
    contactEmail,
    contactPhone,
    contactPhoneCountry,
    displayOtp: otpFlow === "signin" ? signInOtpSession?.otp : undefined,
    otpFlow,
    onSubmit,
    onResend,
    isLoading: isVerifying,
    isResending: isResendingOtp,
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
