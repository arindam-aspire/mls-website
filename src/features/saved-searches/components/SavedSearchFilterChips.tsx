"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/src/lib/cn";
import type { SaveSearchFilterItem } from "../types/savedSearch.types";
import {
  groupConsecutiveAmenityItemsForInline,
  isCombinedAmenityDisplayItem,
  partitionSaveSearchFilterItems,
} from "../utils/saveSearchAmenityFilterItems";

const DEFAULT_MAX_VISIBLE = 4;

type SavedSearchFilterChipsProps = {
  items: SaveSearchFilterItem[];
  className?: string;
  /** Chip list for forms; inline shows values with +N overflow. */
  variant?: "chips" | "inline";
  maxVisible?: number;
};

function renderInlineItems(
  visibleItems: SaveSearchFilterItem[],
  restCount: number,
  moreFiltersLabel: string,
) {
  return (
    <>
      {visibleItems.map((item, index) => (
        <span key={item.key}>
          {index > 0 ? <span className="text-muted" aria-hidden> · </span> : null}
          {isCombinedAmenityDisplayItem(item) ? (
            <span className="font-medium text-text">{item.value}</span>
          ) : (
            <>
              <span className="text-muted">{item.label}:</span>{" "}
              <span className="font-medium text-text">{item.value}</span>
            </>
          )}
        </span>
      ))}
      {restCount > 0 ? (
        <span className="font-medium text-primary-dark">
          <span className="text-muted" aria-hidden> · </span>
          {moreFiltersLabel}
        </span>
      ) : null}
    </>
  );
}

export function SavedSearchFilterChips({
  items,
  className,
  variant = "chips",
  maxVisible = DEFAULT_MAX_VISIBLE,
}: SavedSearchFilterChipsProps) {
  const t = useTranslations("savedSearches");
  const { standardItems, amenityItems } = useMemo(
    () => partitionSaveSearchFilterItems(items),
    [items],
  );

  if (items.length === 0) {
    return null;
  }

  if (variant === "inline") {
    const visibleItems = items.slice(0, maxVisible);
    const restCount = items.length - visibleItems.length;
    const displaySegments = groupConsecutiveAmenityItemsForInline(visibleItems);
    const ariaLabel = items
      .map((item) => `${item.label}: ${item.value}`)
      .join(", ");

    return (
      <p
        className={cn("text-xs leading-relaxed", className)}
        aria-label={ariaLabel}
      >
        {renderInlineItems(
          displaySegments,
          restCount,
          t("moreFilters", { count: restCount }),
        )}
      </p>
    );
  }

  return (
    <ul className={cn("flex flex-wrap gap-1.5", className)}>
      {standardItems.map((item) => (
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

      {amenityItems.map((item) => (
        <li key={item.key}>
          <span
            className={cn(
              "inline-flex max-w-full min-w-0 rounded-lg",
              "border border-secondary/15 bg-page px-2 py-0.5 text-xs font-medium text-text",
            )}
            aria-label={item.value}
          >
            <span className="min-w-0 truncate">{item.value}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}
