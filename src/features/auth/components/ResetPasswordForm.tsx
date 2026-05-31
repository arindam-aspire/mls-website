"use client";

import { Eye, EyeOff, KeyRound, Lock } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button, Input } from "@/src/components/ui";
import { PasswordStrengthIndicator } from "@/src/components/common/PasswordStrengthIndicator";
import { useForm } from "@/src/hooks/useForm";

export type ResetPasswordFormValues = {
  password: string;
  confirmPassword: string;
};

const PASSWORD_PATTERN =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,12}$/;

type ResetPasswordFormProps = {
  onSubmit: (password: string) => void;
  isLoading?: boolean;
};

export function ResetPasswordForm({
  onSubmit,
  isLoading = false,
}: ResetPasswordFormProps) {
  const t = useTranslations("auth");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    values,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useForm<ResetPasswordFormValues>({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validate: (formValues) => {
      const nextErrors: Partial<Record<keyof ResetPasswordFormValues, string>> =
        {};

      if (!formValues.password) {
        nextErrors.password = t("resetPasswordNewRequired");
      } else if (!PASSWORD_PATTERN.test(formValues.password)) {
        nextErrors.password = t("resetPasswordInvalid");
      }

      if (!formValues.confirmPassword) {
        nextErrors.confirmPassword = t("resetPasswordConfirmRequired");
      } else if (formValues.confirmPassword !== formValues.password) {
        nextErrors.confirmPassword = t("resetPasswordConfirmMismatch");
      }

      return nextErrors;
    },
  });

  const passwordVisibilityButton = (
    visible: boolean,
    onToggle: () => void,
    labelShow: string,
    labelHide: string,
  ) => (
    <button
      type="button"
      onClick={onToggle}
      className="inline-flex shrink-0 rounded-lg text-muted transition-colors hover:text-text focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40"
      aria-label={visible ? labelHide : labelShow}
    >
      {visible ? (
        <EyeOff className="size-4" aria-hidden />
      ) : (
        <Eye className="size-4" aria-hidden />
      )}
    </button>
  );

  return (
    <form
      noValidate
      onSubmit={handleSubmit((formValues) => {
        onSubmit(formValues.password);
      })}
      className="flex flex-col gap-6"
    >
      <div className="flex flex-col gap-5">
        <Input
          name="password"
          type={showNewPassword ? "text" : "password"}
          autoComplete="new-password"
          size="lg"
          label={t("resetPasswordNewLabel")}
          placeholder={t("resetPasswordPlaceholder")}
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.password}
          hint={!errors.password ? t("signUpPasswordHint") : undefined}
          iconStart={<Lock className="size-4" aria-hidden />}
          iconEnd={passwordVisibilityButton(
            showNewPassword,
            () => setShowNewPassword((prev) => !prev),
            t("signInShowPassword"),
            t("signInHidePassword"),
          )}
          isRequired
        />

        <PasswordStrengthIndicator password={values.password} />

        <Input
          name="confirmPassword"
          type={showConfirmPassword ? "text" : "password"}
          autoComplete="new-password"
          size="lg"
          label={t("resetPasswordConfirmLabel")}
          placeholder={t("resetPasswordPlaceholder")}
          value={values.confirmPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.confirmPassword}
          iconStart={<Lock className="size-4" aria-hidden />}
          iconEnd={passwordVisibilityButton(
            showConfirmPassword,
            () => setShowConfirmPassword((prev) => !prev),
            t("signInShowPassword"),
            t("signInHidePassword"),
          )}
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
        loadingLabel={t("resetPasswordSubmit")}
        iconStart={<KeyRound className="size-5" aria-hidden />}
      >
        {t("resetPasswordSubmit")}
      </Button>
    </form>
  );
}
