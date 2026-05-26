"use client";

import {
  Building2,
  Headphones,
  Info,
  KeyRound,
  User,
} from "lucide-react";
import { useMemo } from "react";
import { ToggleButton } from "@/src/components/ui";
import { useTranslations } from "next-intl";
import { cn } from "@/src/lib/cn";
import { usePathname, useRouter } from "@/src/i18n/navigation";
import { AUTH_QUERY_KEY, resolveAccountTypeAuthView } from "../authViews";
import { AccountTypeCard } from "./AccountTypeCard";

export type ChooseAccountMode = "signin" | "signup";

export const CHOOSE_ACCOUNT_TYPES = [
  "agency",
  "owner",
  "user",
  "agent",
] as const;

export type ChooseAccountType = (typeof CHOOSE_ACCOUNT_TYPES)[number];

type ChooseAccountFormProps = {
  mode: ChooseAccountMode;
  onModeChange: (mode: ChooseAccountMode) => void;
  onAccountTypeSelect?: (type: ChooseAccountType) => void;
  className?: string;
};

export function ChooseAccountForm({
  mode,
  onModeChange,
  onAccountTypeSelect,
  className,
}: ChooseAccountFormProps) {
  const t = useTranslations("auth");
  const router = useRouter();
  const pathname = usePathname();

  const handleAccountTypeSelect = (type: ChooseAccountType) => {
    const view = resolveAccountTypeAuthView(type, mode);
    if (view != null) {
      router.replace(`${pathname}?${AUTH_QUERY_KEY}=${view}`);
    }
    onAccountTypeSelect?.(type);
  };

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

  return (
    <div className={cn("flex flex-col gap-6 px-4 sm:px-6 pb-4 sm:pb-6", className)}>
      <div className="flex justify-center">
        <ToggleButton<ChooseAccountMode>
          className="w-full"
          color="primary"
          size="md"
          isRounded
          value={mode}
          variant="ghost"
          onChange={onModeChange}
          aria-label={t("chooseAccountModeLabel")}
          items={[
            { value: "signin", label: t("signIn") },
            { value: "signup", label: t("signUp") },
          ]}
        />
      </div>
      <div className="flex flex-col gap-3">
        {accountTypes.map((item) => (
          <AccountTypeCard
            key={item.type}
            icon={item.icon}
            title={item.title}
            description={item.description}
            onClick={() => handleAccountTypeSelect(item.type)}
          />
        ))}
        <div
          role="note"
          className="flex gap-3 rounded-xl border border-secondary/15 bg-primary-light p-4"
        >
          <Info
            className="mt-0.5 size-5 shrink-0 text-primary-dark"
            aria-hidden
          />
          <p className="text-sm leading-relaxed text-primary-dark">
            {t("chooseAccountSocialSignInNote")}
          </p>
        </div>
      </div>
    </div>
  );
}

