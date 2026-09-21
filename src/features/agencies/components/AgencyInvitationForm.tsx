"use client";

import { Building2, Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { LicenseDocumentUpload } from "@/src/components/common/LicenseDocumentUpload";
import { Button, Input, PhoneInput } from "@/src/components/ui";
import { formatPhoneNumberE164 } from "@/src/features/profile/utils/formatPhoneNumberE164";
import { useForm } from "@/src/hooks/useForm";
import { validateLicenseDocumentFile } from "@/src/lib/validateLicenseDocumentFile";

export type AgencyInvitationFormValues = {
  agencyName: string;
  tradeName: string;
  email: string;
  phone: string;
};

type AgencyInvitationFormProps = {
  initialValues: AgencyInvitationFormValues;
  onSubmit: (values: AgencyInvitationFormValues & { legalDocument: File }) => void;
  isLoading: boolean;
  isUploading?: boolean;
};

export function AgencyInvitationForm({
  initialValues,
  onSubmit,
  isLoading,
  isUploading = false,
}: AgencyInvitationFormProps) {
  const t = useTranslations("auth");
  const tInvite = useTranslations("auth.agencyInvitation");
  const [licenseFile, setLicenseFile] = useState<File | null>(null);
  const [licenseError, setLicenseError] = useState<string | undefined>();
  const [phoneCountryCode, setPhoneCountryCode] = useState("JO");
  const [phoneNationalNumber, setPhoneNationalNumber] = useState("");

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    setValues,
    setErrors,
    setTouched,
  } = useForm<AgencyInvitationFormValues>({
    initialValues,
    validate: (formValues) => {
      const nextErrors: Partial<Record<keyof AgencyInvitationFormValues, string>> = {};

      if (!formValues.agencyName.trim()) {
        nextErrors.agencyName = t("agencySignUpNameRequired");
      }

      if (!formValues.tradeName.trim()) {
        nextErrors.tradeName = t("agencySignUpTradeNameRequired");
      }

      if (!phoneNationalNumber.trim()) {
        nextErrors.phone = t("signUpPhoneRequired");
      } else if (phoneNationalNumber.replace(/\D/g, "").length < 7) {
        nextErrors.phone = t("signUpPhoneInvalid");
      }

      return nextErrors;
    },
  });

  const getPhoneError = (nationalNumber: string) => {
    if (!nationalNumber.trim()) {
      return t("signUpPhoneRequired");
    }
    if (nationalNumber.replace(/\D/g, "").length < 7) {
      return t("signUpPhoneInvalid");
    }
    return "";
  };

  const validateLicenseFile = (file: File | null): string | undefined => {
    if (file == null) {
      return t("agencySignUpLicenseRequired");
    }
    return (
      validateLicenseDocumentFile(file, {
        invalidType: t("agencySignUpLicenseInvalidType"),
        tooLarge: t("agencySignUpLicenseTooLarge"),
      }) ?? undefined
    );
  };

  const applyLicenseFile = (file: File) => {
    setLicenseFile(file);
    setLicenseError(validateLicenseFile(file));
  };

  const handlePhoneChange = (payload: {
    country: { iso2: string; dialCode: string };
    nationalNumber: string;
  }) => {
    setPhoneCountryCode(payload.country.iso2);
    setPhoneNationalNumber(payload.nationalNumber);

    setValues((prev) => ({
      ...prev,
      phone: formatPhoneNumberE164(payload.country.dialCode, payload.nationalNumber),
    }));

    if (touched.phone) {
      setErrors((prev) => ({
        ...prev,
        phone: getPhoneError(payload.nationalNumber),
      }));
    }
  };

  const handlePhoneBlur = () => {
    setTouched((prev) => ({ ...prev, phone: true }));
    setErrors((prev) => ({
      ...prev,
      phone: getPhoneError(phoneNationalNumber),
    }));
  };

  const submit = handleSubmit((formValues) => {
    const nextLicenseError = validateLicenseFile(licenseFile);
    setLicenseError(nextLicenseError);

    if (nextLicenseError || licenseFile == null) {
      return;
    }

    onSubmit({
      ...formValues,
      legalDocument: licenseFile,
    });
  });

  const disabled = isLoading || isUploading;

  return (
    <form noValidate onSubmit={submit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-5">
        <Input
          name="agencyName"
          type="text"
          size="lg"
          label={t("agencySignUpNameLabel")}
          placeholder={t("agencySignUpNamePlaceholder")}
          value={values.agencyName}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.agencyName}
          iconStart={<Building2 className="size-4" aria-hidden />}
          isRequired
          disabled={disabled}
        />

        <Input
          name="tradeName"
          type="text"
          size="lg"
          label={t("agencySignUpTradeNameLabel")}
          placeholder={t("agencySignUpTradeNamePlaceholder")}
          value={values.tradeName}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.tradeName}
          isRequired
          disabled={disabled}
        />

        <Input
          name="email"
          type="email"
          size="lg"
          label={t("signUpEmailLabel")}
          value={values.email}
          iconStart={<Mail className="size-4" aria-hidden />}
          disabled
          readOnly
        />

        <PhoneInput
          label={t("agencySignUpPhoneLabel")}
          placeholder={t("signUpPhonePlaceholder")}
          countryCode={phoneCountryCode}
          nationalNumber={phoneNationalNumber}
          onChange={handlePhoneChange}
          onBlur={handlePhoneBlur}
          error={errors.phone}
          searchPlaceholder={t("signUpPhoneSearchPlaceholder")}
          emptySearchLabel={t("signUpPhoneNoMatches")}
          showPhoneIcon={false}
          isRequired
          disabled={disabled}
        />

        <LicenseDocumentUpload
          label={t("agencySignUpLicenseLabel")}
          uploadPrompt={t("agencySignUpUploadPrompt")}
          uploadHint={t("agencySignUpUploadHint")}
          selectedFileName={licenseFile?.name ?? null}
          onFileSelect={applyLicenseFile}
          error={licenseError}
          isRequired
          isUploading={isUploading}
          uploadingLabel={tInvite("uploadingLicense")}
          disabled={disabled}
        />
      </div>

      <Button
        type="submit"
        color="primary"
        size="lg"
        fullWidth
        className="font-semibold"
        isLoading={isLoading}
        disabled={disabled}
      >
        {tInvite("submit")}
      </Button>
    </form>
  );
}
