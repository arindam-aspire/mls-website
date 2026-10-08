"use client";

import { useCallback } from "react";
import { useTranslations } from "next-intl";
import { resolveSocialSignInViewForAccountType } from "../authViews";
import type { SocialAccountType } from "../components/SocialAuthForm";
import { useAuthStore } from "@/src/features/auth/store/auth.store";
import { useAuthModalNavigation } from "./useAuthPortal";
import { useAuthScreenLegalFooter } from "./authScreen.utils";
import { useSocialProviderAuth } from "./useSocialProviderAuth";

type UseSocialRegistrationScreenParams = {
  type: SocialAccountType;
};

export function useSocialRegistrationScreen({ type }: UseSocialRegistrationScreenParams) {
  const t = useTranslations("auth");
  const { termsText, privacyText } = useAuthScreenLegalFooter();
  const navigate = useAuthStore((state) => state.navigate);
  const { onBack, canGoBack } = useAuthModalNavigation();
  const {
    onSocialProviderClick,
    pendingProvider,
    isUpcomingFeatureModalOpen,
    onCloseUpcomingFeatureModal,
  } = useSocialProviderAuth({ accountType: type });

  const onSignInClick = useCallback(() => {
    navigate(resolveSocialSignInViewForAccountType(type));
  }, [navigate, type]);

  return {
    title: t("chooseAccountSignUpTitle"),
    subtitle: t("socialSignUpWelcome"),
    accountType: type,
    onSocialProviderClick,
    pendingProvider,
    showBack: canGoBack,
    onBack,
    hasAccountText: t("socialSignUpHasAccount"),
    signInText: t("socialSignUpLogIn"),
    onSignInClick,
    isUpcomingFeatureModalOpen,
    onCloseUpcomingFeatureModal,
    termsText,
    privacyText,
  };
}
