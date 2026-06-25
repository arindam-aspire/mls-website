"use client";

import { CopyLinkBar } from "@/src/components/ui";
import { cn } from "@/src/lib/cn";
import { bodyLargeTextClasses, bodyTextClasses } from "@/src/lib/typography";
import { CheckCircle2 } from "lucide-react";

export type ManualOnboardSuccessPanelProps = {
  readyTitle: string;
  successMessage: string;
  passwordLabel: string;
  temporaryPassword: string;
  copyPasswordLabel: string;
  passwordHint: string;
  onCopyPassword: () => void;
};

export function ManualOnboardSuccessPanel({
  readyTitle,
  successMessage,
  passwordLabel,
  temporaryPassword,
  copyPasswordLabel,
  passwordHint,
  onCopyPassword,
}: ManualOnboardSuccessPanelProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-secondary/15 bg-surface">
      <div className="flex items-start gap-3 border-b border-success/20 bg-success/10 px-4 py-3 sm:px-5 sm:py-4">
        <CheckCircle2
          className="mt-0.5 size-5 shrink-0 text-success"
          aria-hidden
        />
        <div className="min-w-0 space-y-1">
          <p className={cn("font-semibold text-text", bodyLargeTextClasses)}>
            {readyTitle}
          </p>
          <p className={cn("text-muted", bodyTextClasses)}>{successMessage}</p>
        </div>
      </div>

      <div className="space-y-3 p-4 sm:p-5">
        <CopyLinkBar
          label={passwordLabel}
          value={temporaryPassword}
          copyLabel={copyPasswordLabel}
          onCopy={onCopyPassword}
        />
        <p className={cn("text-muted", bodyTextClasses)}>{passwordHint}</p>
      </div>
    </div>
  );
}
