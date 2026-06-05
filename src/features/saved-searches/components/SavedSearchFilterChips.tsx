"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/src/lib/cn";
import type { SaveSearchFilterItem } from "../types/savedSearch.types";
import { partitionSaveSearchFilterItems } from "../utils/saveSearchAmenityFilterItems";

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
          <span className="text-muted">{item.label}:</span>{" "}
          <span className="font-medium text-text">{item.value}</span>
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
    const visibleStandard = standardItems.slice(0, maxVisible);
    const restStandard = standardItems.length - visibleStandard.length;

    const ariaLabel = [
      ...standardItems.map((item) => `${item.label}: ${item.value}`),
      ...(amenityItems.length > 0
        ? [
            `${t("filterLabels.amenities")}: ${amenityItems.map((item) => item.value).join(", ")}`,
          ]
        : []),
    ].join(", ");

    return (
      <div className={cn("flex flex-col gap-1", className)} aria-label={ariaLabel}>
        {visibleStandard.length > 0 || restStandard > 0 ? (
          <p className="text-xs leading-relaxed">
            {renderInlineItems(
              visibleStandard,
              restStandard,
              t("moreFilters", { count: restStandard }),
            )}
          </p>
        ) : null}

        {amenityItems.length > 0 ? (
          <p className="text-xs leading-relaxed">
            <span className="text-muted">{t("filterLabels.amenities")}:</span>{" "}
            {amenityItems.map((item, index) => (
              <span key={item.key}>
                {index > 0 ? <span className="text-muted" aria-hidden> · </span> : null}
                <span className="font-medium text-text">{item.value}</span>
              </span>
            ))}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {standardItems.length > 0 ? (
        <ul className="flex flex-wrap gap-1.5">
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
        </ul>
      ) : null}

      {amenityItems.length > 0 ? (
        <section aria-label={t("filterLabels.amenities")}>
          <p className="text-[0.6875rem] font-semibold uppercase tracking-wide text-muted">
            {t("filterLabels.amenities")}
          </p>
          <ul className="mt-1.5 flex flex-wrap gap-1.5">
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
        </section>
      ) : null}
    </div>
  );
}
