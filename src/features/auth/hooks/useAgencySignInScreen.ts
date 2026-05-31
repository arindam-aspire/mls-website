"use client";

import { useCallback } from "react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/src/i18n/navigation";
import { AUTH_VIEW, buildAuthModalUrl, type AuthView } from "../authViews";
import { useIsAgentSignInPortal } from "./useAuthPortal";
import { useAuthScreenLegalFooter } from "./authScreen.utils";

export function useAgencySignInScreen() {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("auth");
  const { termsText, privacyText } = useAuthScreenLegalFooter();
  const isAgent = useIsAgentSignInPortal();

  const openAuthView = useCallback(
    (view: AuthView) => {
      router.replace(
        buildAuthModalUrl(pathname, view, {
          returnView: AUTH_VIEW.agencySignIn,
        }),
      );
    },
    [pathname, router],
  );

  const onAgencySignUpClick = useCallback(() => {
    openAuthView(AUTH_VIEW.agencySignUp);
  }, [openAuthView]);

  return {
    portalBadgeText: isAgent ? t("agentPortalBadge") : t("agencyPortalBadge"),
    title: t("chooseAccountSignInTitle"),
    subtitle: isAgent ? t("agentSignInSubtitle") : t("agencySignInSubtitle"),
    isAgent,
    agencyNoAccountText: t("agencySignInNoAccount"),
    agencyCreateAccountText: t("agencyCreateAccount"),
    onAgencySignUpClick,
    termsText,
    privacyText,
  };
}
