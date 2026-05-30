"use client";

import { Info, Mail, Send } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button, Input, PhoneInput, ToggleButton } from "@/src/components/ui";
import { useForm } from "@/src/hooks/useForm";
import { cn } from "@/src/lib/cn";
import { bodyTextClasses } from "@/src/lib/typography";

export type SignInOtpMethod = "email" | "phone";

export type SignInWithOTPFormValues = {
  email: string;
  phoneCountryCode: string;
  phoneNationalNumber: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type SignInWithOTPFormProps = {
  onSubmit: (values: SignInWithOTPFormValues, method: SignInOtpMethod) => void;
  isLoading: boolean;
};

export function SignInWithOTPForm({
  onSubmit,
  isLoading,
}: SignInWithOTPFormProps) {
  const t = useTranslations("auth");
  const [method, setMethod] = useState<SignInOtpMethod>("email");

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
  } = useForm<SignInWithOTPFormValues>({
    initialValues: {
      email: "",
      phoneCountryCode: "JO",
      phoneNationalNumber: "",
    },
    validate: (formValues) => {
      const nextErrors: Partial<Record<keyof SignInWithOTPFormValues, string>> =
        {};

      if (method === "email") {
        if (!formValues.email.trim()) {
          nextErrors.email = t("forgotPasswordEmailRequired");
        } else if (!EMAIL_PATTERN.test(formValues.email.trim())) {
          nextErrors.email = t("forgotPasswordEmailInvalid");
        }
        return nextErrors;
      }

      if (!formValues.phoneNationalNumber.trim()) {
        nextErrors.phoneNationalNumber = t("forgotPasswordPhoneRequired");
      } else if (formValues.phoneNationalNumber.replace(/\D/g, "").length < 7) {
        nextErrors.phoneNationalNumber = t("forgotPasswordPhoneInvalid");
      }

      return nextErrors;
    },
  });

  const getPhoneError = (nationalNumber: string) => {
    if (!nationalNumber.trim()) {
      return t("forgotPasswordPhoneRequired");
    }
    if (nationalNumber.replace(/\D/g, "").length < 7) {
      return t("forgotPasswordPhoneInvalid");
    }
    return "";
  };

  const handleMethodChange = (nextMethod: SignInOtpMethod) => {
    setMethod(nextMethod);
    setErrors({});
    setTouched({});
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
      onSubmit={handleSubmit((formValues) => onSubmit(formValues, method))}
      className="flex flex-col gap-6"
    >
      <ToggleButton<SignInOtpMethod>
        className="w-full"
        color="primary"
        size="md"
        isRounded
        variant="ghost"
        value={method}
        onChange={handleMethodChange}
        aria-label={t("forgotPasswordMethodLabel")}
        items={[
          { value: "email", label: t("forgotPasswordTabEmail") },
          { value: "phone", label: t("forgotPasswordTabPhone") },
        ]}
      />

      <div className="flex flex-col gap-4">
        {method === "email" ? (
          <Input
            name="email"
            type="email"
            autoComplete="email"
            size="lg"
            label={t("forgotPasswordEmailLabel")}
            placeholder={t("forgotPasswordEmailPlaceholder")}
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.email}
            iconStart={<Mail className="size-4" aria-hidden />}
            isRequired
          />
        ) : (
          <PhoneInput
            label={t("forgotPasswordPhoneLabel")}
            placeholder={t("forgotPasswordPhonePlaceholder")}
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
        )}

        <div
          role="note"
          className="flex gap-3 rounded-xl border border-secondary/15 bg-primary-light p-4"
        >
          <Info
            className="mt-0.5 size-5 shrink-0 text-primary-dark"
            aria-hidden
          />
          <p className={cn(bodyTextClasses, "leading-relaxed text-text")}>
            {method === "email"
              ? t("forgotPasswordInfoEmail")
              : t("forgotPasswordInfoPhone")}
          </p>
        </div>
      </div>

      <Button
        type="submit"
        color="primary"
        size="lg"
        fullWidth
        className="font-semibold"
        isLoading={isLoading}
        iconStart={<Send className="size-5" aria-hidden />}
      >
        {t("forgotPasswordSendOtp")}
      </Button>
    </form>
  );
}
