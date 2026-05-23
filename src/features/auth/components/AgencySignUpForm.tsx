"use client";

import { CloudUpload, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from "react";
import { Button, Input, PhoneInput } from "@/src/components/ui";
import { cn } from "@/src/lib/cn";
import { useForm } from "@/src/hooks/useForm";

export type AgencySignUpFormValues = {
  agencyName: string;
  tradeName: string;
  email: string;
  phoneCountryCode: string;
  phoneNationalNumber: string;
  password: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_PATTERN =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,12}$/;
const MAX_LICENSE_FILE_BYTES = 10 * 1024 * 1024;
const ACCEPTED_LICENSE_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/jpg",
];
const ACCEPTED_LICENSE_EXTENSIONS = [".pdf", ".jpg", ".jpeg", ".png"];

type AgencySignUpFormProps = {
  onSuccess?: () => void;
};

function isAcceptedLicenseFile(file: File): boolean {
  if (ACCEPTED_LICENSE_TYPES.includes(file.type)) {
    return true;
  }

  const lowerName = file.name.toLowerCase();
  return ACCEPTED_LICENSE_EXTENSIONS.some((ext) => lowerName.endsWith(ext));
}

export function AgencySignUpForm({ onSuccess }: AgencySignUpFormProps) {
  const t = useTranslations("auth");
  const uploadInputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [licenseFile, setLicenseFile] = useState<File | null>(null);
  const [licenseError, setLicenseError] = useState<string | undefined>();
  const [isDragOver, setIsDragOver] = useState(false);

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
      phoneCountryCode: "JO",
      phoneNationalNumber: "",
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

      if (!formValues.phoneNationalNumber.trim()) {
        nextErrors.phoneNationalNumber = t("signUpPhoneRequired");
      } else if (formValues.phoneNationalNumber.replace(/\D/g, "").length < 7) {
        nextErrors.phoneNationalNumber = t("signUpPhoneInvalid");
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
    if (!isAcceptedLicenseFile(file)) {
      return t("agencySignUpLicenseInvalidType");
    }
    if (file.size > MAX_LICENSE_FILE_BYTES) {
      return t("agencySignUpLicenseTooLarge");
    }
    return undefined;
  };

  const applyLicenseFile = (file: File | null) => {
    setLicenseFile(file);
    if (licenseError) {
      setLicenseError(validateLicenseFile(file));
    }
  };

  const handlePhoneChange = (payload: {
    country: { iso2: string };
    nationalNumber: string;
  }) => {
    setValues((prev) => ({
      ...prev,
      phoneCountryCode: payload.country.iso2,
      phoneNationalNumber: payload.nationalNumber,
    }));

    if (touched.phoneNationalNumber) {
      setErrors((prev) => ({
        ...prev,
        phoneNationalNumber: getPhoneError(payload.nationalNumber),
      }));
    }
  };

  const handlePhoneBlur = () => {
    setTouched((prev) => ({ ...prev, phoneNationalNumber: true }));
    setErrors((prev) => ({
      ...prev,
      phoneNationalNumber: getPhoneError(values.phoneNationalNumber),
    }));
  };

  const handleFileInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    applyLicenseFile(file);
    event.target.value = "";
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
    const file = event.dataTransfer.files?.[0] ?? null;
    applyLicenseFile(file);
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const onFormSubmit = handleSubmit(() => {
    const fileError = validateLicenseFile(licenseFile);
    if (fileError) {
      setLicenseError(fileError);
      return;
    }

    onSuccess?.();
  });

  return (
    <form noValidate onSubmit={onFormSubmit} className="flex flex-col gap-6">
      <div className="space-y-1 text-center">
        <h2 className="text-xl font-bold text-secondary sm:text-2xl">
          {t("agencySignUpTitle")}
        </h2>
        <p className="text-sm text-muted">{t("agencySignUpSubtitle")}</p>
      </div>

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
          countryCode={values.phoneCountryCode}
          nationalNumber={values.phoneNationalNumber}
          onChange={handlePhoneChange}
          onBlur={handlePhoneBlur}
          error={errors.phoneNationalNumber}
          searchPlaceholder={t("signUpPhoneSearchPlaceholder")}
          emptySearchLabel={t("signUpPhoneNoMatches")}
          showPhoneIcon={false}
          countrySegmentClassName="-ms-3 flex items-center gap-2 rounded-s-[0.7rem] bg-primary-light ps-3 pe-1 dark:bg-page"
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

        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-text">
            {t("agencySignUpLicenseLabel")}
            <span className="ms-0.5 text-danger" aria-hidden>
              *
            </span>
          </span>

          <div
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                fileInputRef.current?.click();
              }
            }}
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={cn(
              "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-8 text-center transition-colors",
              "border-primary bg-primary-light hover:border-primary-dark",
              isDragOver && "border-primary-dark bg-primary-light/80",
              licenseError && "border-danger",
            )}
          >
            <CloudUpload
              className="size-10 shrink-0 text-primary"
              aria-hidden
            />
            <p className="text-sm font-medium text-text">
              {t("agencySignUpUploadPrompt")}
            </p>
            <p className="text-xs text-muted">
              {t("agencySignUpUploadHint")}
            </p>
            {licenseFile != null && (
              <p className="mt-1 max-w-full truncate text-xs font-medium text-primary-dark">
                {licenseFile.name}
              </p>
            )}
          </div>

          <input
            ref={fileInputRef}
            id={uploadInputId}
            type="file"
            accept={ACCEPTED_LICENSE_EXTENSIONS.join(",")}
            className="sr-only"
            onChange={handleFileInputChange}
          />

          {licenseError != null && (
            <p role="alert" className="text-sm text-danger">
              {licenseError}
            </p>
          )}
        </div>
      </div>

      <Button
        type="submit"
        color="primary"
        size="lg"
        fullWidth
        className="font-semibold"
      >
        {t("agencySignUpSubmit")}
      </Button>
    </form>
  );
}

