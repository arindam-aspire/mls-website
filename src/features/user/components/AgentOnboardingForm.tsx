"use client";

import { LicenseDocumentUpload } from "@/src/components/common/LicenseDocumentUpload";
import { Input, MultiSelectDropdown, PhoneInput } from "@/src/components/ui";
import type { MultiSelectDropdownOption } from "@/src/components/ui/multi-select-dropdown";

export type AgentOnboardingFormProps = {
  fullName: string;
  email: string;
  phoneCountryCode: string;
  phoneNationalNumber: string;
  whatsappCountryCode: string;
  whatsappNationalNumber: string;
  serviceAreaValues: string[];
  serviceAreaOptions: MultiSelectDropdownOption[];
  position: string;
  identityDocumentFileName?: string | null;
  fullNameLabel: string;
  fullNamePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  phoneLabel: string;
  phonePlaceholder: string;
  phoneSearchPlaceholder: string;
  phoneEmptySearchLabel: string;
  whatsappLabel: string;
  whatsappPlaceholder: string;
  serviceAreaLabel: string;
  serviceAreaPlaceholder: string;
  positionLabel: string;
  positionPlaceholder: string;
  identityDocumentLabel: string;
  identityDocumentUploadPrompt: string;
  identityDocumentUploadHint: string;
  identityDocumentUploadingLabel?: string;
  fullNameError?: string;
  emailError?: string;
  phoneError?: string;
  whatsappError?: string;
  serviceAreaError?: string;
  positionError?: string;
  identityDocumentError?: string;
  disabled?: boolean;
  /** When true (invitation onboarding), email is displayed but not editable. */
  isEmailReadOnly?: boolean;
  isServiceAreaLoading?: boolean;
  isIdentityDocumentUploading?: boolean;
  onFullNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPhoneCountryChange: (countryCode: string) => void;
  onPhoneNationalNumberChange: (value: string) => void;
  onWhatsappCountryChange: (countryCode: string) => void;
  onWhatsappNationalNumberChange: (value: string) => void;
  onServiceAreaChange: (values: string[]) => void;
  onPositionChange: (value: string) => void;
  onIdentityDocumentSelect: (file: File) => void;
};

export function AgentOnboardingForm({
  fullName,
  email,
  phoneCountryCode,
  phoneNationalNumber,
  whatsappCountryCode,
  whatsappNationalNumber,
  serviceAreaValues,
  serviceAreaOptions,
  position,
  identityDocumentFileName,
  fullNameLabel,
  fullNamePlaceholder,
  emailLabel,
  emailPlaceholder,
  phoneLabel,
  phonePlaceholder,
  phoneSearchPlaceholder,
  phoneEmptySearchLabel,
  whatsappLabel,
  whatsappPlaceholder,
  serviceAreaLabel,
  serviceAreaPlaceholder,
  positionLabel,
  positionPlaceholder,
  identityDocumentLabel,
  identityDocumentUploadPrompt,
  identityDocumentUploadHint,
  identityDocumentUploadingLabel,
  fullNameError,
  emailError,
  phoneError,
  whatsappError,
  serviceAreaError,
  positionError,
  identityDocumentError,
  disabled = false,
  isEmailReadOnly = false,
  isServiceAreaLoading = false,
  isIdentityDocumentUploading = false,
  onFullNameChange,
  onEmailChange,
  onPhoneCountryChange,
  onPhoneNationalNumberChange,
  onWhatsappCountryChange,
  onWhatsappNationalNumberChange,
  onServiceAreaChange,
  onPositionChange,
  onIdentityDocumentSelect,
}: AgentOnboardingFormProps) {
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
        readOnly={isEmailReadOnly}
        inputClassName={isEmailReadOnly ? "cursor-default text-muted" : undefined}
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

      <PhoneInput
        label={whatsappLabel}
        placeholder={whatsappPlaceholder}
        searchPlaceholder={phoneSearchPlaceholder}
        emptySearchLabel={phoneEmptySearchLabel}
        countryCode={whatsappCountryCode}
        nationalNumber={whatsappNationalNumber}
        error={whatsappError}
        disabled={disabled}
        onCountryChange={(country) => {
          onWhatsappCountryChange(country.iso2);
        }}
        onNationalNumberChange={onWhatsappNationalNumberChange}
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

      <Input
        type="text"
        name="position"
        label={positionLabel}
        placeholder={positionPlaceholder}
        value={position}
        error={positionError}
        disabled={disabled}
        onChange={(event) => {
          onPositionChange(event.target.value);
        }}
      />

      <LicenseDocumentUpload
        variant="compact"
        label={identityDocumentLabel}
        uploadPrompt={identityDocumentUploadPrompt}
        uploadHint={identityDocumentUploadHint}
        selectedFileName={identityDocumentFileName}
        error={identityDocumentError}
        isUploading={isIdentityDocumentUploading}
        uploadingLabel={identityDocumentUploadingLabel}
        disabled={disabled}
        onFileSelect={onIdentityDocumentSelect}
      />
    </div>
  );
}
