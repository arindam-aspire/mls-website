"use client";

import { useCallback, useMemo } from "react";
import { useTranslations } from "next-intl";
import { AUTH_VIEW, resolveAccountTypeAuthView } from "../authViews";
import { useAuthStore } from "../store/auth.store";
import type { ChooseAccountMode, ChooseAccountType } from "../types/chooseAccount.types";
import {
  Building2,
  Headphones,
  KeyRound,
  User,
} from "lucide-react";

type UseChooseAccountFormParams = {
  mode: ChooseAccountMode;
  onAccountTypeSelect?: (type: ChooseAccountType) => void;
};

export function useChooseAccountForm({
  mode,
  onAccountTypeSelect,
}: UseChooseAccountFormParams) {
  const t = useTranslations("auth");
  const navigate = useAuthStore((state) => state.navigate);
  const setAgentPortal = useAuthStore((state) => state.setAgentPortal);

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
        setAgentPortal(type === "agent" && mode === "signin");
        navigate(view);
      }
      onAccountTypeSelect?.(type);
    },
    [mode, onAccountTypeSelect, navigate, setAgentPortal],
  );

  return {
    accountTypes,
    modeToggleItems,
    modeToggleLabel: t("chooseAccountModeLabel"),
    socialSignInNote: t("chooseAccountSocialSignInNote"),
    onAccountTypeSelect: handleAccountTypeSelect,
  };
}
