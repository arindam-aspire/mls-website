"use client";

import { Input, MultiSelectDropdown, PhoneInput } from "@/src/components/ui";
import type { MultiSelectDropdownOption } from "@/src/components/ui/multi-select-dropdown";

export type ManualOnboardAgentFormProps = {
  fullName: string;
  email: string;
  phoneCountryCode: string;
  phoneNationalNumber: string;
  serviceAreaValues: string[];
  serviceAreaOptions: MultiSelectDropdownOption[];
  fullNameLabel: string;
  fullNamePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  phoneLabel: string;
  phonePlaceholder: string;
  phoneSearchPlaceholder: string;
  phoneEmptySearchLabel: string;
  serviceAreaLabel: string;
  serviceAreaPlaceholder: string;
  fullNameError?: string;
  emailError?: string;
  phoneError?: string;
  serviceAreaError?: string;
  disabled?: boolean;
  isServiceAreaLoading?: boolean;
  onFullNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPhoneCountryChange: (countryCode: string) => void;
  onPhoneNationalNumberChange: (value: string) => void;
  onServiceAreaChange: (values: string[]) => void;
};

export function ManualOnboardAgentForm({
  fullName,
  email,
  phoneCountryCode,
  phoneNationalNumber,
  serviceAreaValues,
  serviceAreaOptions,
  fullNameLabel,
  fullNamePlaceholder,
  emailLabel,
  emailPlaceholder,
  phoneLabel,
  phonePlaceholder,
  phoneSearchPlaceholder,
  phoneEmptySearchLabel,
  serviceAreaLabel,
  serviceAreaPlaceholder,
  fullNameError,
  emailError,
  phoneError,
  serviceAreaError,
  disabled = false,
  isServiceAreaLoading = false,
  onFullNameChange,
  onEmailChange,
  onPhoneCountryChange,
  onPhoneNationalNumberChange,
  onServiceAreaChange,
}: ManualOnboardAgentFormProps) {
  return (
    <div className="flex flex-col gap-4">
      <Input
        type="text"
        name="fullName"
        autoComplete="name"
        label={fullNameLabel}
        placeholder={fullNamePlaceholder}
        value={fullName}
        error={fullNameError}
        isRequired
        disabled={disabled}
        onChange={(event) => {
          onFullNameChange(event.target.value);
        }}
      />

      <Input
        type="email"
        name="email"
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

      <PhoneInput
        label={phoneLabel}
        placeholder={phonePlaceholder}
        searchPlaceholder={phoneSearchPlaceholder}
        emptySearchLabel={phoneEmptySearchLabel}
        countryCode={phoneCountryCode}
        nationalNumber={phoneNationalNumber}
        error={phoneError}
        isRequired
        disabled={disabled}
        onCountryChange={(country) => {
          onPhoneCountryChange(country.iso2);
        }}
        onNationalNumberChange={onPhoneNationalNumberChange}
      />

      <MultiSelectDropdown
        label={serviceAreaLabel}
        placeholder={serviceAreaPlaceholder}
        options={serviceAreaOptions}
        value={serviceAreaValues}
        error={serviceAreaError}
        isRequired
        disabled={disabled || isServiceAreaLoading}
        listboxModal={false}
        onChange={onServiceAreaChange}
      />
    </div>
  );
}
