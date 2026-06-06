"use client";

import { Field, Label } from "@headlessui/react";
import { useId, useMemo, useState } from "react";
import {
  inheritOutlineFocusWithinClasses,
  inheritOutlineVariantClasses,
} from "@/src/components/ui/fieldVariants";
import {
  fieldControlSizeClasses,
  fieldLabelSizeClasses,
} from "@/src/components/ui/responsiveSizes";
import { cn } from "@/src/lib/cn";
import { BudgetSuggestionList } from "./BudgetSuggestionList";
import {
  BUY_BUDGET_SUGGESTIONS,
  RENT_BUDGET_SUGGESTIONS,
  filterBudgetSuggestionsByQuery,
  filterMaxSuggestions,
  filterMinSuggestions,
  handleMaxChange,
  handleMinChange,
  preventNegativeInput,
} from "./budget.utils";
import type { BudgetAutocompleteFieldProps } from "./types";

const inputClasses = cn(
  "min-w-0 flex-1 border-0 bg-transparent p-0 font-normal text-text shadow-none outline-none",
  "placeholder:font-normal placeholder:text-muted disabled:cursor-not-allowed",
);

export function BudgetAutocompleteField({
  label,
  value,
  onChange,
  onCommit,
  mode,
  peerValue = "",
  rentMode = false,
  suggestions,
  placeholder,
  disabled = false,
  className,
  size = "md",
  "aria-label": ariaLabel,
}: BudgetAutocompleteFieldProps) {
  const inputId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const resolvedSuggestions =
    suggestions ?? (rentMode ? RENT_BUDGET_SUGGESTIONS : BUY_BUDGET_SUGGESTIONS);
  const resolvedPlaceholder =
    placeholder ?? (mode === "max" ? (rentMode ? "5000" : "400000") : "0");

  const visibleSuggestions = useMemo(() => {
    const bounded =
      mode === "min"
        ? filterMinSuggestions(resolvedSuggestions, peerValue)
        : filterMaxSuggestions(resolvedSuggestions, peerValue);

    return filterBudgetSuggestionsByQuery(bounded, value);
  }, [mode, peerValue, resolvedSuggestions, value]);

  const handleChange = (nextValue: string) => {
    if (mode === "min") {
      handleMinChange(nextValue, peerValue, onChange);
      return;
    }

    handleMaxChange(nextValue, peerValue, onChange);
  };

  const handleBlur = () => {
    window.setTimeout(() => {
      setIsOpen(false);
      onCommit?.();
    }, 0);
  };

  return (
    <Field
      disabled={disabled}
      className={cn("relative min-w-0 w-full", className)}
    >
      <Label htmlFor={inputId} className={fieldLabelSizeClasses}>
        {label}
      </Label>

      <div
        className={cn(
          "flex w-full items-center rounded-lg text-text transition-colors outline-none",
          fieldControlSizeClasses[size],
          inheritOutlineVariantClasses,
          inheritOutlineFocusWithinClasses,
          isOpen && "border-secondary ring-2 ring-secondary/20",
          "has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50",
        )}
      >
        <input
          id={inputId}
          type="text"
          inputMode="numeric"
          min={0}
          value={value}
          placeholder={resolvedPlaceholder}
          aria-label={ariaLabel ?? label}
          disabled={disabled}
          className={inputClasses}
          onFocus={() => {
            setIsOpen(true);
          }}
          onBlur={handleBlur}
          onKeyDown={(event) => {
            preventNegativeInput(event);

            if (event.key === "Enter") {
              setIsOpen(false);
              onCommit?.();
            }
          }}
          onChange={(event) => {
            handleChange(event.target.value);
            setIsOpen(true);
          }}
        />
      </div>

      {isOpen && !disabled ? (
        <BudgetSuggestionList
          values={visibleSuggestions}
          selectedValue={value}
          onSelect={(nextValue) => {
            onChange(nextValue);
            setIsOpen(false);
            onCommit?.();
          }}
        />
      ) : null}
    </Field>
  );
}
