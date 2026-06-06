"use client";

import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { Skeleton } from "@/src/components/ui/skeleton";
import { cn } from "@/src/lib/cn";
import { bodyLargeTextClasses, headingPageClasses } from "@/src/lib/typography";
import { Plus } from "lucide-react";
import { SearchCard, searchCardShellClassName } from "../components/SearchCard";
import { useSavedSearchScreen } from "../hooks/useSavedSearchScreen";
import { SaveSearchFormModal } from "../modals/SaveSearchFormModal";

export default function SavedSearchScreen() {
  const {
    title,
    subtitle,
    items,
    isLoading,
    isError,
    deletingId,
    emptyTitle,
    emptyDescription,
    addSearchCriteriaLabel,
    addNewLabel,
    formModalTitle,
    loadErrorMessage,
    runLabel,
    editLabel,
    deleteLabel,
    addModal,
    onRunSearch,
    onEditSearch,
    onDeleteSearch,
    onAddSearchCriteria,
  } = useSavedSearchScreen();

  return (
    <>
      <div className="flex w-full min-w-0 flex-col gap-4 md:gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 space-y-1">
            <h1 className={headingPageClasses}>{title}</h1>
            <p className={cn("text-muted", bodyLargeTextClasses)}>{subtitle}</p>
          </div>

          <Button
            type="button"
            color="primary"
            variant="solid"
            size="sm"
            className="w-full shrink-0 rounded-lg sm:w-auto"
            iconStart={<Plus className="size-4" aria-hidden />}
            onClick={addModal.onOpen}
            disabled={isLoading}
          >
            {addNewLabel}
          </Button>
        </div>

        {isLoading ? (
          <ul className="flex flex-col gap-4 lg:gap-5">
            {Array.from({ length: 4 }).map((_, index) => (
              <li key={index}>
                <Card className={searchCardShellClassName}>
                  <CardContent className="flex gap-3 p-4 sm:gap-4 sm:p-5">
                    <Skeleton className="size-10 shrink-0 rounded-lg sm:size-11" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start gap-2">
                        <Skeleton className="h-5 min-w-0 flex-1 rounded-lg" />
                        <div className="hidden shrink-0 gap-1.5 md:flex">
                          <Skeleton className="h-7 w-14 rounded-lg" />
                          <Skeleton className="h-7 w-14 rounded-lg" />
                          <Skeleton className="h-7 w-16 rounded-lg" />
                        </div>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        <Skeleton className="h-6 w-24 rounded-lg" />
                        <Skeleton className="h-6 w-28 rounded-lg" />
                        <Skeleton className="h-6 w-20 rounded-lg" />
                      </div>
                      <div className="mt-2 flex justify-end gap-1.5 md:hidden">
                        <Skeleton className="h-7 w-14 rounded-lg" />
                        <Skeleton className="h-7 w-14 rounded-lg" />
                        <Skeleton className="h-7 w-16 rounded-lg" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        ) : null}

        {!isLoading && isError ? (
          <p className="text-sm text-danger sm:text-base">{loadErrorMessage}</p>
        ) : null}

        {!isLoading && !isError && items.length === 0 ? (
          <div className="flex flex-col items-center gap-4 rounded-xl border border-secondary/15 bg-surface px-4 py-8 text-center sm:px-6 sm:py-10">
            <div className="space-y-1">
              <p className="text-base font-semibold text-text sm:text-lg">
                {emptyTitle}
              </p>
              <p className={cn("text-muted", bodyLargeTextClasses)}>
                {emptyDescription}
              </p>
            </div>
            <Button
              type="button"
              color="primary"
              variant="solid"
              size="md"
              className="w-full max-w-xs rounded-lg"
              onClick={onAddSearchCriteria}
            >
              {addSearchCriteriaLabel}
            </Button>
          </div>
        ) : null}

        {!isLoading && !isError && items.length > 0 ? (
          <ul className="flex flex-col gap-4 lg:gap-5">
            {items.map((item) => (
              <li key={item.id} className="min-w-0">
                <SearchCard
                  record={item}
                  runLabel={runLabel}
                  editLabel={editLabel}
                  deleteLabel={deleteLabel}
                  onRun={onRunSearch}
                  onEdit={onEditSearch}
                  onDelete={onDeleteSearch}
                  isDeleting={deletingId === item.id}
                />
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <SaveSearchFormModal
        open={addModal.open}
        onClose={addModal.onClose}
        title={formModalTitle}
        record={addModal.record}
      />
    </>
  );
}
