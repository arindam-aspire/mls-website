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
import { useId, useMemo, useState, type ReactNode } from "react";
import { cn } from "@/src/lib/cn";
import { isRtlLocale } from "@/src/i18n/routing";
import {
  inheritOutlineFocusVisibleClasses,
  inheritOutlineVariantClasses,
} from "../fieldVariants";
import {
  dropdownOptionSizeClasses,
  dropdownPanelSizeClasses,
  fieldControlSizeClasses,
  fieldErrorSizeClasses,
  fieldHintSizeClasses,
  fieldIconSizeClasses,
  fieldLabelSizeClasses,
} from "../responsiveSizes";
import type {
  SelectDropdownProps,
  SelectDropdownSize,
  SelectDropdownVariant,
} from "./types";
import {
  SELECT_DROPDOWN_EMPTY_VALUE,
  type SelectDropdownOption,
} from "./types";

const triggerSizeClasses = fieldControlSizeClasses;

const iconSizeClasses = fieldIconSizeClasses;

const triggerBaseClasses = cn(
  "relative flex w-full items-center rounded-xl transition-colors",
  "outline-none data-disabled:cursor-not-allowed data-disabled:opacity-50",
);

const triggerVariantClasses: Record<SelectDropdownVariant, string> = {
  outline: cn(
    inheritOutlineVariantClasses,
    inheritOutlineFocusVisibleClasses,
  ),
  ghost: cn(
    "border border-transparent bg-transparent shadow-none",
    "hover:border-secondary/30 hover:bg-page",
    "focus-visible:border-secondary focus-visible:ring-2 focus-visible:ring-secondary-dark/12",
  ),
  clear: cn(
    "border-0 bg-transparent shadow-none",
    "hover:bg-page/80",
    "focus-visible:ring-2 focus-visible:ring-secondary-dark/12",
  ),
};

const panelClasses = cn(
  "z-[130] max-h-64 w-(--button-width) min-w-(--button-width) max-w-(--button-width) overflow-auto rounded-2xl border border-secondary-light/80 bg-surface shadow-xl ring-1 ring-black/5",
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

function TriggerIcon({
  icon,
  size,
  className,
}: {
  icon: ReactNode;
  size: SelectDropdownSize;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 text-muted [&>svg]:size-full",
        iconSizeClasses[size],
        className,
      )}
      aria-hidden
    >
      {icon}
    </span>
  );
}

function buildOptions(
  placeholder: string,
  options: SelectDropdownOption[],
): SelectDropdownOption[] {
  return [
    { value: SELECT_DROPDOWN_EMPTY_VALUE, label: placeholder },
    ...options,
  ];
}

export function SelectDropdown({
  options,
  variant = "outline",
  size = "md",
  placeholder,
  includePlaceholderOption = true,
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
  iconStart,
  iconClassName,
  triggerClassName,
  triggerLabelClassName,
  panelClassName,
  optionClassName,
  className,
  name,
  id: idProp,
  disabled = false,
  autoFocus = false,
  listboxModal = true,
  "aria-label": ariaLabel,
}: SelectDropdownProps) {
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
    () =>
      includePlaceholderOption
        ? buildOptions(placeholder, options)
        : options,
    [includePlaceholderOption, placeholder, options],
  );

  const [uncontrolledValue, setUncontrolledValue] = useState(
    () => defaultValue ?? SELECT_DROPDOWN_EMPTY_VALUE,
  );
  const isControlled = value !== undefined;
  const currentValue = isControlled
    ? value
    : uncontrolledValue;

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
    selectedOption.value !== SELECT_DROPDOWN_EMPTY_VALUE;

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
        <div className="relative isolate z-[1]">
          <ListboxButton
            id={selectId}
            autoFocus={autoFocus}
            aria-invalid={hasError || undefined}
            aria-describedby={describedBy}
            onBlur={onBlur}
            className={cn(
              triggerBaseClasses,
              triggerSizeClasses[size],
              triggerVariantClasses[variant],
              isRtl ? "text-end" : "text-left",
              hasError &&
                "border-danger hover:border-danger focus-visible:border-danger focus-visible:ring-danger/20",
              triggerClassName,
            )}
          >
            {iconStart != null && (
              <TriggerIcon
                icon={iconStart}
                size={size}
                className={iconClassName}
              />
            )}
            <span
              className={cn(
                "min-w-0 flex-1 truncate",
                isRtl ? "text-end" : "text-left",
                hasSelection
                  ? cn("font-medium text-text", triggerLabelClassName)
                  : cn("font-normal text-muted", triggerLabelClassName),
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
            modal={listboxModal}
            portal
            transition
            className={cn(panelClasses, "[--anchor-gap:0.5rem]", panelClassName)}
          >
            <div className="py-1">
              {allOptions.map((option) => (
                <ListboxOption
                  key={option.value === "" ? "__placeholder__" : option.value}
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
  SelectDropdownOption,
  SelectDropdownProps,
  SelectDropdownSize,
  SelectDropdownVariant,
} from "./types";
export {
  SELECT_DROPDOWN_EMPTY_VALUE,
  SELECT_DROPDOWN_SIZES,
  SELECT_DROPDOWN_VARIANTS,
} from "./types";

