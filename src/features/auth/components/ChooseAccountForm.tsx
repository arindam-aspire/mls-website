"use client";

import { Info } from "lucide-react";
import { ToggleButton } from "@/src/components/ui";
import { cn } from "@/src/lib/cn";
import { bodyTextClasses } from "@/src/lib/typography";
import { useChooseAccountForm } from "../hooks/useChooseAccountForm";
import type { ChooseAccountMode, ChooseAccountType } from "../types/chooseAccount.types";
import { AccountTypeCard } from "./AccountTypeCard";

export type { ChooseAccountMode, ChooseAccountType } from "../types/chooseAccount.types";
export { CHOOSE_ACCOUNT_TYPES } from "../types/chooseAccount.types";

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
  const {
    accountTypes,
    modeToggleItems,
    modeToggleLabel,
    socialSignInNote,
    onAccountTypeSelect: handleAccountTypeSelect,
  } = useChooseAccountForm({ mode, onAccountTypeSelect });

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
          aria-label={modeToggleLabel}
          items={modeToggleItems}
        />
      </div>
      <div className="flex flex-col gap-3">
        {accountTypes.map((item) => (
          <AccountTypeCard
            key={item.type}
            icon={item.icon}
            title={item.title}
            description={item.description}
            disabled={mode === "signup" && item.type === "agent"}
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
          <p className={cn(bodyTextClasses, "leading-relaxed text-primary-dark")}>
            {socialSignInNote}
          </p>
        </div>
      </div>
    </div>
  );
}
