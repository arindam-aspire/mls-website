"use client";

import { Input, PhoneInput } from "@/src/components/ui";

export type InviteAgentContactMethod = "email" | "phone";

export type InviteAgentContactFormProps = {
  contactMethod: InviteAgentContactMethod;
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
  disabled?: boolean;
  onContactMethodChange: (method: InviteAgentContactMethod) => void;
  onEmailChange: (value: string) => void;
  onPhoneCountryChange: (countryCode: string) => void;
  onPhoneNationalNumberChange: (value: string) => void;
};

export function InviteAgentContactForm({
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
  disabled = false,
  onContactMethodChange,
  onEmailChange,
  onPhoneCountryChange,
  onPhoneNationalNumberChange,
}: InviteAgentContactFormProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
            contactMethod === "email"
              ? "border-primary bg-primary text-white"
              : "border-secondary/20 bg-surface text-text hover:bg-inherit-color"
          }`}
          disabled={disabled}
          onClick={() => {
            onContactMethodChange("email");
          }}
        >
          {contactMethodEmailLabel}
        </button>
        <button
          type="button"
          className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
            contactMethod === "phone"
              ? "border-primary bg-primary text-white"
              : "border-secondary/20 bg-surface text-text hover:bg-inherit-color"
          }`}
          disabled={disabled}
          onClick={() => {
            onContactMethodChange("phone");
          }}
        >
          {contactMethodPhoneLabel}
        </button>
      </div>

      {contactMethod === "email" ? (
        <Input
          type="email"
          name="inviteEmail"
          autoComplete="email"
          label={emailLabel}
          placeholder={emailPlaceholder}
          value={email}
          error={emailError ?? contactError}
          isRequired
          disabled={disabled}
          onChange={(event) => {
            onEmailChange(event.target.value);
          }}
        />
      ) : (
        <PhoneInput
          label={phoneLabel}
          placeholder={phonePlaceholder}
          searchPlaceholder={phoneSearchPlaceholder}
          emptySearchLabel={phoneEmptySearchLabel}
          countryCode={phoneCountryCode}
          nationalNumber={phoneNationalNumber}
          error={phoneError ?? contactError}
          isRequired
          disabled={disabled}
          onCountryChange={(country) => {
            onPhoneCountryChange(country.iso2);
          }}
          onNationalNumberChange={onPhoneNationalNumberChange}
        />
      )}
    </div>
  );
}
