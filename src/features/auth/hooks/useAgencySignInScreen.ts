"use client";

import { useCallback } from "react";
import { useTranslations } from "next-intl";
import { AUTH_VIEW } from "../authViews";
import { useAuthStore } from "@/src/features/auth/store/auth.store";
import { useAuthModalNavigation, useIsAgentSignInPortal } from "./useAuthPortal";
import { useAuthScreenLegalFooter } from "./authScreen.utils";

export function useAgencySignInScreen() {
  const t = useTranslations("auth");
  const { termsText, privacyText } = useAuthScreenLegalFooter();
  const navigate = useAuthStore((state) => state.navigate);
  const { onBack, canGoBack } = useAuthModalNavigation();
  const isAgent = useIsAgentSignInPortal();

  const onAgencySignUpClick = useCallback(() => {
    navigate(AUTH_VIEW.agencySignUp);
  }, [navigate]);

  return {
    portalBadgeText: isAgent ? t("agentPortalBadge") : t("agencyPortalBadge"),
    title: t("chooseAccountSignInTitle"),
    subtitle: isAgent ? t("agentSignInSubtitle") : t("agencySignInSubtitle"),
    isAgent,
    agencyNoAccountText: t("agencySignInNoAccount"),
    agencyCreateAccountText: t("agencyCreateAccount"),
    onAgencySignUpClick,
    showBack: canGoBack,
    onBack,
    termsText,
    privacyText,
  };
}
