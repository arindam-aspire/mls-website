"use client";

import { useTranslations } from "next-intl";
import type { AuthView } from "../authViews";
import {
  resolveAuthSignUpView,
  resolveSignInViewAfterPasswordReset,
  resolveSignInViewFromSignUpReturnView,
} from "../authViews";
import { useAuthStore } from "../store/auth.store";
import { getAuthContextFromStack, isAgencyContextFromStack } from "./authStack.utils";

export function useAuthScreenLegalFooter() {
  const t = useTranslations("auth");
  const tCommon = useTranslations("common");

  return {
    termsText: t("termsOfService"),
    privacyText: tCommon("privacyPolicy"),
  };
}

export function useAuthFlowContext() {
  const screenStack = useAuthStore((state) => state.screenStack);
  const agentPortal = useAuthStore((state) => state.agentPortal);

  const contextView = getAuthContextFromStack(screenStack);
  const isAgency = isAgencyContextFromStack(screenStack, agentPortal);
  const isAgent = agentPortal;
  const signUpView = resolveAuthSignUpView(contextView);
  const signInViewAfterReset = resolveSignInViewAfterPasswordReset(contextView);
  const signInViewFromSignUp = resolveSignInViewFromSignUpReturnView(contextView);

  return {
    contextView,
    isAgency,
    isAgent,
    signUpView,
    signInViewAfterReset,
    signInViewFromSignUp,
  };
}

export function resolveSignInViewForStack(screenStack: AuthView[]): AuthView {
  return resolveSignInViewAfterPasswordReset(
    getAuthContextFromStack(screenStack),
  );
}
