import type { ComponentProps } from "react";
import {
  DraftListEmpty,
  DraftListCard,
  DraftListSkeleton,
  TablePaginition,
} from "@abdoun/abdoun-library";
import { cn } from "@/src/lib/cn";
import type { MappedDraftListItem } from "../mappers/agentPropertyDraftsList.mapper";

type DraftListPagination = ComponentProps<typeof TablePaginition>;

type PropertyDraftListProps = {
  items: MappedDraftListItem[];
  isLoading?: boolean;
  loadingCount?: number;
  onResume?: (item: MappedDraftListItem) => void;
  onDelete?: (item: MappedDraftListItem) => void;
  getDeleteLoading?: (item: MappedDraftListItem) => boolean;
  resumeLabel?: string;
  size?: "sm" | "md" | "lg";
  emptyStateContent?: {
    title?: string;
    description?: string;
  };
  onCreateNew?: () => void;
  createLabel?: string;
  pagination?: DraftListPagination;
  className?: string;
  itemClassName?: string;
};

export function PropertyDraftList({
  items,
  isLoading = false,
  loadingCount,
  onResume,
  onDelete,
  getDeleteLoading,
  resumeLabel,
  size = "md",
  emptyStateContent,
  onCreateNew,
  createLabel,
  pagination,
  className,
  itemClassName,
}: PropertyDraftListProps) {
  const isEmpty = items.length === 0;
  const showPagination = Boolean(pagination) && (isLoading || !isEmpty);
  const skeletonRows = loadingCount ?? pagination?.pageSize ?? 4;

  if (isLoading) {
    return (
      <DraftListSkeleton
        rowCount={skeletonRows}
        showPagination={Boolean(pagination)}
        className={className}
      />
    );
  }

  return (
    <div className={cn("w-full", className)}>
      <section className="w-full" aria-label="Property drafts">
        {isEmpty ? (
          <DraftListEmpty
            title={emptyStateContent?.title}
            description={emptyStateContent?.description}
            onCreateNew={onCreateNew}
            createLabel={createLabel}
          />
        ) : (
          <ul className="m-0 flex list-none flex-col gap-3 p-0 md:gap-4">
            {items.map((item) => (
              <li key={item.id}>
                <DraftListCard
                  item={item}
                  onResume={item.canEdit && onResume ? () => onResume(item) : undefined}
                  onDelete={item.canDelete && onDelete ? () => onDelete(item) : undefined}
                  isDeleteLoading={getDeleteLoading?.(item)}
                  resumeLabel={resumeLabel}
                  size={size}
                  className={itemClassName}
                />
              </li>
            ))}
          </ul>
        )}
      </section>

      {showPagination && pagination ? (
        <TablePaginition
          {...pagination}
          buttonSize="sm"
          className="mt-4 sm:mt-6"
        />
      ) : null}
    </div>
  );
}

export type { PropertyDraftListProps };
