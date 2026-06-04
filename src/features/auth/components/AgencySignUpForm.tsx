"use client";

import { Building2, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { LicenseDocumentUpload } from "@/src/components/common/LicenseDocumentUpload";
import { Button, Input, PhoneInput } from "@/src/components/ui";
import { PasswordStrengthIndicator } from "@/src/components/common/PasswordStrengthIndicator";
import { cn } from "@/src/lib/cn";
import { bodyTextClasses } from "@/src/lib/typography";
import { validateLicenseDocumentFile } from "@/src/lib/validateLicenseDocumentFile";
import { useForm } from "@/src/hooks/useForm";
import type { AgencySignUpSubmitValues } from "../types/auth.types";

export type AgencySignUpFormValues = {
  agencyName: string;
  tradeName: string;
  email: string;
  phone: string;
  password: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_PATTERN =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,12}$/;
type AgencySignUpFormProps = {
  onSubmit: (values: AgencySignUpSubmitValues) => void;
  isLoading: boolean;
};

export function AgencySignUpForm({ onSubmit, isLoading }: AgencySignUpFormProps) {
  const t = useTranslations("auth");
  const [showPassword, setShowPassword] = useState(false);
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
  } = useForm<AgencySignUpFormValues>({
    initialValues: {
      agencyName: "",
      tradeName: "",
      email: "",
      phone: "",
      password: "",
    },
    validate: (formValues) => {
      const nextErrors: Partial<Record<keyof AgencySignUpFormValues, string>> =
        {};

      if (!formValues.agencyName.trim()) {
        nextErrors.agencyName = t("agencySignUpNameRequired");
      }

      if (!formValues.tradeName.trim()) {
        nextErrors.tradeName = t("agencySignUpTradeNameRequired");
      }

      if (!formValues.email.trim()) {
        nextErrors.email = t("signUpEmailRequired");
      } else if (!EMAIL_PATTERN.test(formValues.email.trim())) {
        nextErrors.email = t("signUpEmailInvalid");
      }

      if (!phoneNationalNumber.trim()) {
        nextErrors.phone = t("signUpPhoneRequired");
      } else if (phoneNationalNumber.replace(/\D/g, "").length < 7) {
        nextErrors.phone = t("signUpPhoneInvalid");
      }

      if (!formValues.password) {
        nextErrors.password = t("signUpPasswordRequired");
      } else if (!PASSWORD_PATTERN.test(formValues.password)) {
        nextErrors.password = t("signUpPasswordInvalid");
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

    const phoneNumber = payload.nationalNumber
      ? `${payload.country.dialCode}${payload.nationalNumber}`
      : "";

    setValues((prev) => ({
      ...prev,
      phone: phoneNumber,
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

  const onFormSubmit = handleSubmit((formValues) => {
    const fileError = validateLicenseFile(licenseFile);
    if (fileError) {
      setLicenseError(fileError);
      return;
    }

    if (licenseFile == null) {
      return;
    }

    onSubmit({
      agencyName: formValues.agencyName.trim(),
      tradeName: formValues.tradeName.trim(),
      email: formValues.email.trim(),
      phone: formValues.phone.trim(),
      password: formValues.password,
      legalDocument: licenseFile,
    });
  });

  return (
    <form noValidate onSubmit={onFormSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            name="agencyName"
            type="text"
            autoComplete="organization"
            size="lg"
            label={t("agencySignUpNameLabel")}
            placeholder={t("agencySignUpNamePlaceholder")}
            value={values.agencyName}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.agencyName}
            isRequired
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
          />
        </div>

        <Input
          name="email"
          type="email"
          autoComplete="email"
          size="lg"
          label={t("signUpEmailLabel")}
          placeholder={t("agencySignUpEmailPlaceholder")}
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.email}
          iconStart={<Mail className="size-4" aria-hidden />}
          isRequired
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
        />

        <Input
          name="password"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          size="lg"
          label={t("signUpPasswordLabel")}
          placeholder={t("agencySignUpPasswordPlaceholder")}
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.password}
          hint={!errors.password ? t("signUpPasswordHint") : undefined}
          iconStart={<Lock className="size-4" aria-hidden />}
          iconEnd={
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="inline-flex shrink-0 rounded-lg text-muted transition-colors hover:text-text focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40"
              aria-label={
                showPassword
                  ? t("signInHidePassword")
                  : t("signInShowPassword")
              }
            >
              {showPassword ? (
                <EyeOff className="size-4" aria-hidden />
              ) : (
                <Eye className="size-4" aria-hidden />
              )}
            </button>
          }
          isRequired
        />

        <PasswordStrengthIndicator password={values.password} />

        <LicenseDocumentUpload
          label={t("agencySignUpLicenseLabel")}
          uploadPrompt={t("agencySignUpUploadPrompt")}
          uploadHint={t("agencySignUpUploadHint")}
          selectedFileName={licenseFile?.name ?? null}
          onFileSelect={applyLicenseFile}
          error={licenseError}
          isRequired
          disabled={isLoading}
        />
      </div>

      <Button
        type="submit"
        color="primary"
        size="lg"
        fullWidth
        className="font-semibold"
        isLoading={isLoading}
        loadingLabel={t("agencySignUpSubmit")}
        iconStart={<Building2 className="size-5" aria-hidden />}
      >
        {t("agencySignUpSubmit")}
      </Button>
    </form>
  );
}
