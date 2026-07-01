"use client";

import { useCallback } from "react";
import { useTranslations } from "next-intl";
import { AUTH_VIEW } from "../authViews";
import { useSignInWithPassword } from "../mutations/auth.mutation";
import { SignInFormValues } from "../types/auth.types";
import { useAuthStore } from "@/src/features/auth/store/auth.store";
import { useAuthModalNavigation, useIsAgentSignInPortal } from "./useAuthPortal";
import { useAuthScreenLegalFooter } from "./authScreen.utils";

export function useAgencyEmailSignInScreen() {
  const t = useTranslations("auth");
  const { termsText, privacyText } = useAuthScreenLegalFooter();
  const navigate = useAuthStore((state) => state.navigate);
  const { onBack, canGoBack } = useAuthModalNavigation();
  const isAgent = useIsAgentSignInPortal();
  const { mutate: signInWithPassword, isPending } = useSignInWithPassword();

  const onAgencySignUpClick = useCallback(() => {
    navigate(AUTH_VIEW.agencySignUp);
  }, [navigate]);

  const onClickSignIn = useCallback(
    (values: SignInFormValues) => {
      signInWithPassword(values);
    },
    [signInWithPassword],
  );

  return {
    title: t("signInFormTitle"),
    subtitle: isAgent ? t("agentSignInFormSubtitle") : t("signInFormSubtitle"),
    onClickSignIn,
    isLoading: isPending,
    showBack: canGoBack,
    onBack,
    isAgent,
    agencyNoAccountText: t("agencySignInNoAccount"),
    agencyCreateAccountText: t("agencyCreateAccount"),
    onAgencySignUpClick,
    termsText,
    privacyText,
  };
}
