"use client";

import type { ComponentProps, FormEventHandler } from "react";
import { Mail, Save } from "lucide-react";
import { Button, Input } from "@/src/components/ui";
import type { EditEmailFormValues } from "../types/profile.types";

export type EditEmailFormProps = {
  values: EditEmailFormValues;
  errors: Partial<Record<keyof EditEmailFormValues, string>>;
  emailLabel: string;
  emailPlaceholder: string;
  submitLabel: string;
  loadingLabel: string;
  onChange: ComponentProps<typeof Input>["onChange"];
  onBlur: ComponentProps<typeof Input>["onBlur"];
  onFormSubmit: FormEventHandler<HTMLFormElement>;
  isLoading?: boolean;
  isSubmitDisabled?: boolean;
};

export function EditEmailForm({
  values,
  errors,
  emailLabel,
  emailPlaceholder,
  submitLabel,
  loadingLabel,
  onChange,
  onBlur,
  onFormSubmit,
  isLoading = false,
  isSubmitDisabled = false,
}: EditEmailFormProps) {
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
