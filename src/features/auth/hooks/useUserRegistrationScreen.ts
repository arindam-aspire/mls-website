"use client";

import { useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/src/i18n/navigation";
import { AUTH_QUERY_KEY, AUTH_VIEW, buildAuthModalUrl, type AuthView } from "../authViews";
import type { SocialAccountType } from "../components/SocialAuthForm";
import type { SignUpFormValues } from "../types/auth.types";
import { useSignUp } from "../mutations/auth.mutation";
import { useAuthStore } from "../store/auth.store";
import { useAuthScreenLegalFooter } from "./authScreen.utils";

type UseUserRegistrationScreenParams = {
  type: SocialAccountType;
};

export function useUserRegistrationScreen({ type }: UseUserRegistrationScreenParams) {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("auth");
  const { termsText, privacyText } = useAuthScreenLegalFooter();

  const socialSignUpView =
    type === "user" ? AUTH_VIEW.userSocialSignUp : AUTH_VIEW.ownerSocialSignUp;
  const signInView =
    type === "user" ? AUTH_VIEW.userSocialSignIn : AUTH_VIEW.ownerSocialSignIn;

  const { mutate: signUpMutate, isPending, isSuccess } = useSignUp();
  const setPendingSignUp = useAuthStore((s) => s.setPendingSignUp);
  const pendingSignUp = useAuthStore((s) => s.pendingSignUp);

  const openAuthView = useCallback(
    (view: AuthView) => {
      router.replace(`${pathname}?${AUTH_QUERY_KEY}=${view}`);
    },
    [pathname, router],
  );

  const onBack = useCallback(() => {
    openAuthView(socialSignUpView);
  }, [openAuthView, socialSignUpView]);

  const onSubmit = useCallback(
    (values: SignUpFormValues) => {
      setPendingSignUp(values);
      signUpMutate(values);
    },
    [setPendingSignUp, signUpMutate],
  );

  const onSignInClick = useCallback(() => {
    openAuthView(signInView);
  }, [openAuthView, signInView]);

  useEffect(() => {
    if (isSuccess && pendingSignUp?.email) {
      const returnView = type === "user" ? AUTH_VIEW.userSignUp : AUTH_VIEW.ownerSignUp;
      router.replace(
        buildAuthModalUrl(pathname, AUTH_VIEW.confirmSignUp, {
          returnView,
          contactEmail: pendingSignUp.email,
        }),
      );
    }
  }, [isSuccess, pendingSignUp, pathname, router, type]);

  return {
    title: t("signUpFormTitle"),
    subtitle: t("signUpFormSubtitle"),
    onSubmit,
    isLoading: isPending,
    onBack,
    hasAccountText: t("socialSignUpHasAccount"),
    signInText: t("socialSignUpLogIn"),
    onSignInClick,
    termsText,
    privacyText,
  };
}
