"use client";

import { ChevronRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/src/lib/cn";

export interface AccountTypeCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
}

export function AccountTypeCard({
  icon: Icon,
  title,
  description,
  className,
  disabled = false,
  onClick,
}: AccountTypeCardProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex w-full min-w-0 items-center gap-3 rounded-xl border border-secondary/15 bg-surface p-4 text-start transition-colors",
        "hover:bg-page focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
    >
      <span
        className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary-light"
        aria-hidden
      >
        <Icon className="size-6 text-primary-dark" strokeWidth={1.75} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-bold text-text">{title}</span>
        <span className="mt-0.5 block text-sm text-muted">{description}</span>
      </span>
      <ChevronRight
        className="size-5 shrink-0 text-muted"
        aria-hidden
      />
    </button>
  );
}

