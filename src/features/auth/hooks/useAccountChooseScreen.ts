"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { AUTH_VIEW } from "../authViews";
import { useAuthStore } from "@/src/features/auth/store/auth.store";
import { useAuthScreenLegalFooter } from "./authScreen.utils";

export function useAccountChooseScreen() {
  const t = useTranslations("auth");
  const { termsText, privacyText } = useAuthScreenLegalFooter();
  const navigate = useAuthStore((state) => state.navigate);
  const [mode, setMode] = useState<"signin" | "signup">("signin");

  const onCreateAccountClick = useCallback(() => {
    navigate(AUTH_VIEW.userSocialSignUp);
  }, [navigate]);

  return {
    title: t("chooseAccountSignInTitle"),
    subtitle: "Use social login, email, or one-time password to continue.",
    mode,
    onModeChange: setMode,
    noAccountText: t("chooseAccountNoAccount"),
    createAccountText: t("chooseAccountCreateAccount"),
    onCreateAccountClick,
    termsText,
    privacyText,
  };
}
