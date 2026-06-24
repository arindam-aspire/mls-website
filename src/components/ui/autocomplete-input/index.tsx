"use client";

import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Field,
  Label,
} from "@headlessui/react";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { cn } from "@/src/lib/cn";
import {
  inheritOutlineFocusWithinClasses,
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
import { HighlightedLabel } from "./highlightLabel";
import type {
  AutocompleteInputOption,
  AutocompleteInputProps,
  AutocompleteInputSize,
  AutocompleteInputVariant,
} from "./types";

const wrapperSizeClasses = fieldControlSizeClasses;
const iconSizeClasses = fieldIconSizeClasses;

const variantClasses: Record<AutocompleteInputVariant, string> = {
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
  "flex w-full items-center rounded-lg text-text transition-colors outline-none",
  "has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50",
);

const inputClasses = cn(
  "min-w-0 flex-1 border-0 bg-transparent p-0 font-normal text-text shadow-none outline-none",
  "placeholder:font-normal placeholder:text-muted disabled:cursor-not-allowed",
);

const panelClasses = cn(
  "absolute start-0 end-0 top-[calc(100%+0.25rem)] z-[100]",
  "max-h-64 w-full min-w-full overflow-auto rounded-xl border border-secondary/15 bg-surface p-1 shadow-lg ring-1 ring-black/5",
  dropdownPanelSizeClasses,
  "[scrollbar-width:thin] empty:hidden focus:outline-none",
);

const optionClasses = cn(
  "w-full cursor-pointer rounded-lg px-3 py-2.5 text-start text-text transition-colors",
  dropdownOptionSizeClasses,
  "data-focus:bg-primary-light/60 data-hover:bg-primary-light/40",
  "data-selected:bg-primary-light data-selected:font-medium data-selected:text-primary",
  "data-disabled:cursor-not-allowed data-disabled:opacity-50",
);

const emptyPanelClasses = cn(panelClasses, "px-3 py-2.5 text-sm text-muted");

function filterOptionsByQuery(
  options: AutocompleteInputOption[],
  query: string,
  limit: number,
): AutocompleteInputOption[] {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return options.slice(0, limit);
  }

  return options
    .filter((option) => option.label.toLowerCase().includes(normalized))
    .slice(0, limit);
}

