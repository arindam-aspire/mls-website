"use client";

import { Field, Label } from "@headlessui/react";
import { ChevronDown, Phone, Search } from "lucide-react";
import { useLocale } from "next-intl";
import {
  forwardRef,
  useId,
  useMemo,
  useState,
  type ChangeEvent,
} from "react";
import { cn } from "@/lib/cn";
import { isRtlLocale } from "@/src/i18n/routing";
import { Popover, PopoverButton, PopoverPanel } from "../popover";
import {
  countryFlagUrl,
  DEFAULT_PHONE_INPUT_COUNTRY_CODE,
  getPhoneInputCountryByCode,
  PHONE_INPUT_COUNTRIES,
  type PhoneInputCountry,
} from "./countries";
import type { PhoneInputProps } from "./types";

function sanitizeNationalNumber(value: string): string {
  return value.replace(/\D/g, "");
}

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  function PhoneInput(
    {
      label,
      labelClassName,
      error,
      hint,
      isRequired = false,
      fullWidth = true,
      className,
      wrapperClassName,
      countryCode: countryCodeProp,
      defaultCountryCode = DEFAULT_PHONE_INPUT_COUNTRY_CODE,
      nationalNumber: nationalNumberProp,
      defaultNationalNumber = "",
      onCountryChange,
      onNationalNumberChange,
      onChange,
      searchPlaceholder = "Search country…",
      emptySearchLabel = "No matches",
      showPhoneIcon = true,
      countrySegmentClassName,
      dir: dirProp,
      disabled,
      placeholder = "Enter phone number",
      name,
      id: idProp,
      onBlur,
      onFocus,
      "aria-label": ariaLabel,
      ...rest
    },
    ref,
  ) {
    const locale = useLocale();
    const isRtl = dirProp === "rtl" || (dirProp == null && isRtlLocale(locale));
    const generatedId = useId();
    const inputId = idProp ?? generatedId;
    const errorId = `${inputId}-error`;
    const hintId = `${inputId}-hint`;
    const hasError = Boolean(error);

    const [internalCountryCode, setInternalCountryCode] = useState(
      defaultCountryCode,
    );
    const [internalNationalNumber, setInternalNationalNumber] = useState(
      defaultNationalNumber,
    );
    const [searchQuery, setSearchQuery] = useState("");

    const countryCode = countryCodeProp ?? internalCountryCode;
    const nationalNumber = nationalNumberProp ?? internalNationalNumber;

    const selectedCountry =
      getPhoneInputCountryByCode(countryCode) ??
      getPhoneInputCountryByCode(DEFAULT_PHONE_INPUT_COUNTRY_CODE)!;

    const filteredCountries = useMemo(() => {
      const query = searchQuery.trim().toLowerCase();
      if (!query) {
        return PHONE_INPUT_COUNTRIES;
      }

      return PHONE_INPUT_COUNTRIES.filter(
        (country) =>
          country.name.toLowerCase().includes(query) ||
          country.dialCode.includes(query) ||
          country.iso2.toLowerCase().includes(query),
      );
    }, [searchQuery]);

    const emitChange = (country: PhoneInputCountry, nextNational: string) => {
      onChange?.({ country, nationalNumber: nextNational });
    };

    const handleCountrySelect = (country: PhoneInputCountry) => {
      if (countryCodeProp == null) {
        setInternalCountryCode(country.iso2);
      }
      onCountryChange?.(country);
      emitChange(country, nationalNumber);
      setSearchQuery("");
    };

    const handleNationalChange = (event: ChangeEvent<HTMLInputElement>) => {
      const nextNational = sanitizeNationalNumber(event.target.value);

      if (nationalNumberProp == null) {
        setInternalNationalNumber(nextNational);
      }

      onNationalNumberChange?.(nextNational);
      emitChange(selectedCountry, nextNational);
    };

    const describedBy =
      [hasError ? errorId : null, !hasError && hint ? hintId : null]
        .filter(Boolean)
        .join(" ") || undefined;

    return (
      <Field
        disabled={disabled}
        dir={isRtl ? "rtl" : "ltr"}
        className={cn(fullWidth && "w-full", wrapperClassName, className)}
      >
        {label != null && (
          <Label
            htmlFor={inputId}
            className={cn(
              "mb-1.5 block text-sm font-medium text-text",
              labelClassName,
            )}
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
            "relative flex h-12 w-full items-center gap-2 rounded-[0.7rem] border bg-surface px-3 transition-colors",
            "focus-within:outline-none",
            disabled && "cursor-not-allowed bg-page opacity-50",
            hasError
              ? "border-danger focus-within:border-danger focus-within:ring-2 focus-within:ring-danger/20"
              : "border-secondary-light focus-within:border-secondary-dark",
          )}
        >
          <div
            className={cn(
              "flex shrink-0 items-center gap-2",
              countrySegmentClassName,
            )}
          >
          <Popover className="relative shrink-0">
            <PopoverButton
              type="button"
              disabled={disabled}
              aria-label={`${selectedCountry.name}, ${selectedCountry.dialCode}`}
              className={cn(
                "inline-flex min-w-12 items-center gap-1 border-0 bg-transparent p-0 shadow-none outline-none",
                "focus:outline-none focus-visible:outline-none",
                "data-open:[&_.phone-input-chevron]:rotate-180",
                disabled && "cursor-not-allowed",
              )}
            >
              <img
                src={countryFlagUrl(selectedCountry.iso2)}
                alt=""
                width={40}
                height={28}
                className="h-7 w-10 shrink-0 rounded-sm object-cover"
              />
              <ChevronDown
                className="phone-input-chevron size-4 shrink-0 text-muted transition-transform duration-100"
                aria-hidden
              />
            </PopoverButton>

            <PopoverPanel
              anchor={isRtl ? "bottom end" : "bottom start"}
              className={cn(
                "z-[100] w-[min(22rem,calc(100vw-1.5rem))] overflow-hidden rounded-xl border border-secondary/20 bg-surface p-0 shadow-lg",
                "transition duration-100 data-closed:scale-95 data-closed:opacity-0",
              )}
            >
              <div className="border-b border-secondary/15 p-2">
                <div className="relative">
                  <Search
                    className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted"
                    aria-hidden
                  />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={searchPlaceholder}
                    className={cn(
                      "h-9 w-full rounded-lg border border-secondary-light bg-page py-0 ps-9 pe-3 text-sm text-text outline-none",
                      "placeholder:text-muted focus:border-secondary-dark focus:outline-none",
                    )}
                  />
                </div>
              </div>

              <ul
                className="max-h-64 overflow-y-auto py-1"
                role="listbox"
                aria-label={searchPlaceholder}
              >
                {filteredCountries.length === 0 ? (
                  <li className="px-3 py-6 text-center text-sm text-muted">
                    {emptySearchLabel}
                  </li>
                ) : (
                  filteredCountries.map((country) => {
                    const isSelected =
                      country.iso2 === selectedCountry.iso2;

                    return (
                      <li key={country.iso2}>
                        <button
                          type="button"
                          role="option"
                          aria-selected={isSelected}
                          onClick={() => handleCountrySelect(country)}
                          className={cn(
                            "flex w-full items-center gap-2 px-3 py-2 text-start text-sm text-text transition-colors",
                            "hover:bg-page focus:bg-page focus:outline-none",
                            isSelected && "bg-primary-light",
                          )}
                        >
                          <img
                            src={countryFlagUrl(country.iso2)}
                            alt=""
                            width={28}
                            height={20}
                            className="h-5 w-7 shrink-0 rounded-sm object-cover"
                          />
                          <span className="min-w-0 flex-1 truncate">
                            {country.name}
                          </span>
                          <span className="shrink-0 tabular-nums text-muted">
                            {country.dialCode}
                          </span>
                        </button>
                      </li>
                    );
                  })
                )}
              </ul>
            </PopoverPanel>
          </Popover>
          </div>

          <div className="h-6 w-px shrink-0 bg-secondary-light" aria-hidden />

          <input
            ref={ref}
            id={inputId}
            name={name}
            type="tel"
            inputMode="numeric"
            disabled={disabled}
            value={nationalNumber}
            onChange={handleNationalChange}
            onBlur={onBlur}
            onFocus={onFocus}
            placeholder={placeholder}
            aria-label={label == null ? ariaLabel : undefined}
            aria-required={isRequired || undefined}
            aria-invalid={hasError || undefined}
            aria-describedby={describedBy}
            className={cn(
              "min-w-0 flex-1 border-0 bg-transparent py-0 text-sm text-text outline-none",
              "placeholder:font-normal placeholder:text-muted",
              showPhoneIcon && "pe-8",
              disabled && "cursor-not-allowed",
            )}
            {...rest}
          />

          {showPhoneIcon && (
            <Phone
              className="pointer-events-none absolute end-3 top-1/2 size-5 -translate-y-1/2 text-muted"
              aria-hidden
            />
          )}
        </div>

        {hasError && (
          <p
            id={errorId}
            role="alert"
            className="mt-1.5 text-sm text-danger"
          >
            {error}
          </p>
        )}

        {!hasError && hint != null && (
          <p id={hintId} className="mt-1.5 text-sm text-muted">
            {hint}
          </p>
        )}
      </Field>
    );
  },
);

export type { PhoneInputProps } from "./types";
export {
  countryFlagUrl,
  DEFAULT_PHONE_INPUT_COUNTRY_CODE,
  getPhoneInputCountryByCode,
  PHONE_INPUT_COUNTRIES,
  type PhoneInputCountry,
} from "./countries";
