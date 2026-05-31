"use client";

import { useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  AUTH_VIEW,
  resolveSocialSignInViewForAccountType,
} from "../authViews";
import type { SocialAccountType } from "../components/SocialAuthForm";
import type { SignUpFormValues } from "../types/auth.types";
import { useSignUp } from "../mutations/auth.mutation";
import { useAuthStore } from "../store/auth.store";
import { useAuthModalNavigation } from "./useAuthPortal";
import { useAuthScreenLegalFooter } from "./authScreen.utils";

type UseUserRegistrationScreenParams = {
  type: SocialAccountType;
};

export function useUserRegistrationScreen({ type }: UseUserRegistrationScreenParams) {
  const t = useTranslations("auth");
  const { termsText, privacyText } = useAuthScreenLegalFooter();
  const navigate = useAuthStore((state) => state.navigate);
  const { onBack, canGoBack } = useAuthModalNavigation();
  const setPendingSignUp = useAuthStore((state) => state.setPendingSignUp);
  const setPendingEmail = useAuthStore((state) => state.setPendingEmail);
  const pendingSignUp = useAuthStore((state) => state.pendingSignUp);

  const { mutate: signUpMutate, isPending, isSuccess } = useSignUp();

  const onSubmit = useCallback(
    (values: SignUpFormValues) => {
      setPendingSignUp(values);
      setPendingEmail(values.email);
      signUpMutate(values);
    },
    [setPendingEmail, setPendingSignUp, signUpMutate],
  );

  const onSignInClick = useCallback(() => {
    navigate(resolveSocialSignInViewForAccountType(type));
  }, [navigate, type]);

  useEffect(() => {
    if (isSuccess && pendingSignUp?.email) {
      setPendingEmail(pendingSignUp.email);
      navigate(AUTH_VIEW.confirmSignUp);
    }
  }, [isSuccess, pendingSignUp, navigate, setPendingEmail]);

  return {
    title: t("signUpFormTitle"),
    subtitle: t("signUpFormSubtitle"),
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
