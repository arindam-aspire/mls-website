"use client";

import { useCallback } from "react";
import { useTranslations } from "next-intl";
import { resolveSocialSignUpViewForAccountType } from "../authViews";
import type { SocialAccountType } from "../components/SocialAuthForm";
import { useAuthStore } from "@/src/features/auth/store/auth.store";
import { useAuthModalNavigation } from "./useAuthPortal";
import { useAuthScreenLegalFooter } from "./authScreen.utils";
import { useSocialProviderAuth } from "./useSocialProviderAuth";

type UseSocialSignInScreenParams = {
  type: SocialAccountType;
};

export function useSocialSignInScreen({ type }: UseSocialSignInScreenParams) {
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

  const onCreateAccountClick = useCallback(() => {
    navigate(resolveSocialSignUpViewForAccountType(type));
  }, [navigate, type]);

  return {
    title: t("chooseAccountSignInTitle"),
    subtitle: t("socialSignInWelcome"),
    accountType: type,
    onSocialProviderClick,
    pendingProvider,
    showBack: canGoBack,
    onBack,
    noAccountText: t("socialSignInNoAccount"),
    createAccountText: t("chooseAccountCreateAccount"),
    onCreateAccountClick,
    isUpcomingFeatureModalOpen,
    onCloseUpcomingFeatureModal,
    termsText,
    privacyText,
  };
}
