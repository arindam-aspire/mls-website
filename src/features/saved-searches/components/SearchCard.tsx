"use client";

import { Bookmark, Pencil, Play, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { ConfirmModal } from "@/src/components/common/ConfirmModal";
import { Button, Card, CardContent } from "@/src/components/ui";
import { cn } from "@/src/lib/cn";
import { bodyLargeTextClasses } from "@/src/lib/typography";
import type { SavedSearchRecord } from "../types/savedSearch.types";
import { buildSavedSearchCriteriaFilterItems } from "../utils/buildSavedSearchCriteriaFilterItems";
import { SavedSearchFilterChips } from "./SavedSearchFilterChips";

type SearchCardProps = {
  record: SavedSearchRecord;
  runLabel: string;
  editLabel: string;
  deleteLabel: string;
  onRun: (record: SavedSearchRecord) => void;
  onEdit: (record: SavedSearchRecord) => void;
  onDelete: (record: SavedSearchRecord) => void;
  isDeleting?: boolean;
  className?: string;
};

export const searchCardShellClassName =
  "w-full min-w-0 rounded-xl border border-secondary/15 shadow-none transition-colors hover:border-secondary/25";

export function SearchCard({
  record,
  runLabel,
  editLabel,
  deleteLabel,
  onRun,
  onEdit,
  onDelete,
  isDeleting = false,
  className,
}: SearchCardProps) {
  const t = useTranslations("savedSearches");
  const tAmenities = useTranslations("propertyList.advanced.amenities");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const filterItems = useMemo(
    () =>
      buildSavedSearchCriteriaFilterItems(
        record.search_criteria,
        t,
        (slug) => tAmenities(slug as Parameters<typeof tAmenities>[0]),
      ),
    [record.search_criteria, t, tAmenities],
  );

  const actionButtons = (
    <>
      <Button
        type="button"
        color="primary"
        variant="solid"
        size="xs"
        className="rounded-lg"
        iconStart={<Play aria-hidden />}
        onClick={() => {
          onRun(record);
        }}
      >
        {runLabel}
      </Button>

      <Button
        type="button"
        color="inherit"
        variant="outline"
        size="xs"
        className="rounded-lg"
        iconStart={<Pencil aria-hidden />}
        onClick={() => {
          onEdit(record);
        }}
      >
        {editLabel}
      </Button>

      <Button
        type="button"
        color="danger"
        variant="ghost"
        size="xs"
        className="rounded-lg"
        iconStart={<Trash2 aria-hidden />}
        isLoading={isDeleting}
        disabled={isDeleting}
        onClick={() => {
          setShowDeleteConfirm(true);
        }}
      >
        {deleteLabel}
      </Button>
    </>
  );

  return (
    <>
      <Card className={cn(searchCardShellClassName, className)}>
        <CardContent className="flex gap-3 p-4 sm:gap-4 sm:p-5">
          <div
            className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-light text-primary-dark sm:size-11"
            aria-hidden
          >
            <Bookmark className="size-4 sm:size-5" strokeWidth={2} />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start gap-2 sm:gap-3">
              <h2
                className={cn(
                  "min-w-0 flex-1 line-clamp-2 font-bold text-text",
                  bodyLargeTextClasses,
                )}
              >
                {record.name}
              </h2>

              <div className="hidden shrink-0 items-center gap-1.5 md:flex">
                {actionButtons}
              </div>
            </div>

            <div className="mt-2">
              {filterItems.length > 0 ? (
                <SavedSearchFilterChips items={filterItems} variant="chips" />
              ) : (
                <p className="text-xs text-muted sm:text-sm">
                  {t("noFiltersSelected")}
                </p>
              )}
            </div>

            <div className="mt-2 flex items-center justify-end gap-1.5 md:hidden">
              {actionButtons}
            </div>
          </div>
        </CardContent>
      </Card>

      <ConfirmModal
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => {
          onDelete(record);
        }}
        variant="danger"
        title={t("deleteConfirmTitle")}
        description={t("deleteConfirmDescription", { name: record.name })}
        confirmLabel={deleteLabel}
        cancelLabel={t("cancel")}
        confirmIcon={<Trash2 className="size-4" aria-hidden />}
        isLoading={isDeleting}
        loadingLabel={t("deleting")}
      />
    </>
  );
}
