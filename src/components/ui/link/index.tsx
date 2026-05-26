"use client";

import type { ReactNode } from "react";
import { cn } from "@/src/lib/cn";
import type { LinkColor, LinkProps, LinkSize, LinkVariant } from "./types";

const baseClasses = cn(
  "inline-flex max-w-full items-center font-medium underline-offset-2 transition-colors",
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40",
  "disabled:cursor-not-allowed disabled:opacity-50",
);

const underlineClasses = {
  always: "underline decoration-1 hover:decoration-1",
  hover: "no-underline hover:underline hover:decoration-1 decoration-1",
} as const;

const colorClasses: Record<LinkColor, Record<LinkVariant, string>> = {
  primary: {
    default:
      "text-primary-dark decoration-primary-dark/70 hover:text-primary hover:decoration-primary",
    subtle:
      "text-primary decoration-primary/50 hover:text-primary-dark hover:decoration-primary-dark",
  },
  secondary: {
    default:
      "text-secondary decoration-secondary/70 hover:text-secondary-dark hover:decoration-secondary-dark",
    subtle:
      "text-secondary decoration-secondary/50 hover:text-secondary-dark hover:decoration-secondary-dark",
  },
  tertiary: {
    default:
      "text-tertiary-dark decoration-tertiary-dark/70 hover:text-tertiary hover:decoration-tertiary",
    subtle:
      "text-tertiary-dark decoration-tertiary-dark/50 hover:text-tertiary hover:decoration-tertiary",
  },
  muted: {
    default: "text-muted decoration-muted/80 hover:text-text hover:decoration-text",
    subtle: "text-muted decoration-muted/50 hover:text-text hover:decoration-text/80",
  },
  inherit: {
    default:
      "text-inherit-color decoration-inherit-color/70 hover:opacity-90 hover:decoration-inherit-color",
    subtle:
      "text-inherit-color decoration-inherit-color/50 hover:opacity-90 hover:decoration-inherit-color",
  },
  danger: {
    default:
      "text-danger decoration-danger/70 hover:opacity-90 hover:decoration-danger",
    subtle: "text-danger decoration-danger/50 hover:opacity-90 hover:decoration-danger",
  },
  success: {
    default:
      "text-success decoration-success/70 hover:opacity-90 hover:decoration-success",
    subtle:
      "text-success decoration-success/50 hover:opacity-90 hover:decoration-success",
  },
};

const sizeClasses: Record<LinkSize, string> = {
  sm: "gap-1 text-sm",
  md: "gap-1.5 text-sm",
  lg: "gap-2 text-base",
};

const iconSizeClasses: Record<LinkSize, string> = {
  sm: "size-3.5 shrink-0",
  md: "size-4 shrink-0",
  lg: "size-[1.125rem] shrink-0",
};

function LinkIcon({ icon, size }: { icon: ReactNode; size: LinkSize }) {
  return (
    <span className={cn("inline-flex [&>svg]:size-full", iconSizeClasses[size])} aria-hidden>
      {icon}
    </span>
  );
}

export function Link({
  color = "primary",
  variant = "default",
  size = "md",
  alwaysUnderline = true,
  children,
  iconStart,
  iconEnd,
  disabled = false,
  className,
  id,
  type = "button",
  onClick,
  "aria-label": ariaLabel,
}: LinkProps) {
  return (
    <button
      id={id}
      type={type}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-disabled={disabled || undefined}
      onClick={disabled ? undefined : onClick}
      className={cn(
        baseClasses,
        alwaysUnderline ? underlineClasses.always : underlineClasses.hover,
        sizeClasses[size],
        colorClasses[color][variant],
        className,
      )}
    >
      {iconStart != null && <LinkIcon icon={iconStart} size={size} />}
      <span className="truncate">{children}</span>
      {iconEnd != null && <LinkIcon icon={iconEnd} size={size} />}
    </button>
  );
}

export { LINK_COLORS, LINK_SIZES, LINK_VARIANTS } from "./types";
export type { LinkColor, LinkProps, LinkSize, LinkVariant } from "./types";

