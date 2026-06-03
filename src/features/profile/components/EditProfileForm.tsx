"use client";

import type { ComponentProps, FormEventHandler } from "react";
import { Mail, Save } from "lucide-react";
import { Button, Input, PhoneInput } from "@/src/components/ui";
import type { EditProfileFormValues } from "../types/profile.types";

export type EditProfileFormProps = {
  values: EditProfileFormValues;
  errors: Partial<Record<keyof EditProfileFormValues, string>>;
  phoneCountryCode: string;
  phoneNationalNumber: string;
  emailLabel: string;
  emailPlaceholder: string;
  phoneLabel: string;
  phonePlaceholder: string;
  phoneSearchPlaceholder: string;
  phoneEmptySearchLabel: string;
  submitLabel: string;
  loadingLabel: string;
  onChange: ComponentProps<typeof Input>["onChange"];
  onBlur: ComponentProps<typeof Input>["onBlur"];
  onPhoneChange: (payload: {
    country: { iso2: string; dialCode: string };
    nationalNumber: string;
  }) => void;
  onPhoneBlur: () => void;
  onFormSubmit: FormEventHandler<HTMLFormElement>;
  isLoading?: boolean;
};

export function EditProfileForm({
  values,
  errors,
  phoneCountryCode,
  phoneNationalNumber,
  emailLabel,
  emailPlaceholder,
  phoneLabel,
  phonePlaceholder,
  phoneSearchPlaceholder,
  phoneEmptySearchLabel,
  submitLabel,
  loadingLabel,
  onChange,
  onBlur,
  onPhoneChange,
  onPhoneBlur,
  onFormSubmit,
  isLoading = false,
}: EditProfileFormProps) {
  return (
    <form noValidate onSubmit={onFormSubmit} className="flex flex-col gap-5">
      <Input
        name="email"
        type="email"
        autoComplete="email"
        size="lg"
        label={emailLabel}
        placeholder={emailPlaceholder}
        value={values.email}
        onChange={onChange}
        onBlur={onBlur}
        error={errors.email}
        iconStart={<Mail className="size-4" aria-hidden />}
        isRequired
      />

      <PhoneInput
        label={phoneLabel}
        placeholder={phonePlaceholder}
        countryCode={phoneCountryCode}
        nationalNumber={phoneNationalNumber}
        onChange={onPhoneChange}
        onBlur={onPhoneBlur}
        error={errors.phone_number}
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
        iconStart={<Save className="size-5" aria-hidden />}
      >
        {submitLabel}
      </Button>
    </form>
  );
}
