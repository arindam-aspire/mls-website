"use client";

import { Input } from "@/src/components/ui";

export type InviteAgentByEmailFormProps = {
  email: string;
  emailLabel: string;
  emailPlaceholder: string;
  emailError?: string;
  disabled?: boolean;
  onEmailChange: (value: string) => void;
};

export function InviteAgentByEmailForm({
  email,
  emailLabel,
  emailPlaceholder,
  emailError,
  disabled = false,
  onEmailChange,
}: InviteAgentByEmailFormProps) {
  return (
    <Input
      type="email"
      name="inviteEmail"
      autoComplete="email"
      label={emailLabel}
      placeholder={emailPlaceholder}
      value={email}
      error={emailError}
      isRequired
      disabled={disabled}
      onChange={(event) => {
        onEmailChange(event.target.value);
      }}
    />
  );
}
