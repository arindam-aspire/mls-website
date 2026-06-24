"use client";

import {
  Field,
  Label,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { ChevronDown } from "lucide-react";
import { useLocale } from "next-intl";
import { useId, useMemo, useState } from "react";
import { cn } from "@/src/lib/cn";
import { isRtlLocale } from "@/src/i18n/routing";
import {
  inheritOutlineFocusVisibleClasses,
  inheritOutlineFocusWithinClasses,
  inheritOutlineVariantClasses,
} from "../fieldVariants";
import {
  budgetCurrencyPaddingClasses,
  budgetShellSizeClasses,
  budgetTriggerPaddingClasses,
  dropdownOptionSizeClasses,
  dropdownPanelSizeClasses,
  fieldErrorSizeClasses,
  fieldHintSizeClasses,
  fieldIconSizeClasses,
  fieldLabelSizeClasses,
} from "../responsiveSizes";
import type {
  BudgetSelectProps,
  BudgetSelectSize,
  BudgetSelectVariant,
} from "./types";
import {
  BUDGET_SELECT_EMPTY_VALUE,
  type BudgetSelectOption,
} from "./types";

const shellSizeClasses = budgetShellSizeClasses;

const currencySizeClasses = budgetCurrencyPaddingClasses;

const triggerSizeClasses = budgetTriggerPaddingClasses;

const iconSizeClasses = fieldIconSizeClasses;

const shellVariantClasses: Record<BudgetSelectVariant, string> = {
  outline: cn(
    inheritOutlineVariantClasses,
    inheritOutlineFocusWithinClasses,
  ),
  ghost: cn(
    "border border-transparent bg-transparent shadow-none",
    "hover:border-secondary/30 hover:bg-page",
    "focus-within:border-secondary focus-within:ring-2 focus-within:ring-secondary-dark/12",
  ),
  clear: cn(
    "border-0 bg-transparent shadow-none",
    "hover:bg-page/80",
    "focus-within:ring-2 focus-within:ring-secondary-dark/12",
  ),
};

const panelClasses = cn(
  "z-50 max-h-64 min-w-64 w-(--button-width) overflow-auto rounded-xl border border-secondary-light/80 bg-surface shadow-xl ring-1 ring-black/5",
  dropdownPanelSizeClasses,
  "[scrollbar-width:thin] focus:outline-none",
);

const optionBaseClasses = cn(
  "cursor-pointer rounded-xl text-text transition-colors",
  dropdownOptionSizeClasses,
  "data-focus:bg-page data-hover:bg-page",
  "data-selected:bg-page data-selected:font-medium data-selected:text-secondary-dark",
  "data-disabled:cursor-not-allowed data-disabled:opacity-50",
);

function buildOptions(
  placeholder: string,
  options: BudgetSelectOption[],
): BudgetSelectOption[] {
  return [
    { value: BUDGET_SELECT_EMPTY_VALUE, label: placeholder },
    ...options,
  ];
}

export function BudgetSelect({
  options,
  variant = "outline",
  size = "md",
  placeholder,
  currencyLabel = "JD",
  label,
  labelClassName,
  error,
  hint,
  isRequired = false,
  value,
  defaultValue,
  onChange,
  onBlur,
  fullWidth = true,
  wrapperClassName,
  triggerClassName,
  panelClassName,
  optionClassName,
  currencyClassName,
  className,
  name,
  id: idProp,
  disabled = false,
  autoFocus = false,
  "aria-label": ariaLabel,
}: BudgetSelectProps) {
  const locale = useLocale();
  const isRtl = isRtlLocale(locale);
  const generatedId = useId();
  const selectId = idProp ?? generatedId;
  const errorId = `${selectId}-error`;
  const hintId = `${selectId}-hint`;
  const hasError = Boolean(error);

  const describedBy =
    [hasError ? errorId : null, !hasError && hint ? hintId : null]
      .filter(Boolean)
      .join(" ") || undefined;

  const allOptions = useMemo(
    () => buildOptions(placeholder, options),
    [placeholder, options],
  );

  const [uncontrolledValue, setUncontrolledValue] = useState(
    () => defaultValue ?? BUDGET_SELECT_EMPTY_VALUE,
  );
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : uncontrolledValue;

  const handleChange = (next: string) => {
    if (!isControlled) {
      setUncontrolledValue(next);
    }
    onChange?.(next);
  };

  const selectedOption = allOptions.find(
    (option) => option.value === currentValue,
  );
  const hasSelection =
    selectedOption != null &&
    selectedOption.value !== BUDGET_SELECT_EMPTY_VALUE;

  return (
    <Field
      disabled={disabled}
      className={cn(fullWidth && "w-full", wrapperClassName, className)}
    >
      {label != null && (
        <Label
          htmlFor={selectId}
            className={cn(fieldLabelSizeClasses, labelClassName)}
        >
          {label}
          {isRequired && (
            <span className="ms-0.5 text-danger" aria-hidden>
              *
            </span>
          )}
        </Label>
      )}

      <Listbox
        value={currentValue}
        onChange={handleChange}
        disabled={disabled}
        invalid={hasError}
        name={name}
        aria-label={label == null ? ariaLabel : undefined}
        aria-required={isRequired || undefined}
      >
        <div
          className={cn(
            "relative isolate z-[1] flex min-w-0 items-center rounded-lg transition-colors",
            shellSizeClasses[size],
            shellVariantClasses[variant],
            hasError &&
              "border-danger hover:border-danger focus-within:border-danger focus-within:ring-danger/20",
          )}
        >
          <span
            className={cn(
              "shrink-0 font-medium text-muted",
              currencySizeClasses[size],
              currencyClassName,
            )}
          >
            {currencyLabel}
          </span>

          <div className="h-6 w-px shrink-0 bg-secondary/15" aria-hidden />

          <div className="relative min-w-0 flex-1">
            <ListboxButton
              suppressHydrationWarning
              id={selectId}
              autoFocus={autoFocus}
              aria-invalid={hasError || undefined}
              aria-describedby={describedBy}
              onBlur={onBlur}
              className={cn(
                "relative flex w-full items-center rounded-lg outline-none",
                "data-disabled:cursor-not-allowed data-disabled:opacity-50",
                triggerSizeClasses[size],
                inheritOutlineFocusVisibleClasses,
                isRtl ? "text-end" : "text-left",
                triggerClassName,
              )}
            >
              <span
                className={cn(
                  "min-w-0 flex-1 truncate",
                  isRtl ? "text-end" : "text-left",
                  hasSelection
                    ? "font-medium text-text"
                    : "font-normal text-muted",
                )}
              >
                {hasSelection ? selectedOption.label : placeholder}
              </span>
              <ChevronDown
                className={cn("shrink-0 text-muted", iconSizeClasses[size])}
                aria-hidden
              />
            </ListboxButton>

            <ListboxOptions
              anchor={isRtl ? "bottom end" : "bottom start"}
              transition
              className={cn(
                panelClasses,
                "[--anchor-gap:0.5rem]",
                panelClassName,
              )}
            >
              <div className="py-1">
                {allOptions.map((option) => (
                  <ListboxOption
                    key={
                      option.value === BUDGET_SELECT_EMPTY_VALUE
                        ? "__placeholder__"
                        : option.value
                    }
                    value={option.value}
                    disabled={option.disabled}
                    className={cn(
                      optionBaseClasses,
                      isRtl ? "text-end" : "text-left",
                      optionClassName,
                    )}
                  >
                    {option.label}
                  </ListboxOption>
                ))}
              </div>
            </ListboxOptions>
          </div>
        </div>
      </Listbox>

      {hasError && (
        <p id={errorId} role="alert" className={fieldErrorSizeClasses}>
          {error}
        </p>
      )}

      {!hasError && hint != null && (
        <p id={hintId} className={fieldHintSizeClasses}>
          {hint}
        </p>
      )}
    </Field>
  );
}

export type {
  BudgetSelectOption,
  BudgetSelectProps,
  BudgetSelectSize,
  BudgetSelectVariant,
} from "./types";
export {
  BUDGET_SELECT_EMPTY_VALUE,
  BUDGET_SELECT_SIZES,
  BUDGET_SELECT_VARIANTS,
} from "./types";
export { BUY_BUDGET_OPTIONS, RENT_BUDGET_OPTIONS } from "./ranges";
export {
  decodeBudgetRange,
  encodeBudgetRange,
  formatBudgetAmount,
  resolveBudgetRangeValue,
} from "./utils";