function labelsMatch(a: string, b: string) {
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

function InputIcon({
  icon,
  size,
  className,
}: {
  icon: React.ReactNode;
  size: AutocompleteInputSize;
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

export function AutocompleteInput({
  options,
  variant = "outline",
  size = "md",
  placeholder,
  label,
  labelClassName,
  error,
  hint,
  isRequired = false,
  value,
  defaultValue,
  inputValue,
  onInputChange,
  onChange,
  onOptionSelect,
  onBlur,
  onKeyDown,
  fullWidth = true,
  wrapperClassName,
  inputClassName,
  panelClassName,
  optionClassName,
  className,
  id: idProp,
  name,
  disabled = false,
  autoFocus = false,
  iconStart,
  iconEnd,
  iconClassName,
  emptyMessage = "No results",
  maxOptions = 20,
  minCharsToShow = 0,
  "aria-label": ariaLabel,
}: AutocompleteInputProps) {
  const generatedId = useId();
  const inputId = idProp ?? generatedId;
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;
  const hasError = Boolean(error);
  const rootRef = useRef<HTMLDivElement>(null);

  const [internalQuery, setInternalQuery] = useState("");
  const [selectedValue, setSelectedValue] = useState<string | null>(
    value ?? defaultValue ?? null,
  );
  const [isOpen, setIsOpen] = useState(false);

  const isInputControlled = inputValue !== undefined;
  const query = isInputControlled ? inputValue : internalQuery;

  const setQuery = useCallback(
    (nextQuery: string) => {
      if (!isInputControlled) {
        setInternalQuery(nextQuery);
      }
      onInputChange?.(nextQuery);
    },
    [isInputControlled, onInputChange],
  );

  const describedBy =
    [hasError ? errorId : null, !hasError && hint ? hintId : null]
      .filter(Boolean)
      .join(" ") || undefined;

  const filteredOptions = useMemo(
    () => filterOptionsByQuery(options, query, maxOptions),
    [maxOptions, options, query],
  );

  const selectedOption = useMemo(
    () => options.find((option) => option.value === selectedValue) ?? null,
    [options, selectedValue],
  );

  const hasCommittedSelection = Boolean(
    selectedValue &&
      selectedOption &&
      labelsMatch(query, selectedOption.label),
  );

  const trimmedQuery = query.trim();
  const meetsMinChars = trimmedQuery.length >= minCharsToShow;
  const showOptionsList =
    isOpen && meetsMinChars && !hasCommittedSelection && filteredOptions.length > 0;
  const showEmptyState =
    isOpen && meetsMinChars && !hasCommittedSelection && filteredOptions.length === 0;

  const closeList = useCallback(() => {
    setIsOpen(false);
  }, []);

  const openList = useCallback(() => {
    setIsOpen(true);
  }, []);

  useEffect(() => {
    if (value === undefined) {
      return;
    }

    setSelectedValue(value || null);

    if (value) {
      closeList();
    }
  }, [closeList, value]);

  useEffect(() => {
    if (isInputControlled || value === undefined) {
      return;
    }

    const option = options.find((item) => item.value === value);
    setInternalQuery(option?.label ?? "");
  }, [isInputControlled, options, value]);

  useEffect(() => {
    if (!hasCommittedSelection) {
      return;
    }

    closeList();
  }, [closeList, hasCommittedSelection]);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        closeList();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown, true);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown, true);
    };
  }, [closeList]);

  const handleSelect = useCallback(
    (nextValue: string | null) => {
      const resolved = nextValue ?? null;
      setSelectedValue(resolved);

      const option =
        resolved != null ? options.find((item) => item.value === resolved) : null;

      if (option) {
        setQuery(option.label);
        onChange?.(option.value);
        onOptionSelect?.(option);
        closeList();
        return;
      }

      onChange?.("");
    },
    [closeList, onChange, onOptionSelect, options, setQuery],
  );

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

      <Combobox
        value={selectedValue}
        onChange={handleSelect}
        onClose={closeList}
        disabled={disabled}
      >
        <div ref={rootRef} className="relative w-full min-w-0">
          <div
            className={cn(
              controlWrapperClasses,
              wrapperSizeClasses[size],
              variantClasses[variant],
              isOpen && !hasCommittedSelection && "ring-2 ring-secondary/25",
              hasError &&
                "border-danger hover:border-danger focus-within:border-danger focus-within:ring-danger/20",
            )}
          >
            {iconStart != null && (
              <InputIcon icon={iconStart} size={size} className={iconClassName} />
            )}
            <ComboboxInput
              suppressHydrationWarning
              id={inputId}
              name={name}
              autoFocus={autoFocus}
              placeholder={placeholder}
              aria-label={label == null ? ariaLabel : undefined}
              aria-required={isRequired || undefined}
              aria-invalid={hasError || undefined}
              aria-describedby={describedBy}
              aria-expanded={showOptionsList || showEmptyState}
              aria-autocomplete="list"
              className={cn(inputClasses, inputClassName)}
              displayValue={() => query}
              onChange={(event) => {
                const nextQuery = event.target.value;
                setQuery(nextQuery);
                setSelectedValue(null);
                onChange?.("");
                openList();
              }}
              onFocus={() => {
                if (!hasCommittedSelection && meetsMinChars) {
                  openList();
                }
              }}
              onBlur={(event) => {
                closeList();
                onBlur?.(event);
              }}
              onKeyDown={(event) => {
                if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                  openList();
                }
                if (event.key === "Escape") {
                  closeList();
                }
                onKeyDown?.(event);
              }}
            />
            {iconEnd != null && (
              <InputIcon icon={iconEnd} size={size} className={iconClassName} />
            )}
          </div>

          {showOptionsList && (
            <ComboboxOptions static className={cn(panelClasses, panelClassName)}>
              {filteredOptions.map((option, index) => (
                <ComboboxOption
                  key={option.value || `${option.label}-${index}`}
                  value={option.value}
                  disabled={option.disabled}
                  className={cn(optionClasses, optionClassName)}
                >
                  <HighlightedLabel label={option.label} query={query} />
                </ComboboxOption>
              ))}
            </ComboboxOptions>
          )}

          {showEmptyState && (
            <p className={cn(emptyPanelClasses, panelClassName)} role="status">
              {emptyMessage}
            </p>
          )}
        </div>
      </Combobox>

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
  AutocompleteInputOption,
  AutocompleteInputProps,
  AutocompleteInputSize,
  AutocompleteInputVariant,
} from "./types";
export {
  AUTOCOMPLETE_INPUT_SIZES,
  AUTOCOMPLETE_INPUT_VARIANTS,
} from "./types";
