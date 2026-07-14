"use client";

import { AgentOnboardingForm } from "./AgentOnboardingForm";
import type { AgentOnboardingFormProps } from "./AgentOnboardingForm";
import { ManualOnboardSuccessPanel } from "./ManualOnboardSuccessPanel";

export type ManualOnboardAgentContentProps = AgentOnboardingFormProps & {
  hasSubmittedSuccessfully: boolean;
  success?: {
    readyTitle: string;
    successMessage: string;
    passwordLabel: string;
    temporaryPassword: string;
    copyPasswordLabel: string;
    passwordHint: string;
    setupLinkLabel?: string;
    setupLink?: string | null;
    copySetupLinkLabel?: string;
    onCopyPassword: () => void;
    onCopySetupLink?: () => void;
  } | null;
};

export function ManualOnboardAgentContent({
  hasSubmittedSuccessfully,
  success,
  ...form
}: ManualOnboardAgentContentProps) {
  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      <AgentOnboardingForm
        {...form}
        disabled={form.disabled || hasSubmittedSuccessfully}
      />

      {hasSubmittedSuccessfully && success ? (
        <ManualOnboardSuccessPanel {...success} />
      ) : null}
    </div>
  );
}
