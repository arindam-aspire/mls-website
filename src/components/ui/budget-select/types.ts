import type { FocusEvent, ReactNode } from "react";

export const BUDGET_SELECT_EMPTY_VALUE = "";

export const BUDGET_SELECT_VARIANTS = ["outline", "ghost", "clear"] as const;

export type BudgetSelectVariant = (typeof BUDGET_SELECT_VARIANTS)[number];

export const BUDGET_SELECT_SIZES = ["sm", "md", "lg"] as const;

export type BudgetSelectSize = (typeof BUDGET_SELECT_SIZES)[number];

export type BudgetSelectOption = {
  value: string;
  label: string;
  min?: number;
  max?: number;
  disabled?: boolean;
};

export interface BudgetSelectProps {
  options: BudgetSelectOption[];
  variant?: BudgetSelectVariant;
  size?: BudgetSelectSize;
  placeholder: string;
  currencyLabel?: string;
  label?: ReactNode;
  labelClassName?: string;
  error?: string;
  hint?: string;
  isRequired?: boolean;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onBlur?: (event: FocusEvent<HTMLButtonElement>) => void;
  fullWidth?: boolean;
  wrapperClassName?: string;
  triggerClassName?: string;
  panelClassName?: string;
  optionClassName?: string;
  currencyClassName?: string;
  className?: string;
  id?: string;
  name?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  "aria-label"?: string;
}
