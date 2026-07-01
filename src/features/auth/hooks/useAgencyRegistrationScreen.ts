"use client";

import { useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";
import { AUTH_VIEW } from "../authViews";
import { useAgencySignUp } from "../mutations/auth.mutation";
import type { AgencySignUpSubmitValues } from "../types/auth.types";
import { useAuthStore } from "@/src/features/auth/store/auth.store";
import { useAuthModalNavigation } from "./useAuthPortal";
import { useAuthScreenLegalFooter } from "./authScreen.utils";

export function useAgencyRegistrationScreen() {
  const t = useTranslations("auth");
  const { termsText, privacyText } = useAuthScreenLegalFooter();
  const navigate = useAuthStore((state) => state.navigate);
  const { onBack, canGoBack } = useAuthModalNavigation();
  const setPendingAgencySignUp = useAuthStore((state) => state.setPendingAgencySignUp);
  const pendingAgencySignUp = useAuthStore((state) => state.pendingAgencySignUp);

  const { mutate: agencySignUpMutate, isPending, isSuccess } = useAgencySignUp();

  const onSubmit = useCallback(
    (values: AgencySignUpSubmitValues) => {
      setPendingAgencySignUp(values);
      agencySignUpMutate({
        agency_name: values.agencyName,
        agency_trade_name: values.tradeName,
        email: values.email,
        phone_number: values.phone,
        password: values.password,
        legal_document: values.legalDocument,
      });
    },
    [agencySignUpMutate, setPendingAgencySignUp],
  );

  const onSignInClick = useCallback(() => {
    navigate(AUTH_VIEW.agencySignIn);
  }, [navigate]);

  useEffect(() => {
    if (isSuccess && pendingAgencySignUp?.email) {
      navigate(AUTH_VIEW.confirmSignUp);
    }
  }, [isSuccess, pendingAgencySignUp, navigate]);

  return {
    title: t("agencySignUpTitle"),
    subtitle: t("agencySignUpSubtitle"),
    onSubmit,
    isLoading: isPending,
    showBack: canGoBack,
    onBack,
    hasAccountText: t("agencySignUpHasAccount"),
    signInText: t("socialSignUpLogIn"),
    onSignInClick,
    termsText,
    privacyText,
  };
}
