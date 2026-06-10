import type { ReactNode } from "react";

export const CHECKBOX_COLORS = ["primary", "secondary"] as const;

export type CheckboxColor = (typeof CHECKBOX_COLORS)[number];

export const CHECKBOX_SIZES = ["sm", "md"] as const;

export type CheckboxSize = (typeof CHECKBOX_SIZES)[number];

export interface CheckboxProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  color?: CheckboxColor;
  size?: CheckboxSize;
  className?: string;
  id?: string;
  name?: string;
  "aria-label"?: string;
}

export interface CheckboxFieldProps {
  label: ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  color?: CheckboxColor;
  size?: CheckboxSize;
  className?: string;
  labelClassName?: string;
  checkboxClassName?: string;
  id?: string;
  name?: string;
}
