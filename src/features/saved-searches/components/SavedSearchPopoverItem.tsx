"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/src/lib/cn";
import { SAVED_SEARCH_POPOVER_MAX_VISIBLE_FILTERS } from "../constants/savedSearch.constants";
import type { SavedSearchRecord } from "../types/savedSearch.types";
import { buildSavedSearchCriteriaFilterItems } from "../utils/buildSavedSearchCriteriaFilterItems";
import { SavedSearchFilterChips } from "./SavedSearchFilterChips";

type SavedSearchPopoverItemProps = {
  record: SavedSearchRecord;
  onSelect: (record: SavedSearchRecord) => void;
};

export function SavedSearchPopoverItem({
  record,
  onSelect,
}: SavedSearchPopoverItemProps) {
  const t = useTranslations("savedSearches");

  const filterItems = useMemo(
    () => buildSavedSearchCriteriaFilterItems(record.search_criteria, t),
    [record.search_criteria, t],
  );

  return (
    <button
      type="button"
      className={cn(
        "flex w-full flex-col gap-1 rounded-lg border border-transparent px-3 py-2.5 text-start transition-colors",
        "hover:bg-page",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40",
      )}
      onClick={() => {
        onSelect(record);
      }}
    >
      <span className="line-clamp-2 text-base font-bold text-secondary">
        {record.name}
      </span>

      <SavedSearchFilterChips
        items={filterItems}
        variant="inline"
        maxVisible={SAVED_SEARCH_POPOVER_MAX_VISIBLE_FILTERS}
      />
    </button>
  );
}
