"use client";

import { useCallback } from "react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/src/i18n/navigation";
import { useSearchParams } from "next/navigation";
import {
  AUTH_OTP_EMAIL_QUERY_KEY,
  AUTH_RETURN_VIEW_QUERY_KEY,
  AUTH_VIEW,
  buildAuthModalUrl,
  resolveSignInViewFromSignUpReturnView,
  type AuthView,
} from "../authViews";
import {
  useAgencySignUp,
  useConfirmSignUp,
  useSignUp,
} from "../mutations/auth.mutation";
import { useToast } from "@/src/hooks/useToast";
import { useAuthStore } from "../store/auth.store";
import { resolveAuthReturnView, useAuthScreenLegalFooter } from "./authScreen.utils";

export function useConfirmSignUpScreen() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations("auth");
  const { termsText, privacyText } = useAuthScreenLegalFooter();
  const toast = useToast();

  const pendingSignUp = useAuthStore((s) => s.pendingSignUp);
  const pendingAgencySignUp = useAuthStore((s) => s.pendingAgencySignUp);
  const clearPendingSignUp = useAuthStore((s) => s.clearPendingSignUp);
  const clearPendingAgencySignUp = useAuthStore((s) => s.clearPendingAgencySignUp);

  const returnView = resolveAuthReturnView(
    searchParams.get(AUTH_RETURN_VIEW_QUERY_KEY),
    AUTH_VIEW.userSignUp,
  );
  const isAgencyConfirm = returnView === AUTH_VIEW.agencySignUp;
  const contactEmail =
    searchParams.get(AUTH_OTP_EMAIL_QUERY_KEY)?.trim() ||
    (isAgencyConfirm ? pendingAgencySignUp?.email : pendingSignUp?.email);
  const contactPhone = isAgencyConfirm ? undefined : pendingSignUp?.phone_number;
  const signInView = resolveSignInViewFromSignUpReturnView(returnView);

  const { mutate: confirmSignUpMutate, isPending: isVerifying } =
    useConfirmSignUp();
  const { mutate: resendUserSignUp, isPending: isResendingUserSignUp } =
    useSignUp();
  const { mutate: resendAgencySignUp, isPending: isResendingAgencySignUp } =
    useAgencySignUp();
  const isResending = isAgencyConfirm
    ? isResendingAgencySignUp
    : isResendingUserSignUp;

  const clearPendingRegistration = useCallback(() => {
    clearPendingSignUp();
    clearPendingAgencySignUp();
  }, [clearPendingAgencySignUp, clearPendingSignUp]);

  const openAuthView = useCallback(
    (view: AuthView) => {
      router.replace(buildAuthModalUrl(pathname, view));
    },
    [pathname, router],
  );

  const onBack = useCallback(() => {
    clearPendingRegistration();
    openAuthView(returnView);
  }, [clearPendingRegistration, openAuthView, returnView]);

  const onSubmit = useCallback(
    (code: string) => {
      if (!contactEmail?.trim()) {
        toast.info("Unable to verify", {
          description: "Email address is missing.",
        });
        return;
      }

      confirmSignUpMutate(
        {
          email: contactEmail.trim(),
          code,
        },
        {
          onSuccess: () => {
            clearPendingRegistration();
            router.replace(buildAuthModalUrl(pathname, signInView));
          },
        },
      );
    },
    [
      clearPendingRegistration,
      confirmSignUpMutate,
      contactEmail,
      pathname,
      router,
      signInView,
      toast,
    ],
  );

  const onResend = useCallback(() => {
    if (isAgencyConfirm) {
      if (!pendingAgencySignUp) {
        toast.info("Unable to resend", {
          description: "Registration details are missing.",
        });
        return;
      }

      resendAgencySignUp({
        agency_name: pendingAgencySignUp.agencyName,
        agency_trade_name: pendingAgencySignUp.tradeName,
        email: pendingAgencySignUp.email,
        phone: pendingAgencySignUp.phone,
        password: pendingAgencySignUp.password,
        legal_document: pendingAgencySignUp.legalDocument,
      });
      return;
    }

    if (!pendingSignUp) {
      toast.info("Unable to resend", {
        description: "Email address is missing.",
      });
      return;
    }

    resendUserSignUp(pendingSignUp);
  }, [
    isAgencyConfirm,
    pendingAgencySignUp,
    pendingSignUp,
    resendAgencySignUp,
    resendUserSignUp,
    toast,
  ]);

  const onSignInClick = useCallback(() => {
    openAuthView(signInView);
  }, [openAuthView, signInView]);

  return {
    title: t("confirmSignUpTitle"),
    subtitle: t("confirmSignUpSubtitle"),
    contactEmail,
    contactPhone,
    onSubmit,
    onResend,
    isLoading: isVerifying,
    isResending,
    onBack,
    hasAccountText: isAgencyConfirm
      ? t("agencySignUpHasAccount")
      : t("socialSignUpHasAccount"),
    signInText: t("socialSignUpLogIn"),
    onSignInClick,
    termsText,
    privacyText,
  };
}
