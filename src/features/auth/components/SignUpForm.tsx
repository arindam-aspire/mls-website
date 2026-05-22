"use client";

import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button, Input, PhoneInput } from "@/src/components/ui";
import { useForm } from "@/src/hooks/useForm";

export type SignUpFormValues = {
  fullName: string;
  email: string;
  phoneCountryCode: string;
  phoneNationalNumber: string;
  password: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_PATTERN =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,12}$/;

export function SignUpForm() {
  const t = useTranslations("auth");
  const [showPassword, setShowPassword] = useState(false);

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
      fullName: "",
      email: "",
      phoneCountryCode: "JO",
      phoneNationalNumber: "",
      password: "",
    },
    validate: (formValues) => {
      const nextErrors: Partial<Record<keyof SignUpFormValues, string>> = {};

      if (!formValues.fullName.trim()) {
        nextErrors.fullName = t("signUpFullNameRequired");
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

  return (
    <form
      noValidate
      onSubmit={handleSubmit(() => {
        // Email sign-up submit — wire API when ready
      })}
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
          name="fullName"
          type="text"
          autoComplete="name"
          size="lg"
          label={t("signUpFullNameLabel")}
          placeholder={t("signUpFullNamePlaceholder")}
          value={values.fullName}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.fullName}
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
      >
        {t("signUpCreateAccount")}
      </Button>
    </form>
  );
}
