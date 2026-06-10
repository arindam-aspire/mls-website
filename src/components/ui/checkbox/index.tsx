"use client";

import { Check } from "lucide-react";
import { forwardRef, useId } from "react";
import { cn } from "@/src/lib/cn";
import { checkboxLabelClasses } from "@/src/lib/typography";
import type {
  CheckboxColor,
  CheckboxFieldProps,
  CheckboxProps,
  CheckboxSize,
} from "./types";

const boxSizeClasses: Record<CheckboxSize, string> = {
  sm: "size-4",
  md: "size-5",
};

const checkIconSizeClasses: Record<CheckboxSize, string> = {
  sm: "size-3",
  md: "size-3.5",
};

const checkedColorClasses: Record<CheckboxColor, string> = {
  primary:
    "group-has-[:checked]/checkbox:border-primary group-has-[:checked]/checkbox:bg-primary",
  secondary:
    "group-has-[:checked]/checkbox:border-secondary group-has-[:checked]/checkbox:bg-secondary",
};

type CheckboxIndicatorProps = {
  size: CheckboxSize;
  color: CheckboxColor;
};

function CheckboxIndicator({ size, color }: CheckboxIndicatorProps) {
  return (
    <span
      aria-hidden
      className={cn(
        boxSizeClasses[size],
        "pointer-events-none flex items-center justify-center rounded border border-secondary/25 bg-surface transition-colors",
        checkedColorClasses[color],
        "group-has-[:focus-visible]/checkbox:ring-2 group-has-[:focus-visible]/checkbox:ring-secondary/40 group-has-[:focus-visible]/checkbox:ring-offset-2 group-has-[:focus-visible]/checkbox:ring-offset-page",
        "group-has-[:disabled]/checkbox:opacity-50",
      )}
    >
      <Check
        className={cn(
          checkIconSizeClasses[size],
          "text-white opacity-0 transition-opacity group-has-[:checked]/checkbox:opacity-100",
        )}
        strokeWidth={3}
      />
    </span>
  );
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  {
    checked,
    defaultChecked,
    onChange,
    disabled = false,
    color = "primary",
    size = "sm",
    className,
    id,
    name,
    "aria-label": ariaLabel,
  },
  ref,
) {
  return (
    <span className={cn("group/checkbox relative inline-flex shrink-0", className)}>
      <input
        ref={ref}
        id={id}
        name={name}
        type="checkbox"
        className="sr-only"
        checked={checked}
        defaultChecked={defaultChecked}
        disabled={disabled}
        aria-label={ariaLabel}
        onChange={(event) => {
          onChange?.(event.target.checked);
        }}
      />
      <CheckboxIndicator size={size} color={color} />
    </span>
  );
});

export function CheckboxField({
  label,
  checked,
  onChange,
  disabled = false,
  color = "primary",
  size = "sm",
  className,
  labelClassName,
  checkboxClassName,
  id: idProp,
  name,
}: CheckboxFieldProps) {
  const generatedId = useId();
  const id = idProp ?? generatedId;

  return (
    <label
      htmlFor={id}
      className={cn(
        "flex min-h-6 cursor-pointer items-center gap-2.5 text-text",
        checkboxLabelClasses,
        disabled && "cursor-not-allowed opacity-60",
        className,
      )}
    >
      <Checkbox
        id={id}
        name={name}
        checked={checked}
        disabled={disabled}
        color={color}
        size={size}
        className={checkboxClassName}
        onChange={onChange}
      />
      <span className={cn("min-w-0 flex-1 truncate", labelClassName)}>{label}</span>
    </label>
  );
}

export { CHECKBOX_COLORS, CHECKBOX_SIZES } from "./types";
export type {
  CheckboxColor,
  CheckboxFieldProps,
  CheckboxProps,
  CheckboxSize,
} from "./types";
