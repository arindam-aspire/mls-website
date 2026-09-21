"use client";

import { useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  AUTH_VIEW,
  resolveSignInViewForAccountType,
  resolveSocialSignInViewForAccountType,
} from "../authViews";
import type { SocialAccountType } from "../components/SocialAuthForm";
import { resolveSignInRole } from "../types/signIn.types";
import type { SignUpFormValues, SignUpRequest } from "../types/auth.types";
import { useSignUp } from "../mutations/auth.mutation";
import { isConflictStatus, type ApiError } from "@/src/apis/core/error.normalizer";
import { useAuthStore } from "@/src/features/auth/store/auth.store";
import { useAuthModalNavigation } from "./useAuthPortal";
import { useAuthScreenLegalFooter } from "./authScreen.utils";

type UseUserRegistrationScreenParams = {
  type: SocialAccountType;
};

export function useUserRegistrationScreen({ type }: UseUserRegistrationScreenParams) {
  const t = useTranslations("auth");
  const { termsText, privacyText } = useAuthScreenLegalFooter();
  const navigate = useAuthStore((state) => state.navigate);
  const { onBack, canGoBack } = useAuthModalNavigation();
  const setPendingSignUp = useAuthStore((state) => state.setPendingSignUp);
  const setPendingEmail = useAuthStore((state) => state.setPendingEmail);
  const pendingSignUp = useAuthStore((state) => state.pendingSignUp);

  const { mutate: signUpMutate, isPending, isSuccess } = useSignUp();

  const onSubmit = useCallback(
    (values: SignUpFormValues) => {
      const phoneNumber = values.phone_number.trim();
      const payload: SignUpRequest = {
        full_name: values.full_name.trim(),
        email: values.email.trim(),
        password: values.password,
        role: resolveSignInRole(type),
        ...(phoneNumber ? { phone_number: phoneNumber } : {}),
      };

      setPendingSignUp({
        ...payload,
        phone_number: phoneNumber,
      });
      setPendingEmail(values.email.trim());
      signUpMutate(payload, {
        onError: (error: ApiError) => {
          if (!isConflictStatus(error)) {
            return;
          }

          setPendingSignUp(null);
          navigate(resolveSignInViewForAccountType(type));
        },
      });
    },
    [navigate, setPendingEmail, setPendingSignUp, signUpMutate, type],
  );

  const onSignInClick = useCallback(() => {
    navigate(resolveSocialSignInViewForAccountType(type));
  }, [navigate, type]);

  useEffect(() => {
    if (isSuccess && pendingSignUp?.email) {
      setPendingEmail(pendingSignUp.email);
      navigate(AUTH_VIEW.confirmSignUp);
    }
  }, [isSuccess, pendingSignUp, navigate, setPendingEmail]);

  return {
    title: t("signUpFormTitle"),
    subtitle: t("signUpFormSubtitle"),
    onSubmit,
    isLoading: isPending,
    showBack: canGoBack,
    onBack,
    hasAccountText: t("socialSignUpHasAccount"),
    signInText: t("socialSignUpLogIn"),
    onSignInClick,
    termsText,
    privacyText,
  };
}
