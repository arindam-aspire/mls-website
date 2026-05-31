"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/src/i18n/navigation";
import { AUTH_QUERY_KEY, AUTH_VIEW, type AuthView } from "../authViews";
import type { SocialAccountType } from "../components/SocialAuthForm";
import { useAuthScreenLegalFooter } from "./authScreen.utils";

type UseSocialRegistrationScreenParams = {
  type: SocialAccountType;
};

export function useSocialRegistrationScreen({ type }: UseSocialRegistrationScreenParams) {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("auth");
  const { termsText, privacyText } = useAuthScreenLegalFooter();
  const [isUpcomingFeatureModalOpen, setIsUpcomingFeatureModalOpen] = useState(false);

  const signInView =
    type === "user" ? AUTH_VIEW.userSocialSignIn : AUTH_VIEW.ownerSocialSignIn;

  const openAuthView = useCallback(
    (view: AuthView) => {
      router.replace(`${pathname}?${AUTH_QUERY_KEY}=${view}`);
    },
    [pathname, router],
  );

  const onSocialProviderClick = useCallback(() => {
    setIsUpcomingFeatureModalOpen(true);
  }, []);

  const onCloseUpcomingFeatureModal = useCallback(() => {
    setIsUpcomingFeatureModalOpen(false);
  }, []);

  const onSignInClick = useCallback(() => {
    openAuthView(signInView);
  }, [openAuthView, signInView]);

  return {
    title: t("chooseAccountSignUpTitle"),
    subtitle: t("socialSignUpWelcome"),
    accountType: type,
    onSocialProviderClick,
    hasAccountText: t("socialSignUpHasAccount"),
    signInText: t("socialSignUpLogIn"),
    onSignInClick,
    isUpcomingFeatureModalOpen,
    onCloseUpcomingFeatureModal,
    termsText,
    privacyText,
  };
}
