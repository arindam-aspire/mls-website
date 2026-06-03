"use client";

import { Field, Label } from "@headlessui/react";
import { Search, X } from "lucide-react";
import {
  forwardRef,
  useId,
  useState,
  type ChangeEvent,
  type ReactNode,
} from "react";
import { cn } from "@/src/lib/cn";
import {
  inheritOutlineFocusWithinClasses,
  inheritOutlineVariantClasses,
} from "../fieldVariants";
import {
  fieldControlSizeClasses,
  fieldErrorSizeClasses,
  fieldHintSizeClasses,
  fieldIconSizeClasses,
  fieldLabelSizeClasses,
} from "../responsiveSizes";
import type {
  SearchInputProps,
  SearchInputSize,
  SearchInputVariant,
} from "./types";

const wrapperSizeClasses = fieldControlSizeClasses;

const iconSizeClasses = fieldIconSizeClasses;

const variantClasses: Record<SearchInputVariant, string> = {
  outline: cn(inheritOutlineVariantClasses, inheritOutlineFocusWithinClasses),
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

const controlWrapperClasses = cn(
  "flex w-full items-center rounded-xl text-text transition-colors outline-none",
  "has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50",
);

const inputClasses = cn(
  "min-w-0 flex-1 border-0 bg-transparent p-0 font-normal text-text shadow-none outline-none",
  "placeholder:font-normal placeholder:text-muted disabled:cursor-not-allowed",
);

function SearchInputIcon({
  icon,
  size,
  className,
}: {
  icon: ReactNode;
  size: SearchInputSize;
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

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  function SearchInput(
    {
      variant = "outline",
      size = "md",
      label,
      labelClassName,
      error,
      hint,
      isRequired = false,
      placeholder,
      "aria-label": ariaLabel,
      clearLabel,
      fullWidth = true,
      className,
      wrapperClassName,
      controlClassName,
      inputClassName,
      iconClassName,
      value: valueProp,
      defaultValue,
      onChange,
      onClear,
      disabled,
      id: idProp,
      ...rest
    },
    ref,
  ) {
    const generatedId = useId();
    const inputId = idProp ?? generatedId;
    const errorId = `${inputId}-error`;
    const hintId = `${inputId}-hint`;
    const hasError = Boolean(error);

    const describedBy =
      [hasError ? errorId : null, !hasError && hint ? hintId : null]
        .filter(Boolean)
        .join(" ") || undefined;

    const [uncontrolledValue, setUncontrolledValue] = useState(
      () => (defaultValue != null ? String(defaultValue) : ""),
    );

    const isControlled = valueProp !== undefined;
    const value = isControlled ? String(valueProp ?? "") : uncontrolledValue;
    const showClear = value.length > 0 && !disabled;

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) {
        setUncontrolledValue(event.target.value);
      }
      onChange?.(event);
    };

    const handleClear = () => {
      if (!isControlled) {
        setUncontrolledValue("");
      }

      onChange?.({
        target: { value: "" },
        currentTarget: { value: "" },
      } as ChangeEvent<HTMLInputElement>);

      onClear?.();
    };

    return (
      <Field
        disabled={disabled}
        className={cn(fullWidth && "w-full", wrapperClassName, className)}
      >
        {label != null && (
          <Label
            htmlFor={inputId}
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

        <div
          className={cn(
            controlWrapperClasses,
            wrapperSizeClasses[size],
            variantClasses[variant],
            hasError &&
              "border-danger hover:border-danger focus-within:border-danger focus-within:ring-danger/20",
            controlClassName,
          )}
        >
          <SearchInputIcon
            icon={<Search />}
            size={size}
            className={iconClassName}
          />

          <input
            ref={ref}
            id={inputId}
            type="text"
            disabled={disabled}
            placeholder={placeholder}
            aria-label={label == null ? ariaLabel : undefined}
            aria-required={isRequired || undefined}
            aria-invalid={hasError || undefined}
            aria-describedby={describedBy}
            value={value}
            onChange={handleChange}
            className={cn(inputClasses, inputClassName)}
            {...rest}
          />

          {showClear ? (
            <button
              type="button"
              disabled={disabled}
              aria-label={clearLabel}
              onClick={handleClear}
              className={cn(
                "inline-flex shrink-0 items-center justify-center rounded-lg text-muted transition-colors",
                "hover:bg-page hover:text-text",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40",
                "disabled:pointer-events-none disabled:opacity-50",
                iconSizeClasses[size],
              )}
            >
              <X className="size-full" aria-hidden />
            </button>
          ) : null}
        </div>

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
  },
);

export type { SearchInputProps, SearchInputSize, SearchInputVariant } from "./types";
export { SEARCH_INPUT_SIZES, SEARCH_INPUT_VARIANTS } from "./types";
