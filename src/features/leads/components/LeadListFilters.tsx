"use client";

import { Button, Input, SearchInput, Select } from "@/src/components/ui";

export type LeadListFiltersProps = {
  search: string;
  status: string;
  assignedAgentId: string;
  propertyId: string;
  dateFrom: string;
  dateTo: string;
  statusOptions: { value: string; label: string }[];
  labels: {
    searchPlaceholder: string;
    clearSearch: string;
    filterStatus: string;
    filterAgent: string;
    filterAgentPlaceholder: string;
    filterDateFrom: string;
    filterDateTo: string;
    filterProperty: string;
    filterPropertyPlaceholder: string;
    clearFilters: string;
  };
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onAssignedAgentIdChange: (value: string) => void;
  onPropertyIdChange: (value: string) => void;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
  onClearFilters: () => void;
};

export function LeadListFilters({
  search,
  status,
  assignedAgentId,
  propertyId,
  dateFrom,
  dateTo,
  statusOptions,
  labels,
  onSearchChange,
  onStatusChange,
  onAssignedAgentIdChange,
  onPropertyIdChange,
  onDateFromChange,
  onDateToChange,
  onClearFilters,
}: LeadListFiltersProps) {
  return (
    <div className="mb-4 flex flex-col gap-3 sm:mb-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
        <div className="min-w-0 flex-1">
          <SearchInput
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            onClear={() => onSearchChange("")}
            placeholder={labels.searchPlaceholder}
            aria-label={labels.searchPlaceholder}
            clearLabel={labels.clearSearch}
            className="w-full"
          />
        </div>
        <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:w-auto lg:min-w-[16rem]">
          <Select
            aria-label={labels.filterStatus}
            value={status}
            options={statusOptions}
            onChange={onStatusChange}
            fullWidth
          />
          <Input
            aria-label={labels.filterAgent}
            value={assignedAgentId}
            onChange={(event) => onAssignedAgentIdChange(event.target.value)}
            placeholder={labels.filterAgentPlaceholder}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Input
          type="date"
          aria-label={labels.filterDateFrom}
          value={dateFrom}
          onChange={(event) => onDateFromChange(event.target.value)}
        />
        <Input
          type="date"
          aria-label={labels.filterDateTo}
          value={dateTo}
          onChange={(event) => onDateToChange(event.target.value)}
        />
        <Input
          aria-label={labels.filterProperty}
          value={propertyId}
          onChange={(event) => onPropertyIdChange(event.target.value)}
          placeholder={labels.filterPropertyPlaceholder}
        />
        <Button
          type="button"
          variant="outline"
          color="secondary"
          className="min-h-11 w-full"
          onClick={onClearFilters}
        >
          {labels.clearFilters}
        </Button>
      </div>
    </div>
  );
}
