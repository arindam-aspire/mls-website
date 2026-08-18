"use client";

import { SearchInput, SelectDropdown } from "@/src/components/ui";
import { cn } from "@/src/lib/cn";

const searchFieldClassName = "w-full sm:max-w-sm md:max-w-md";
const statusFieldClassName =
  "w-full min-w-0 flex-1 sm:w-auto sm:min-w-[11.5rem] md:min-w-[13rem] lg:min-w-[14.5rem]";

export type LeadListFiltersProps = {
  search: string;
  status: string;
  statusOptions: { value: string; label: string }[];
  labels: {
    searchPlaceholder: string;
    clearSearch: string;
    filterStatus: string;
    statusAll: string;
  };
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  className?: string;
};

export function LeadListFilters({
  search,
  status,
  statusOptions,
  labels,
  onSearchChange,
  onStatusChange,
  className,
}: LeadListFiltersProps) {
  return (
    <div
      className={cn(
        "mb-2 flex w-full min-w-0 flex-col gap-2 sm:mb-2! sm:flex-row sm:items-center sm:justify-between sm:gap-2 md:mb-4! md:gap-4 lg:mb-6! lg:gap-6",
        className,
      )}
    >
      <SearchInput
        fullWidth={false}
        className={cn(searchFieldClassName)}
        placeholder={labels.searchPlaceholder}
        aria-label={labels.searchPlaceholder}
        clearLabel={labels.clearSearch}
        size="md"
        value={search}
        onChange={(event) => {
          onSearchChange(event.target.value);
        }}
        onClear={() => {
          onSearchChange("");
        }}
      />

      <div className="flex w-full min-w-0 items-center gap-2 sm:w-auto sm:shrink-0">
        <SelectDropdown
          fullWidth={false}
          className={cn(statusFieldClassName)}
          placeholder={labels.statusAll}
          aria-label={labels.filterStatus}
          value={status}
          options={statusOptions}
          onChange={onStatusChange}
          variant="outline"
          size="md"
        />
      </div>
    </div>
  );
}
