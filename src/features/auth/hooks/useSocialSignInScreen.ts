"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/src/i18n/navigation";
import { AUTH_QUERY_KEY, AUTH_VIEW, type AuthView } from "../authViews";
import type { SocialAccountType } from "../components/SocialAuthForm";
import { useAuthScreenLegalFooter } from "./authScreen.utils";

type UseSocialSignInScreenParams = {
  type: SocialAccountType;
};

export function useSocialSignInScreen({ type }: UseSocialSignInScreenParams) {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("auth");
  const { termsText, privacyText } = useAuthScreenLegalFooter();
  const [isUpcomingFeatureModalOpen, setIsUpcomingFeatureModalOpen] = useState(false);

  const signUpView =
    type === "user" ? AUTH_VIEW.userSocialSignUp : AUTH_VIEW.ownerSocialSignUp;

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

  const onCreateAccountClick = useCallback(() => {
    openAuthView(signUpView);
  }, [openAuthView, signUpView]);

  return {
    title: t("chooseAccountSignInTitle"),
    subtitle: t("socialSignInWelcome"),
    accountType: type,
    onSocialProviderClick,
    noAccountText: t("socialSignInNoAccount"),
    createAccountText: t("chooseAccountCreateAccount"),
    onCreateAccountClick,
    isUpcomingFeatureModalOpen,
    onCloseUpcomingFeatureModal,
    termsText,
    privacyText,
  };
}
