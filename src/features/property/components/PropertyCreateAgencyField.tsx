"use client";

import { Button, Select } from "@/src/components/ui";
import { cn } from "@/src/lib/cn";
import type { SelectOption } from "@/src/components/ui/select/types";

export type PropertyCreateAgencyFieldProps = {
  label: string;
  placeholder: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  hint?: string;
  disabled?: boolean;
  isRequired?: boolean;
  retryLabel?: string;
  onRetry?: () => void;
};

export function PropertyCreateAgencyField({
  label,
  placeholder,
  options,
  value,
  onChange,
  error,
  hint,
  disabled = false,
  isRequired = true,
  retryLabel,
  onRetry,
}: PropertyCreateAgencyFieldProps) {
  return (
    <div
      className={cn(
        "w-full min-w-0 rounded-xl border border-secondary/15 bg-surface p-4 sm:p-6",
      )}
    >
      <div className="grid grid-cols-1 gap-3 md:max-w-md md:grid-cols-1">
        <Select
          label={label}
          placeholder={placeholder}
          options={options}
          value={value}
          onChange={onChange}
          error={error}
          hint={hint}
          disabled={disabled}
          isRequired={isRequired}
          fullWidth
        />
        {onRetry && retryLabel ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="w-full sm:w-auto"
          >
            {retryLabel}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
