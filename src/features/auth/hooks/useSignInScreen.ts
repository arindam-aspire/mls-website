"use client";

import { useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  resolveSocialSignUpViewForAccountType,
} from "../authViews";
import type { SocialAccountType } from "../components/SocialAuthForm";
import { useSignInWithPassword } from "../mutations/auth.mutation";
import { SignInFormValues, resolveSignInRole } from "../types/auth.types";
import { useAuthStore } from "../store/auth.store";
import { useAuthModalNavigation } from "./useAuthPortal";
import { useAuthScreenLegalFooter } from "./authScreen.utils";

type UseSignInScreenParams = {
  type: SocialAccountType;
};

export function useSignInScreen({ type }: UseSignInScreenParams) {
  const t = useTranslations("auth");
  const { termsText, privacyText } = useAuthScreenLegalFooter();
  const navigate = useAuthStore((state) => state.navigate);
  const { onBack, canGoBack } = useAuthModalNavigation();
  const closeAuth = useAuthStore((state) => state.closeAuth);
  const { mutate: signInWithPassword, isPending, isSuccess: isLoginSuccess } =
    useSignInWithPassword();

  const onClickSignIn = useCallback(
    (values: SignInFormValues) => {
      signInWithPassword({
        ...values,
        role: resolveSignInRole(type),
      });
    },
    [signInWithPassword, type],
  );

  const onCreateAccountClick = useCallback(() => {
    navigate(resolveSocialSignUpViewForAccountType(type));
  }, [navigate, type]);

  useEffect(() => {
    if (isLoginSuccess) {
      closeAuth();
    }
  }, [closeAuth, isLoginSuccess]);

  return {
    title: t("signInFormTitle"),
    subtitle: t("signInFormSubtitle"),
    onClickSignIn,
    isLoading: isPending,
    showBack: canGoBack,
    onBack,
    noAccountText: t("chooseAccountNoAccount"),
    createAccountText: t("chooseAccountCreateAccount"),
    onCreateAccountClick,
    termsText,
    privacyText,
  };
}
