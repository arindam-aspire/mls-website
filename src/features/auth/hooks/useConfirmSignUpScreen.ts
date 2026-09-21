"use client";

import { useCallback } from "react";
import { useTranslations } from "next-intl";
import { AUTH_VIEW, resolveSignInViewFromSignUpReturnView } from "../authViews";
import {
  useConfirmSignUp,
  useResendConfirmation,
  useSignInWithPassword,
} from "../mutations/auth.mutation";
import { useToast } from "@/src/hooks/useToast";
import { useAuthStore } from "@/src/features/auth/store/auth.store";
import { useAuthModalNavigation } from "./useAuthPortal";
import { useAuthScreenLegalFooter } from "./authScreen.utils";

export function useConfirmSignUpScreen() {
  const t = useTranslations("auth");
  const tApi = useTranslations("auth.api");
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
  const { mutate: resendConfirmationMutate, isPending: isResending } =
    useResendConfirmation();
  const { mutate: signInWithPassword, isPending: isSigningIn } =
    useSignInWithPassword();

  const onBack = useCallback(() => {
    clearPendingSignUp();
    clearPendingAgencySignUp();
    pop();
  }, [clearPendingAgencySignUp, clearPendingSignUp, pop]);

  const onSubmit = useCallback(
    (code: string) => {
      if (!contactEmail?.trim()) {
        toast.info(tApi("missingEmailTitle"), {
          description: tApi("missingEmailDescription"),
        });
        return;
      }

      const email = contactEmail.trim();
      const password = isAgencyConfirm
        ? pendingAgencySignUp?.password
        : pendingSignUp?.password;

      confirmSignUpMutate(
        {
          email,
          code,
        },
        {
          onSuccess: () => {
            clearPendingSignUp();
            clearPendingAgencySignUp();

            if (password) {
              signInWithPassword({
                username: email,
                password,
                rememberMe: true,
              });
              return;
            }

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
      isAgencyConfirm,
      navigate,
      pendingAgencySignUp?.password,
      pendingSignUp?.password,
      signInViewFromSignUp,
      signInWithPassword,
      tApi,
      toast,
    ],
  );

  const onResend = useCallback(() => {
    if (!contactEmail?.trim()) {
      toast.info(tApi("missingEmailTitle"), {
        description: tApi("missingEmailDescription"),
      });
      return;
    }

    resendConfirmationMutate({ email: contactEmail.trim() });
  }, [contactEmail, resendConfirmationMutate, tApi, toast]);

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
    isLoading: isVerifying || isSigningIn,
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
