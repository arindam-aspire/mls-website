"use client";

import { InviteAgentContactForm } from "./InviteAgentContactForm";
import { InviteAgentGeneratingPanel } from "./InviteAgentGeneratingPanel";
import { InviteAgentReadyPanel } from "./InviteAgentReadyPanel";

export type InviteAgentByEmailContentProps = {
  contactMethod: "email" | "phone";
  email: string;
  phoneCountryCode: string;
  phoneNationalNumber: string;
  contactMethodEmailLabel: string;
  contactMethodPhoneLabel: string;
  emailLabel: string;
  emailPlaceholder: string;
  phoneLabel: string;
  phonePlaceholder: string;
  phoneSearchPlaceholder: string;
  phoneEmptySearchLabel: string;
  emailError?: string;
  phoneError?: string;
  contactError?: string;
  isContactDisabled: boolean;
  onContactMethodChange: (method: "email" | "phone") => void;
  onEmailChange: (value: string) => void;
  onPhoneCountryChange: (countryCode: string) => void;
  onPhoneNationalNumberChange: (value: string) => void;
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
  contactMethod,
  email,
  phoneCountryCode,
  phoneNationalNumber,
  contactMethodEmailLabel,
  contactMethodPhoneLabel,
  emailLabel,
  emailPlaceholder,
  phoneLabel,
  phonePlaceholder,
  phoneSearchPlaceholder,
  phoneEmptySearchLabel,
  emailError,
  phoneError,
  contactError,
  isContactDisabled,
  onContactMethodChange,
  onEmailChange,
  onPhoneCountryChange,
  onPhoneNationalNumberChange,
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
    <InviteAgentContactForm
      contactMethod={contactMethod}
      email={email}
      phoneCountryCode={phoneCountryCode}
      phoneNationalNumber={phoneNationalNumber}
      contactMethodEmailLabel={contactMethodEmailLabel}
      contactMethodPhoneLabel={contactMethodPhoneLabel}
      emailLabel={emailLabel}
      emailPlaceholder={emailPlaceholder}
      phoneLabel={phoneLabel}
      phonePlaceholder={phonePlaceholder}
      phoneSearchPlaceholder={phoneSearchPlaceholder}
      phoneEmptySearchLabel={phoneEmptySearchLabel}
      emailError={emailError}
      phoneError={phoneError}
      contactError={contactError}
      disabled={isContactDisabled}
      onContactMethodChange={onContactMethodChange}
      onEmailChange={onEmailChange}
      onPhoneCountryChange={onPhoneCountryChange}
      onPhoneNationalNumberChange={onPhoneNationalNumberChange}
    />
  );
}
