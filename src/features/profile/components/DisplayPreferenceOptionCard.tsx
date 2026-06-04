"use client";

import { cn } from "@/src/lib/cn";

export type DisplayPreferenceOptionCardProps = {
  code: string;
  name: string;
  symbol: string;
  selected: boolean;
  disabled?: boolean;
  onSelect: () => void;
  ariaLabel: string;
};

export function DisplayPreferenceOptionCard({
  code,
  name,
  symbol,
  selected,
  disabled = false,
  onSelect,
  ariaLabel,
}: DisplayPreferenceOptionCardProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onSelect}
      className={cn(
        "flex w-full min-w-0 items-center gap-3 rounded-xl border p-3 text-start transition-colors",
        "outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
        selected
          ? "border-primary bg-primary-light/50 dark:border-primary dark:bg-primary/15"
          : "border-secondary/15 bg-surface hover:border-secondary/30",
        disabled && "pointer-events-none opacity-60",
      )}
    >
      <span
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-lg text-base font-semibold",
          selected
            ? "bg-primary-light text-primary-dark dark:bg-primary/20 dark:text-primary"
            : "bg-black/5 text-black/70 dark:bg-white/5 dark:text-white/70",
        )}
        aria-hidden
      >
        {symbol}
      </span>
      <span className="min-w-0 flex-1">
        <span
          className={cn(
            "block text-sm font-semibold",
            selected ? "text-primary-dark dark:text-primary" : "text-text",
          )}
        >
          {code}
        </span>
        <span
          className={cn(
            "mt-0.5 block text-xs",
            selected ? "text-primary dark:text-primary" : "text-muted",
          )}
        >
          {name}
        </span>
      </span>
      <span
        className={cn(
          "flex size-5 shrink-0 items-center justify-center rounded-full border-2",
          selected ? "border-primary" : "border-secondary/20",
        )}
        aria-hidden
      >
        {selected ? <span className="size-2.5 rounded-full bg-primary" /> : null}
      </span>
    </button>
  );
}
