"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/src/i18n/navigation";
import { useSearchParams } from "next/navigation";
import {
  AUTH_RETURN_VIEW_QUERY_KEY,
  AUTH_VIEW,
  buildAuthModalUrl,
  isAgencyAuthView,
  resolveAuthSignUpView,
  resolveSignInRoleFromAuthContext,
  type AuthView,
} from "../authViews";
import type { SignInOtpMethod, SignInWithOTPFormValues } from "../components/SignInWithOTPForm";
import { useSignInWithOtpRequest } from "../mutations/auth.mutation";
import { useAuthStore } from "../store/auth.store";
import { useToast } from "@/src/hooks/useToast";
import { useAuthPortal, useIsAgentSignInPortal } from "./useAuthPortal";
import { resolveAuthReturnView, useAuthScreenLegalFooter } from "./authScreen.utils";

export function useSignInWithOTPScreen() {
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
  const signUpView = resolveAuthSignUpView(returnView);
  const isAgency = isAgencyAuthView(returnView);
  const portal = useAuthPortal();
  const isAgent = useIsAgentSignInPortal();
  const showAgencyCreateAccount = isAgency && !isAgent;
  const showUserCreateAccount = !showAgencyCreateAccount && !isAgency;
  const signInRole = resolveSignInRoleFromAuthContext(returnView, portal);

  const { mutate: requestOtp, isPending, isSuccess } = useSignInWithOtpRequest();
  const pendingOtpSession = useAuthStore((state) => state.pendingOtpSession);
  const lastEmailRef = useRef<string | null>(null);

  const portalOptions = useMemo(
    () => (portal ? { portal } : undefined),
    [portal],
  );

  const openAuthView = useCallback(
    (view: AuthView) => {
      router.replace(buildAuthModalUrl(pathname, view, portalOptions));
    },
    [pathname, portalOptions, router],
  );

  const onBack = useCallback(() => {
    openAuthView(returnView);
  }, [openAuthView, returnView]);

  const onSubmit = useCallback(
    (values: SignInWithOTPFormValues, method: SignInOtpMethod) => {
      if (method === "phone") {
        toast.info("Coming Soon", {
          description:
            "Sign in via phone number is not available yet. Please use email instead.",
        });
        return;
      }

      lastEmailRef.current = values.email;
      requestOtp({ username: values.email, role: signInRole });
    },
    [requestOtp, signInRole, toast],
  );

  const onAgencyCreateAccountClick = useCallback(() => {
    openAuthView(signUpView);
  }, [openAuthView, signUpView]);

  const onUserCreateAccountClick = useCallback(() => {
    openAuthView(signUpView);
  }, [openAuthView, signUpView]);

  useEffect(() => {
    if (isSuccess && lastEmailRef.current && pendingOtpSession?.session) {
      router.replace(
        buildAuthModalUrl(pathname, AUTH_VIEW.otpVerify, {
          otpFlow: "signin",
          returnView,
          contactEmail: lastEmailRef.current,
          portal: portal ?? undefined,
          otpSession: pendingOtpSession.session,
          otpCode: pendingOtpSession.otp,
        }),
      );
    }
  }, [isSuccess, pendingOtpSession, pathname, portal, returnView, router]);

  return {
    title: t("chooseAccountSignInTitle"),
    subtitle: t("forgotPasswordSubtitle"),
    onSubmit,
    isLoading: isPending,
    onBack,
    showAgencyCreateAccount,
    showUserCreateAccount,
    agencyNoAccountText: t("agencySignInNoAccount"),
    agencyCreateAccountText: t("agencyCreateAccount"),
    onAgencyCreateAccountClick,
    userNoAccountText: t("chooseAccountNoAccount"),
    userCreateAccountText: t("chooseAccountCreateAccount"),
    onUserCreateAccountClick,
    termsText,
    privacyText,
  };
}
