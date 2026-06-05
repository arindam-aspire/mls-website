"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/src/lib/cn";
import type { SaveSearchFilterItem } from "../types/savedSearch.types";
import { partitionSaveSearchFilterItems } from "../utils/saveSearchAmenityFilterItems";

type SaveSearchFiltersSummaryProps = {
  items: SaveSearchFilterItem[];
  heading: string;
  emptyMessage: string;
};

function FilterChip({
  item,
  className,
}: {
  item: SaveSearchFilterItem;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex max-w-full min-w-0 items-center gap-1.5 rounded-lg",
        "border border-secondary/15 bg-surface px-3 py-1.5 text-sm text-text",
        className,
      )}
      aria-label={`${item.label}: ${item.value}`}
    >
      <span className="shrink-0 text-xs font-medium text-muted">{item.label}</span>
      <span className="min-w-0 truncate font-medium">{item.value}</span>
    </span>
  );
}

function AmenityChip({
  item,
  className,
}: {
  item: SaveSearchFilterItem;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex max-w-full min-w-0 rounded-lg",
        "border border-secondary/15 bg-surface px-3 py-1.5 text-sm font-medium text-text",
        className,
      )}
      aria-label={item.value}
    >
      <span className="min-w-0 truncate">{item.value}</span>
    </span>
  );
}

export function SaveSearchFiltersSummary({
  items,
  heading,
  emptyMessage,
}: SaveSearchFiltersSummaryProps) {
  const t = useTranslations("savedSearches");
  const { standardItems, amenityItems } = useMemo(
    () => partitionSaveSearchFilterItems(items),
    [items],
  );
  const hasFilters = standardItems.length > 0 || amenityItems.length > 0;

  return (
    <section className="min-w-0" aria-label={heading}>
      <h3 className="text-sm font-semibold text-text">{heading}</h3>

      {!hasFilters ? (
        <p className="mt-3 text-sm text-muted">{emptyMessage}</p>
      ) : (
        <div className="mt-3 flex flex-col gap-4">
          {standardItems.length > 0 ? (
            <ul className="flex flex-wrap gap-2">
              {standardItems.map((item) => (
                <li key={item.key}>
                  <FilterChip item={item} />
                </li>
              ))}
            </ul>
          ) : null}

          {amenityItems.length > 0 ? (
            <section aria-label={t("filterLabels.amenities")}>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-muted">
                {t("filterLabels.amenities")}
              </h4>
              <ul className="mt-2 flex flex-wrap gap-2">
                {amenityItems.map((item) => (
                  <li key={item.key}>
                    <AmenityChip item={item} />
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      )}
    </section>
  );
}
