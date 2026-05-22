import type { InputHTMLAttributes, ReactNode } from "react";
import type { PhoneInputCountry } from "./countries";

export interface PhoneInputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "size" | "value" | "defaultValue" | "onChange" | "type"
  > {
  label?: ReactNode;
  labelClassName?: string;
  error?: string;
  hint?: string;
  isRequired?: boolean;
  fullWidth?: boolean;
  className?: string;
  wrapperClassName?: string;
  countryCode?: string;
  defaultCountryCode?: string;
  nationalNumber?: string;
  defaultNationalNumber?: string;
  onCountryChange?: (country: PhoneInputCountry) => void;
  onNationalNumberChange?: (value: string) => void;
  onChange?: (payload: {
    country: PhoneInputCountry;
    nationalNumber: string;
  }) => void;
  searchPlaceholder?: string;
  emptySearchLabel?: string;
  showPhoneIcon?: boolean;
  countrySegmentClassName?: string;
  dir?: "ltr" | "rtl";
}
