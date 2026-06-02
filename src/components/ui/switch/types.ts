import type { ReactNode } from "react";

export const SWITCH_COLORS = ["primary", "secondary"] as const;

export type SwitchColor = (typeof SWITCH_COLORS)[number];

export const SWITCH_SIZES = ["sm", "md"] as const;

export type SwitchSize = (typeof SWITCH_SIZES)[number];

export interface SwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  color?: SwitchColor;
  size?: SwitchSize;
  className?: string;
  id?: string;
  name?: string;
  "aria-label"?: string;
}

export interface SettingFieldProps {
  icon?: ReactNode;
  iconClassName?: string;
  title: ReactNode;
  description?: ReactNode;
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  controlClassName?: string;
  children: ReactNode;
}

export interface SwitchFieldProps {
  icon?: ReactNode;
  iconClassName?: string;
  title: ReactNode;
  description?: ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  switchClassName?: string;
  color?: SwitchColor;
  size?: SwitchSize;
  id?: string;
  "aria-label"?: string;
}
