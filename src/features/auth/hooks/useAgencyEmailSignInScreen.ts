"use client";

import { useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/src/i18n/navigation";
import { AUTH_VIEW, buildAuthModalUrl } from "../authViews";
import { useSignInWithPassword } from "../mutations/auth.mutation";
import { SignInFormValues, resolveSignInRole } from "../types/auth.types";
import { useAuthPortal, useIsAgentSignInPortal } from "./useAuthPortal";
import { useAuthScreenLegalFooter } from "./authScreen.utils";

type UseAgencyEmailSignInScreenParams = {
  onSighinSuccess: () => void;
};

export function useAgencyEmailSignInScreen({
  onSighinSuccess,
}: UseAgencyEmailSignInScreenParams) {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("auth");
  const { termsText, privacyText } = useAuthScreenLegalFooter();
  const portal = useAuthPortal();
  const isAgent = useIsAgentSignInPortal();
  const { mutate: signInWithPassword, isPending, isSuccess: isLoginSuccess } =
    useSignInWithPassword();

  const onBack = useCallback(() => {
    router.replace(
      buildAuthModalUrl(pathname, AUTH_VIEW.agencySignIn, {
        portal: portal ?? undefined,
      }),
    );
  }, [pathname, portal, router]);

  const onAgencySignUpClick = useCallback(() => {
    router.replace(
      buildAuthModalUrl(pathname, AUTH_VIEW.agencySignUp, {
        returnView: AUTH_VIEW.agencyEmailSignIn,
        portal: portal ?? undefined,
      }),
    );
  }, [pathname, portal, router]);

  const onClickSignIn = useCallback(
    (values: SignInFormValues) => {
      signInWithPassword({
        ...values,
        role: resolveSignInRole(isAgent ? "agent" : "agency"),
      });
    },
    [isAgent, signInWithPassword],
  );

  useEffect(() => {
    if (isLoginSuccess) {
      onSighinSuccess();
    }
  }, [isLoginSuccess, onSighinSuccess]);

  return {
    title: t("signInFormTitle"),
    subtitle: isAgent ? t("agentSignInFormSubtitle") : t("signInFormSubtitle"),
    signInReturnView: AUTH_VIEW.agencySignIn,
    onClickSignIn,
    isLoading: isPending,
    onBack,
    isAgent,
    agencyNoAccountText: t("agencySignInNoAccount"),
    agencyCreateAccountText: t("agencyCreateAccount"),
    onAgencySignUpClick,
    termsText,
    privacyText,
  };
}
