"use client";

import { useCallback } from "react";
import { useTranslations } from "next-intl";
import { AUTH_VIEW, resolveSignInViewFromSignUpReturnView } from "../authViews";
import {
  useAgencySignUp,
  useConfirmSignUp,
  useSignUp,
} from "../mutations/auth.mutation";
import { useToast } from "@/src/hooks/useToast";
import { useAuthStore } from "../store/auth.store";
import { useAuthModalNavigation } from "./useAuthPortal";
import { useAuthScreenLegalFooter } from "./authScreen.utils";

export function useConfirmSignUpScreen() {
  const t = useTranslations("auth");
  const { termsText, privacyText } = useAuthScreenLegalFooter();
  const pop = useAuthStore((state) => state.pop);
  const navigate = useAuthStore((state) => state.navigate);
  const screenStack = useAuthStore((state) => state.screenStack);
  const { canGoBack } = useAuthModalNavigation();
  const pendingSignUp = useAuthStore((state) => state.pendingSignUp);
  const pendingAgencySignUp = useAuthStore((state) => state.pendingAgencySignUp);
  const pendingEmail = useAuthStore((state) => state.pendingEmail);
  const clearPendingSignUp = useAuthStore((state) => state.clearPendingSignUp);
  const clearPendingAgencySignUp = useAuthStore((state) => state.clearPendingAgencySignUp);
  const toast = useToast();

  const isAgencyConfirm =
    pendingAgencySignUp != null ||
    screenStack.includes(AUTH_VIEW.agencySignUp);
  const registrationView = isAgencyConfirm
    ? AUTH_VIEW.agencySignUp
    : screenStack.includes(AUTH_VIEW.ownerSignUp)
      ? AUTH_VIEW.ownerSignUp
      : AUTH_VIEW.userSignUp;
  const signInViewFromSignUp = resolveSignInViewFromSignUpReturnView(registrationView);
  const contactEmail =
    pendingEmail?.trim() ||
    (isAgencyConfirm ? pendingAgencySignUp?.email : pendingSignUp?.email);
  const contactPhone = isAgencyConfirm ? undefined : pendingSignUp?.phone_number;

  const { mutate: confirmSignUpMutate, isPending: isVerifying } =
    useConfirmSignUp();
  const { mutate: resendUserSignUp, isPending: isResendingUserSignUp } =
    useSignUp();
  const { mutate: resendAgencySignUp, isPending: isResendingAgencySignUp } =
    useAgencySignUp();
  const isResending = isAgencyConfirm
    ? isResendingAgencySignUp
    : isResendingUserSignUp;

  const onBack = useCallback(() => {
    clearPendingSignUp();
    clearPendingAgencySignUp();
    pop();
  }, [clearPendingAgencySignUp, clearPendingSignUp, pop]);

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
            clearPendingSignUp();
            clearPendingAgencySignUp();
            navigate(signInViewFromSignUp);
          },
        },
      );
    },
    [
      clearPendingAgencySignUp,
      clearPendingSignUp,
      confirmSignUpMutate,
      contactEmail,
      navigate,
      signInViewFromSignUp,
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
    navigate(signInViewFromSignUp);
  }, [navigate, signInViewFromSignUp]);

  return {
    title: t("confirmSignUpTitle"),
    subtitle: t("confirmSignUpSubtitle"),
    contactEmail,
    contactPhone,
    onSubmit,
    onResend,
    isLoading: isVerifying,
    isResending,
    showBack: canGoBack,
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
