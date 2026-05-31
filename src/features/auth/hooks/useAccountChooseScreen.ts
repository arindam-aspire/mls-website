"use client";

import { useCallback, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { AUTH_VIEW } from "../authViews";
import { useAuthStore } from "../store/auth.store";
import { useAuthScreenLegalFooter } from "./authScreen.utils";

export function useAccountChooseScreen() {
  const t = useTranslations("auth");
  const { termsText, privacyText } = useAuthScreenLegalFooter();
  const navigate = useAuthStore((state) => state.navigate);
  const [mode, setMode] = useState<"signin" | "signup">("signin");

  const title = useMemo(
    () =>
      mode === "signin"
        ? t("chooseAccountSignInTitle")
        : t("chooseAccountSignUpTitle"),
    [mode, t],
  );

  const onCreateAccountClick = useCallback(() => {
    navigate(AUTH_VIEW.userSocialSignUp);
  }, [navigate]);

  return {
    title,
    subtitle: t("chooseAccountSubtitle"),
    mode,
    onModeChange: setMode,
    noAccountText: t("chooseAccountNoAccount"),
    createAccountText: t("chooseAccountCreateAccount"),
    onCreateAccountClick,
    termsText,
    privacyText,
  };
}
