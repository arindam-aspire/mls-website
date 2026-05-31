"use client";

import {
  Building2,
  Headphones,
  KeyRound,
  User,
} from "lucide-react";
import { useCallback, useMemo } from "react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/src/i18n/navigation";
import { AUTH_VIEW, buildAuthModalUrl, resolveAccountTypeAuthView } from "../authViews";
import type { ChooseAccountMode, ChooseAccountType } from "../types/chooseAccount.types";

type UseChooseAccountFormParams = {
  mode: ChooseAccountMode;
  onAccountTypeSelect?: (type: ChooseAccountType) => void;
};

export function useChooseAccountForm({
  mode,
  onAccountTypeSelect,
}: UseChooseAccountFormParams) {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("auth");

  const accountTypes = useMemo(
    () =>
      [
        {
          type: "agency" as const,
          icon: Building2,
          title: t("accountTypeAgencyTitle"),
          description: t("accountTypeAgencyDescription"),
        },
        {
          type: "owner" as const,
          icon: KeyRound,
          title: t("accountTypeOwnerTitle"),
          description: t("accountTypeOwnerDescription"),
        },
        {
          type: "user" as const,
          icon: User,
          title: t("accountTypeUserTitle"),
          description: t("accountTypeUserDescription"),
        },
        {
          type: "agent" as const,
          icon: Headphones,
          title: t("accountTypeAgentTitle"),
          description: t("accountTypeAgentDescription"),
        },
      ] satisfies {
        type: ChooseAccountType;
        icon: typeof Building2;
        title: string;
        description: string;
      }[],
    [t],
  );

  const modeToggleItems = useMemo(
    () => [
      { value: "signin" as const, label: t("signIn") },
      { value: "signup" as const, label: t("signUp") },
    ],
    [t],
  );

  const handleAccountTypeSelect = useCallback(
    (type: ChooseAccountType) => {
      const view = resolveAccountTypeAuthView(type, mode);
      if (view != null) {
        router.replace(
          buildAuthModalUrl(pathname, view, {
            returnView: AUTH_VIEW.chooseAccount,
            portal: type === "agent" && mode === "signin" ? "agent" : undefined,
          }),
        );
      }
      onAccountTypeSelect?.(type);
    },
    [mode, onAccountTypeSelect, pathname, router],
  );

  return {
    accountTypes,
    modeToggleItems,
    modeToggleLabel: t("chooseAccountModeLabel"),
    socialSignInNote: t("chooseAccountSocialSignInNote"),
    onAccountTypeSelect: handleAccountTypeSelect,
  };
}
