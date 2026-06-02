"use client";

import { Eye, EyeOff, KeyRound, Lock } from "lucide-react";
import { useState } from "react";
import { Button, Input } from "@/src/components/ui";
import { PasswordStrengthIndicator } from "@/src/components/common/PasswordStrengthIndicator";
import { useForm } from "@/src/hooks/useForm";

type ChangePasswordFormValues = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const PASSWORD_PATTERN =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,12}$/;

type ChangePasswordFormProps = {
  onSubmit: (values: ChangePasswordFormValues) => void;
  isLoading?: boolean;
};

export function ChangePasswordForm({
  onSubmit,
  isLoading = false,
}: ChangePasswordFormProps) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    values,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useForm<ChangePasswordFormValues>({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validate: (formValues) => {
      const nextErrors: Partial<Record<keyof ChangePasswordFormValues, string>> =
        {};

      if (!formValues.currentPassword) {
        nextErrors.currentPassword = "Current password is required.";
      }

      if (!formValues.newPassword) {
        nextErrors.newPassword = "New password is required.";
      } else if (!PASSWORD_PATTERN.test(formValues.newPassword)) {
        nextErrors.newPassword =
          "Use 8-12 characters with upper, lower, number, and special character.";
      }

      if (!formValues.confirmPassword) {
        nextErrors.confirmPassword = "Please confirm your new password.";
      } else if (formValues.confirmPassword !== formValues.newPassword) {
        nextErrors.confirmPassword = "Passwords do not match.";
      }

      return nextErrors;
    },
  });

  const visibilityButton = (
    visible: boolean,
    onToggle: () => void,
    label: string,
  ) => (
    <button
      type="button"
      onClick={onToggle}
      className="inline-flex shrink-0 rounded-lg text-muted transition-colors hover:text-text focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40"
      aria-label={label}
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
      onSubmit={handleSubmit((formValues) => onSubmit(formValues))}
      className="flex flex-col gap-5"
    >
      <Input
        name="currentPassword"
        type={showCurrentPassword ? "text" : "password"}
        autoComplete="current-password"
        size="lg"
        label="Current password"
        placeholder="Enter current password"
        value={values.currentPassword}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.currentPassword}
        iconStart={<Lock className="size-4" aria-hidden />}
        iconEnd={visibilityButton(
          showCurrentPassword,
          () => setShowCurrentPassword((prev) => !prev),
          showCurrentPassword ? "Hide current password" : "Show current password",
        )}
        isRequired
      />

      <Input
        name="newPassword"
        type={showNewPassword ? "text" : "password"}
        autoComplete="new-password"
        size="lg"
        label="New password"
        placeholder="Enter new password"
        value={values.newPassword}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.newPassword}
        hint={
          !errors.newPassword
            ? "Use 8-12 chars with uppercase, lowercase, number, and symbol."
            : undefined
        }
        iconStart={<Lock className="size-4" aria-hidden />}
        iconEnd={visibilityButton(
          showNewPassword,
          () => setShowNewPassword((prev) => !prev),
          showNewPassword ? "Hide new password" : "Show new password",
        )}
        isRequired
      />

      <PasswordStrengthIndicator password={values.newPassword} />

      <Input
        name="confirmPassword"
        type={showConfirmPassword ? "text" : "password"}
        autoComplete="new-password"
        size="lg"
        label="Confirm new password"
        placeholder="Re-enter new password"
        value={values.confirmPassword}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.confirmPassword}
        iconStart={<Lock className="size-4" aria-hidden />}
        iconEnd={visibilityButton(
          showConfirmPassword,
          () => setShowConfirmPassword((prev) => !prev),
          showConfirmPassword ? "Hide confirm password" : "Show confirm password",
        )}
        isRequired
      />

      <Button
        type="submit"
        color="primary"
        size="lg"
        fullWidth
        className="font-semibold"
        isLoading={isLoading}
        loadingLabel="Updating password..."
        iconStart={<KeyRound className="size-5" aria-hidden />}
      >
        Update password
      </Button>
    </form>
  );
}

export type { ChangePasswordFormProps, ChangePasswordFormValues };
