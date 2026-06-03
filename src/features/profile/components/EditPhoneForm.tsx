"use client";

import type { FormEventHandler } from "react";
import { Save } from "lucide-react";
import { Button, PhoneInput } from "@/src/components/ui";

export type EditPhoneFormProps = {
  phoneCountryCode: string;
  phoneNationalNumber: string;
  phoneError?: string;
  phoneLabel: string;
  phonePlaceholder: string;
  phoneSearchPlaceholder: string;
  phoneEmptySearchLabel: string;
  submitLabel: string;
  loadingLabel: string;
  onPhoneChange: (payload: {
    country: { iso2: string; dialCode: string };
    nationalNumber: string;
  }) => void;
  onPhoneBlur: () => void;
  onFormSubmit: FormEventHandler<HTMLFormElement>;
  isLoading?: boolean;
  isSubmitDisabled?: boolean;
};

export function EditPhoneForm({
  phoneCountryCode,
  phoneNationalNumber,
  phoneError,
  phoneLabel,
  phonePlaceholder,
  phoneSearchPlaceholder,
  phoneEmptySearchLabel,
  submitLabel,
  loadingLabel,
  onPhoneChange,
  onPhoneBlur,
  onFormSubmit,
  isLoading = false,
  isSubmitDisabled = false,
}: EditPhoneFormProps) {
  return (
    <form noValidate onSubmit={onFormSubmit} className="flex flex-col gap-5">
      <PhoneInput
        label={phoneLabel}
        placeholder={phonePlaceholder}
        countryCode={phoneCountryCode}
        nationalNumber={phoneNationalNumber}
        onChange={onPhoneChange}
        onBlur={onPhoneBlur}
        error={phoneError}
        searchPlaceholder={phoneSearchPlaceholder}
        emptySearchLabel={phoneEmptySearchLabel}
        showPhoneIcon={false}
        isRequired
      />

      <Button
        type="submit"
        color="primary"
        size="lg"
        fullWidth
        className="rounded-lg font-semibold"
        isLoading={isLoading}
        loadingLabel={loadingLabel}
        disabled={isSubmitDisabled || isLoading}
        iconStart={<Save className="size-5" aria-hidden />}
      >
        {submitLabel}
      </Button>
    </form>
  );
}
