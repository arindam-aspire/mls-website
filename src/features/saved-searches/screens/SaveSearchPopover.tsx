"use client";

import { ArrowRight, Plus, Search } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import {
  Popover,
  PopoverButton,
  PopoverContent,
  PopoverPanel,
} from "@/src/components/ui/popover";
import { Skeleton } from "@/src/components/ui/skeleton";
import { Link } from "@/src/i18n/navigation";
import { cn } from "@/src/lib/cn";
import { SavedSearchPopoverItem } from "../components/SavedSearchPopoverItem";
import {
  SAVED_SEARCH_POPOVER_PAGE_SIZE,
  SAVED_SEARCH_POPOVER_WIDTH_PX,
} from "../constants/savedSearch.constants";
import { useSaveSearchPopover } from "../hooks/useSaveSearchPopover";

type SaveSearchPopoverProps = {
  className?: string;
  enabled?: boolean;
};

export function SaveSearchPopover({
  className,
  enabled = true,
}: SaveSearchPopoverProps) {
  const {
    searchAriaLabel,
    listAriaLabel,
    emptyTitle,
    emptyDescription,
    addSearchCriteriaLabel,
    seeAllSavedSearchesLabel,
    loadErrorMessage,
    items,
    isLoading,
    isError,
    isEmpty,
    onOpen,
    onSelectSavedSearch,
    onAddSearchCriteria,
  } = useSaveSearchPopover({ enabled });

  const showList = !isLoading && !isError && items.length > 0;

  return (
    <Popover
      className={cn("relative hidden shrink-0 md:inline-flex", className)}
    >
      <PopoverButton
        type="button"
        aria-label={searchAriaLabel}
        onClick={onOpen}
        className={cn(
          "!inline-flex !size-9 !min-h-9 !min-w-9 !shrink-0 !rounded-full !border !border-secondary/15",
          "!bg-surface !p-0 !shadow-none sm:!size-11 sm:!min-h-11 sm:!min-w-11",
          "hover:!bg-page data-active:!bg-page",
          "focus-visible:ring-2 focus-visible:ring-secondary/40",
        )}
      >
        <Search className="size-5 shrink-0" strokeWidth={2} aria-hidden />
      </PopoverButton>

      <PopoverPanel
        anchor="bottom end"
        className="!p-0"
        style={{
          width: `min(${SAVED_SEARCH_POPOVER_WIDTH_PX}px, calc(100vw - 2rem))`,
          maxWidth: `${SAVED_SEARCH_POPOVER_WIDTH_PX}px`,
        }}
      >
        <PopoverContent className="px-2 py-2">
          {isLoading ? (
            <ul className="flex flex-col gap-1 px-1" aria-hidden>
              {Array.from({ length: SAVED_SEARCH_POPOVER_PAGE_SIZE }).map(
                (_, index) => (
                  <li key={index} className="px-2 py-2.5">
                    <Skeleton className="mb-1.5 h-4 w-4/5 rounded-lg" />
                    <Skeleton className="h-3 w-full rounded-lg" />
                  </li>
                ),
              )}
            </ul>
          ) : null}

          {!isLoading && isError ? (
            <p className="px-2 py-3 text-sm text-danger">{loadErrorMessage}</p>
          ) : null}

          {!isLoading && !isError && isEmpty ? (
            <div className="flex flex-col items-center gap-3 px-3 py-4 text-center">
              <div
                className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"
                aria-hidden
              >
                <Search className="size-6" strokeWidth={2} />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-text">{emptyTitle}</p>
                <p className="text-sm text-muted">{emptyDescription}</p>
              </div>
              <Button
                type="button"
                color="primary"
                variant="solid"
                size="sm"
                className="w-full"
                iconStart={<Plus className="size-4" aria-hidden />}
                onClick={onAddSearchCriteria}
              >
                {addSearchCriteriaLabel}
              </Button>
            </div>
          ) : null}

          {showList ? (
            <>
              <ul
                className="flex max-h-[min(20rem,calc(100vh-8rem))] flex-col overflow-y-auto px-1"
                aria-label={listAriaLabel}
              >
                {items.map((item) => (
                  <li
                    key={item.id}
                    className="border-b border-secondary/10 last:border-b-0"
                  >
                    <SavedSearchPopoverItem
                      record={item}
                      onSelect={onSelectSavedSearch}
                    />
                  </li>
                ))}
              </ul>

              <div className="flex justify-center border-t border-secondary/15 px-3 py-2.5">
                <Link
                  href="/saved-searches"
                  className={cn(
                    "inline-flex items-center justify-center gap-1.5 text-sm font-medium text-primary-dark",
                    "transition-colors hover:text-primary hover:underline",
                    "focus:outline-none focus-visible:underline",
                  )}
                >
                  {seeAllSavedSearchesLabel}
                  <ArrowRight
                    className="size-4 shrink-0 rtl:rotate-180"
                    aria-hidden
                  />
                </Link>
              </div>
            </>
          ) : null}
        </PopoverContent>
      </PopoverPanel>
    </Popover>
  );
}
