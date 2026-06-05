"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/src/lib/cn";
import type { SaveSearchFilterItem } from "../types/savedSearch.types";

const DEFAULT_MAX_VISIBLE = 4;

type SavedSearchFilterChipsProps = {
  items: SaveSearchFilterItem[];
  className?: string;
  /** Chip list for forms; inline shows values with +N overflow. */
  variant?: "chips" | "inline";
  maxVisible?: number;
};

export function SavedSearchFilterChips({
  items,
  className,
  variant = "chips",
  maxVisible = DEFAULT_MAX_VISIBLE,
}: SavedSearchFilterChipsProps) {
  const t = useTranslations("savedSearches");

  if (items.length === 0) {
    return null;
  }

  if (variant === "inline") {
    const visibleItems = items.slice(0, maxVisible);
    const restCount = items.length - visibleItems.length;

    return (
      <p
        className={cn("text-xs leading-relaxed", className)}
        aria-label={items.map((item) => `${item.label}: ${item.value}`).join(", ")}
      >
        {visibleItems.map((item, index) => (
          <span key={item.key}>
            {index > 0 ? <span className="text-muted" aria-hidden> · </span> : null}
            <span className="text-muted">{item.label}:</span>{" "}
            <span className="font-medium text-text">{item.value}</span>
          </span>
        ))}
        {restCount > 0 ? (
          <span className="font-medium text-primary-dark">
            <span className="text-muted" aria-hidden> · </span>
            {t("moreFilters", { count: restCount })}
          </span>
        ) : null}
      </p>
    );
  }

  return (
    <ul className={cn("flex flex-wrap gap-1.5", className)}>
      {items.map((item) => (
        <li key={item.key}>
          <span
            className={cn(
              "inline-flex max-w-full min-w-0 items-center gap-1 rounded-lg",
              "border border-secondary/15 bg-page px-2 py-0.5 text-xs text-text",
            )}
            aria-label={`${item.label}: ${item.value}`}
          >
            <span className="shrink-0 text-muted">{item.label}</span>
            <span className="min-w-0 truncate font-medium">{item.value}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}
