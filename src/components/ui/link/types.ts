import type { MouseEventHandler, ReactNode } from "react";

export const LINK_COLORS = [
  "primary",
  "secondary",
  "tertiary",
  "muted",
  "inherit",
  "danger",
  "success",
] as const;

export type LinkColor = (typeof LINK_COLORS)[number];

export const LINK_VARIANTS = ["default", "subtle"] as const;

export type LinkVariant = (typeof LINK_VARIANTS)[number];

export const LINK_SIZES = ["sm", "md", "lg"] as const;

export type LinkSize = (typeof LINK_SIZES)[number];

export interface LinkProps {
  color?: LinkColor;
  variant?: LinkVariant;
  size?: LinkSize;
  /** When true, underline is always visible; when false, only on hover. Default: true. */
  alwaysUnderline?: boolean;
  children: ReactNode;
  iconStart?: ReactNode;
  iconEnd?: ReactNode;
  disabled?: boolean;
  className?: string;
  id?: string;
  type?: "button" | "submit" | "reset";
  onClick?: MouseEventHandler<HTMLButtonElement>;
  "aria-label"?: string;
}
