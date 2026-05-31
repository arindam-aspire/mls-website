"use client";

import { useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/src/i18n/navigation";
import { useSearchParams } from "next/navigation";
import {
  AUTH_RETURN_VIEW_QUERY_KEY,
  AUTH_VIEW,
  buildAuthModalUrl,
  resolveAgencySignUpBackUrl,
  type AuthView,
} from "../authViews";
import { useAgencySignUp } from "../mutations/auth.mutation";
import type { AgencySignUpSubmitValues } from "../types/auth.types";
import { useAuthStore } from "../store/auth.store";
import { resolveAuthReturnViewOrNull, useAuthScreenLegalFooter } from "./authScreen.utils";

export function useAgencyRegistrationScreen() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations("auth");
  const { termsText, privacyText } = useAuthScreenLegalFooter();
  const returnView = resolveAuthReturnViewOrNull(
    searchParams.get(AUTH_RETURN_VIEW_QUERY_KEY),
  );

  const { mutate: agencySignUpMutate, isPending, isSuccess } = useAgencySignUp();
  const setPendingAgencySignUp = useAuthStore((s) => s.setPendingAgencySignUp);
  const pendingAgencySignUp = useAuthStore((s) => s.pendingAgencySignUp);

  const openAuthView = useCallback(
    (view: AuthView) => {
      router.replace(buildAuthModalUrl(pathname, view));
    },
    [pathname, router],
  );

  const onBack = useCallback(() => {
    router.replace(resolveAgencySignUpBackUrl(pathname, returnView));
  }, [pathname, returnView, router]);

  const onSubmit = useCallback(
    (values: AgencySignUpSubmitValues) => {
      setPendingAgencySignUp(values);
      agencySignUpMutate({
        agency_name: values.agencyName,
        agency_trade_name: values.tradeName,
        email: values.email,
        phone: values.phone,
        password: values.password,
        legal_document: values.legalDocument,
      });
    },
    [agencySignUpMutate, setPendingAgencySignUp],
  );

  const onSignInClick = useCallback(() => {
    openAuthView(AUTH_VIEW.agencySignIn);
  }, [openAuthView]);

  useEffect(() => {
    if (isSuccess && pendingAgencySignUp?.email) {
      router.replace(
        buildAuthModalUrl(pathname, AUTH_VIEW.confirmSignUp, {
          returnView: AUTH_VIEW.agencySignUp,
          contactEmail: pendingAgencySignUp.email,
        }),
      );
    }
  }, [isSuccess, pendingAgencySignUp, pathname, router]);

  return {
    title: t("agencySignUpTitle"),
    subtitle: t("agencySignUpSubtitle"),
    onSubmit,
    isLoading: isPending,
    onBack,
    hasAccountText: t("agencySignUpHasAccount"),
    signInText: t("socialSignUpLogIn"),
    onSignInClick,
    termsText,
    privacyText,
  };
}
