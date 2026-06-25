"use client";

import { InviteAgentByEmailForm } from "./InviteAgentByEmailForm";
import { InviteAgentGeneratingPanel } from "./InviteAgentGeneratingPanel";
import { InviteAgentReadyPanel } from "./InviteAgentReadyPanel";

export type InviteAgentByEmailContentProps = {
  email: string;
  emailLabel: string;
  emailPlaceholder: string;
  emailError?: string;
  isEmailDisabled: boolean;
  onEmailChange: (value: string) => void;
  isGenerating: boolean;
  generatingMessage: string;
  generatingHint: string;
  hasGeneratedInvite: boolean;
  readyTitle: string;
  generatedMessage?: string;
  shareHint: string;
  linkLabel: string;
  inviteLink: string;
  copyLinkLabel: string;
  onCopyLink: () => void;
};

export function InviteAgentByEmailContent({
  email,
  emailLabel,
  emailPlaceholder,
  emailError,
  isEmailDisabled,
  onEmailChange,
  isGenerating,
  generatingMessage,
  generatingHint,
  hasGeneratedInvite,
  readyTitle,
  generatedMessage,
  shareHint,
  linkLabel,
  inviteLink,
  copyLinkLabel,
  onCopyLink,
}: InviteAgentByEmailContentProps) {
  if (isGenerating) {
    return (
      <InviteAgentGeneratingPanel
        generatingMessage={generatingMessage}
        generatingHint={generatingHint}
      />
    );
  }

  if (hasGeneratedInvite && generatedMessage) {
    return (
      <InviteAgentReadyPanel
        readyTitle={readyTitle}
        generatedMessage={generatedMessage}
        shareHint={shareHint}
        linkLabel={linkLabel}
        inviteLink={inviteLink}
        copyLinkLabel={copyLinkLabel}
        onCopyLink={onCopyLink}
      />
    );
  }

  return (
    <InviteAgentByEmailForm
      email={email}
      emailLabel={emailLabel}
      emailPlaceholder={emailPlaceholder}
      emailError={emailError}
      disabled={isEmailDisabled}
      onEmailChange={onEmailChange}
    />
  );
}
