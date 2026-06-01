import type { FocusEvent, KeyboardEvent, ReactNode } from "react";

export const AUTOCOMPLETE_INPUT_VARIANTS = ["outline", "ghost", "clear"] as const;

export type AutocompleteInputVariant =
  (typeof AUTOCOMPLETE_INPUT_VARIANTS)[number];

export const AUTOCOMPLETE_INPUT_SIZES = ["sm", "md", "lg"] as const;

export type AutocompleteInputSize = (typeof AUTOCOMPLETE_INPUT_SIZES)[number];

export type AutocompleteInputOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export interface AutocompleteInputProps {
  options: AutocompleteInputOption[];
  variant?: AutocompleteInputVariant;
  size?: AutocompleteInputSize;
  placeholder?: string;
  label?: ReactNode;
  labelClassName?: string;
  error?: string;
  hint?: string;
  isRequired?: boolean;
  value?: string;
  defaultValue?: string;
  inputValue?: string;
  onInputChange?: (value: string) => void;
  onChange?: (value: string) => void;
  onOptionSelect?: (option: AutocompleteInputOption) => void;
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
  fullWidth?: boolean;
  wrapperClassName?: string;
  inputClassName?: string;
  panelClassName?: string;
  optionClassName?: string;
  className?: string;
  id?: string;
  name?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  iconStart?: ReactNode;
  iconEnd?: ReactNode;
  iconClassName?: string;
  emptyMessage?: string;
  maxOptions?: number;
  minCharsToShow?: number;
  "aria-label"?: string;
}
