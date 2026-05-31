"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import {
  resolveSocialSignInViewForAccountType,
} from "../authViews";
import type { SocialAccountType } from "../components/SocialAuthForm";
import { useAuthStore } from "../store/auth.store";
import { useAuthModalNavigation } from "./useAuthPortal";
import { useAuthScreenLegalFooter } from "./authScreen.utils";

type UseSocialRegistrationScreenParams = {
  type: SocialAccountType;
};

export function useSocialRegistrationScreen({ type }: UseSocialRegistrationScreenParams) {
  const t = useTranslations("auth");
  const { termsText, privacyText } = useAuthScreenLegalFooter();
  const navigate = useAuthStore((state) => state.navigate);
  const { onBack, canGoBack } = useAuthModalNavigation();
  const [isUpcomingFeatureModalOpen, setIsUpcomingFeatureModalOpen] = useState(false);

  const onSocialProviderClick = useCallback(() => {
    setIsUpcomingFeatureModalOpen(true);
  }, []);

  const onCloseUpcomingFeatureModal = useCallback(() => {
    setIsUpcomingFeatureModalOpen(false);
  }, []);

  const onSignInClick = useCallback(() => {
    navigate(resolveSocialSignInViewForAccountType(type));
  }, [navigate, type]);

  return {
    title: t("chooseAccountSignUpTitle"),
    subtitle: t("socialSignUpWelcome"),
    accountType: type,
    onSocialProviderClick,
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
