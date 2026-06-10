import type { LucideIcon } from "lucide-react";

export type BreadcrumbItem = {
  id: string;
  label?: string;
  href?: string;
  icon?: LucideIcon;
  isCurrent?: boolean;
  /** Accessible name when the item has no visible label (e.g. icon-only home). */
  ariaLabel?: string;
};

export type BreadcrumbProps = {
  items: BreadcrumbItem[];
  ariaLabel: string;
  className?: string;
};
