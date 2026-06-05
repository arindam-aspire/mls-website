"use client";

import { cn } from "@/src/lib/cn";
import type { SaveSearchFilterItem } from "../types/savedSearch.types";

type SaveSearchFiltersSummaryProps = {
  items: SaveSearchFilterItem[];
  heading: string;
  emptyMessage: string;
};

export function SaveSearchFiltersSummary({
  items,
  heading,
  emptyMessage,
}: SaveSearchFiltersSummaryProps) {
  return (
    <section className="min-w-0" aria-label={heading}>
      <h3 className="text-sm font-semibold text-text">{heading}</h3>

      {items.length === 0 ? (
        <p className="mt-3 text-sm text-muted">{emptyMessage}</p>
      ) : (
        <ul className="mt-3 flex flex-wrap gap-2">
          {items.map((item) => (
            <li key={item.key}>
              <span
                className={cn(
                  "inline-flex max-w-full min-w-0 items-center gap-1.5 rounded-lg",
                  "border border-secondary/15 bg-surface px-3 py-1.5 text-sm text-text",
                )}
                aria-label={`${item.label}: ${item.value}`}
              >
                <span className="shrink-0 text-xs font-medium text-muted">
                  {item.label}
                </span>
                <span className="min-w-0 truncate font-medium">{item.value}</span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
