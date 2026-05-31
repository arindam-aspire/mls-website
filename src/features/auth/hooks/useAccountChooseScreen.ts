"use client";

import { useCallback, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/src/i18n/navigation";
import {
  AUTH_QUERY_KEY,
  AUTH_VIEW,
  type AuthView,
} from "../authViews";
import type { ChooseAccountMode } from "../types/chooseAccount.types";

export function useAccountChooseScreen() {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("auth");
  const tCommon = useTranslations("common");
  const [mode, setMode] = useState<ChooseAccountMode>("signin");

  const title = useMemo(
    () =>
      mode === "signin"
        ? t("chooseAccountSignInTitle")
        : t("chooseAccountSignUpTitle"),
    [mode, t],
  );

  const openAuthView = useCallback(
    (view: AuthView) => {
      router.replace(`${pathname}?${AUTH_QUERY_KEY}=${view}`);
    },
    [pathname, router],
  );

  const onCreateAccountClick = useCallback(() => {
    openAuthView(AUTH_VIEW.userSocialSignUp);
  }, [openAuthView]);

  return {
    title,
    subtitle: t("chooseAccountSubtitle"),
    mode,
    onModeChange: setMode,
    noAccountText: t("chooseAccountNoAccount"),
    createAccountText: t("chooseAccountCreateAccount"),
    onCreateAccountClick,
    termsText: t("termsOfService"),
    privacyText: tCommon("privacyPolicy"),
  };
}
