"use client";

import { useCallback, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/src/i18n/navigation";
import { useSearchParams } from "next/navigation";
import {
  AUTH_QUERY_KEY,
  AUTH_RETURN_VIEW_QUERY_KEY,
  AUTH_VIEW,
  buildAuthModalUrl,
} from "../authViews";
import type { ForgotPasswordMethod } from "../components/ForgotPasswordForm";
import type { ForgotPasswordFormValues } from "../types/auth.types";
import { useForgotPassword } from "../mutations/auth.mutation";
import { useToast } from "@/src/hooks/useToast";
import { resolveAuthReturnView, useAuthScreenLegalFooter } from "./authScreen.utils";

export function useForgotPasswordScreen() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations("auth");
  const { termsText, privacyText } = useAuthScreenLegalFooter();
  const toast = useToast();
  const returnView = resolveAuthReturnView(
    searchParams.get(AUTH_RETURN_VIEW_QUERY_KEY),
    AUTH_VIEW.userSignIn,
  );

  const { mutate: forgotPasswordMutate, isPending, isSuccess } = useForgotPassword();
  const lastSubmitRef = useRef<{
    values: ForgotPasswordFormValues;
    method: ForgotPasswordMethod;
  } | null>(null);

  const onBack = useCallback(() => {
    router.replace(`${pathname}?${AUTH_QUERY_KEY}=${returnView}`);
  }, [pathname, returnView, router]);

  const onSubmit = useCallback(
    (values: ForgotPasswordFormValues, method: ForgotPasswordMethod) => {
      if (method === "phone") {
        toast.info("Coming Soon", {
          description:
            "Password reset via phone number is not available yet. Please use email instead.",
        });
        return;
      }

      lastSubmitRef.current = { values, method };
      forgotPasswordMutate({
        email: values.email,
      });
    },
    [forgotPasswordMutate, toast],
  );

  useEffect(() => {
    if (isSuccess && lastSubmitRef.current) {
      const { values, method } = lastSubmitRef.current;
      router.replace(
        buildAuthModalUrl(pathname, AUTH_VIEW.otpVerify, {
          otpFlow: "forgot",
          returnView,
          contactEmail: method === "email" ? values.email : undefined,
          contactPhone:
            method === "phone" ? values.phoneNationalNumber : undefined,
          contactPhoneCountry:
            method === "phone" ? values.phoneCountryCode : undefined,
        }),
      );
    }
  }, [isSuccess, pathname, returnView, router]);

  return {
    title: t("forgotPasswordTitle"),
    subtitle: t("forgotPasswordSubtitle"),
    onSubmit,
    isLoading: isPending,
    onBack,
    hasAccountText: t("socialSignUpHasAccount"),
    signInText: t("socialSignUpLogIn"),
    onSignInClick: onBack,
    termsText,
    privacyText,
  };
}
