"use client";

import { Eye, EyeOff, Lock, Mail, User, UserPlus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button, Input, PhoneInput } from "@/src/components/ui";
import { useForm } from "@/src/hooks/useForm";
import type { SignUpFormValues } from "../types/auth.types";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_PATTERN =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,12}$/;
const FULL_NAME_PATTERN = /^[a-zA-Z\s]+$/;

type SignUpFormProps = {
  onSubmit: (values: SignUpFormValues) => void;
  isLoading: boolean;
};

export function SignUpForm({ onSubmit, isLoading }: SignUpFormProps) {
  const t = useTranslations("auth");
  const [showPassword, setShowPassword] = useState(false);
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
  } = useForm<SignUpFormValues>({
    initialValues: {
      full_name: "",
      email: "",
      phone_number: "",
      password: "",
    },
    validate: (formValues) => {
      const nextErrors: Partial<Record<keyof SignUpFormValues, string>> = {};

      if (!formValues.full_name.trim()) {
        nextErrors.full_name = t("signUpFullNameRequired");
      } else if (
        !FULL_NAME_PATTERN.test(formValues.full_name.trim()) ||
        (formValues.full_name.match(/[a-zA-Z]/g) || []).length < 2
      ) {
        nextErrors.full_name = t("signUpFullNameInvalid");
      }

      if (!formValues.email.trim()) {
        nextErrors.email = t("signUpEmailRequired");
      } else if (!EMAIL_PATTERN.test(formValues.email.trim())) {
        nextErrors.email = t("signUpEmailInvalid");
      }

      if (!phoneNationalNumber.trim()) {
        nextErrors.phone_number = t("signUpPhoneRequired");
      } else if (phoneNationalNumber.replace(/\D/g, "").length < 7) {
        nextErrors.phone_number = t("signUpPhoneInvalid");
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

  const handlePhoneChange = (payload: {
    country: { iso2: string; dialCode: string };
    nationalNumber: string;
  }) => {
    setPhoneCountryCode(payload.country.iso2);
    setPhoneNationalNumber(payload.nationalNumber);

    const phoneNumber = payload.nationalNumber
      ? `${payload.country.dialCode} ${payload.nationalNumber}`
      : "";

    setValues((prev) => ({
      ...prev,
      phone_number: phoneNumber,
    }));

    if (touched.phone_number) {
      setErrors((prev) => ({
        ...prev,
        phone_number: getPhoneError(payload.nationalNumber),
      }));
    }
  };

  const handlePhoneBlur = () => {
    setTouched((prev) => ({ ...prev, phone_number: true }));
    setErrors((prev) => ({
      ...prev,
      phone_number: getPhoneError(phoneNationalNumber),
    }));
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6"
    >
      <div className="space-y-1 text-center">
        <h2 className="text-xl font-bold text-secondary sm:text-2xl">
          {t("signUpFormTitle")}
        </h2>
        <p className="text-sm text-muted">{t("signUpFormSubtitle")}</p>
      </div>

      <div className="flex flex-col gap-5">
        <Input
          name="full_name"
          type="text"
          autoComplete="name"
          size="lg"
          label={t("signUpFullNameLabel")}
          placeholder={t("signUpFullNamePlaceholder")}
          value={values.full_name}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.full_name}
          iconStart={<User className="size-4" aria-hidden />}
          isRequired
        />

        <Input
          name="email"
          type="email"
          autoComplete="email"
          size="lg"
          label={t("signUpEmailLabel")}
          placeholder={t("signUpEmailPlaceholder")}
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.email}
          iconStart={<Mail className="size-4" aria-hidden />}
          isRequired
        />

        <PhoneInput
          label={t("signUpPhoneLabel")}
          placeholder={t("signUpPhonePlaceholder")}
          countryCode={phoneCountryCode}
          nationalNumber={phoneNationalNumber}
          onChange={handlePhoneChange}
          onBlur={handlePhoneBlur}
          error={errors.phone_number}
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
          placeholder={t("signUpPasswordPlaceholder")}
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
      </div>

      <Button
        type="submit"
        color="primary"
        size="lg"
        fullWidth
        className="font-semibold"
        isLoading={isLoading}
        iconStart={<UserPlus className="size-5" aria-hidden />}
      >
        {t("signUpCreateAccount")}
      </Button>
    </form>
  );
}
