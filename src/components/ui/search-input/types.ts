import type { ReactNode } from "react";
import type { InputHTMLAttributes } from "react";
import type { InputSize, InputVariant } from "../input/types";

export type SearchInputSize = InputSize;
export type SearchInputVariant = InputVariant;

export { INPUT_SIZES as SEARCH_INPUT_SIZES, INPUT_VARIANTS as SEARCH_INPUT_VARIANTS } from "../input/types";

export interface SearchInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  variant?: SearchInputVariant;
  size?: SearchInputSize;
  label?: ReactNode;
  labelClassName?: string;
  error?: string;
  hint?: string;
  isRequired?: boolean;
  placeholder: string;
  /** Required when `label` is not set. */
  "aria-label"?: string;
  /** Accessible label for the clear control (i18n). */
  clearLabel: string;
  fullWidth?: boolean;
  wrapperClassName?: string;
  /** Classes merged onto the inner control row (icons + input). */
  controlClassName?: string;
  inputClassName?: string;
  iconClassName?: string;
  /** Fired after the value is cleared (in addition to `onChange` when applicable). */
  onClear?: () => void;
}
