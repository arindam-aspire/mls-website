"use client";

import { useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/src/i18n/navigation";
import {
  AUTH_QUERY_KEY,
  AUTH_VIEW,
  resolveEmailSignInView,
  type AuthView,
} from "../authViews";
import type { SocialAccountType } from "../components/SocialAuthForm";
import { useSignInWithPassword } from "../mutations/auth.mutation";
import { SignInFormValues, resolveSignInRole } from "../types/auth.types";
import { useAuthScreenLegalFooter } from "./authScreen.utils";

type UseSignInScreenParams = {
  type: SocialAccountType;
  onSighinSuccess: () => void;
};

export function useSignInScreen({ type, onSighinSuccess }: UseSignInScreenParams) {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("auth");
  const { termsText, privacyText } = useAuthScreenLegalFooter();
  const { mutate: signInWithPassword, isPending, isSuccess: isLoginSuccess } =
    useSignInWithPassword();

  const socialSignInView =
    type === "user" ? AUTH_VIEW.userSocialSignIn : AUTH_VIEW.ownerSocialSignIn;
  const signUpView =
    type === "user" ? AUTH_VIEW.userSocialSignUp : AUTH_VIEW.ownerSocialSignUp;

  const openAuthView = useCallback(
    (view: AuthView) => {
      router.replace(`${pathname}?${AUTH_QUERY_KEY}=${view}`);
    },
    [pathname, router],
  );

  const onBack = useCallback(() => {
    openAuthView(socialSignInView);
  }, [openAuthView, socialSignInView]);

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
    openAuthView(signUpView);
  }, [openAuthView, signUpView]);

  useEffect(() => {
    if (isLoginSuccess) {
      onSighinSuccess();
    }
  }, [isLoginSuccess, onSighinSuccess]);

  return {
    title: t("signInFormTitle"),
    subtitle: t("signInFormSubtitle"),
    signInReturnView: resolveEmailSignInView(type),
    onClickSignIn,
    isLoading: isPending,
    onBack,
    noAccountText: t("chooseAccountNoAccount"),
    createAccountText: t("chooseAccountCreateAccount"),
    onCreateAccountClick,
    termsText,
    privacyText,
  };
}
