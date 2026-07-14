"use client";

import { Card, CardContent } from "@/src/components/ui";
import { headingPageClasses, bodyLargeTextClasses } from "@/src/lib/typography";
import { cn } from "@/src/lib/cn";
import { LeadListFilters } from "../components/LeadListFilters";
import { LeadListTable } from "../components/LeadListTable";
import { LeadsScreenSkeleton } from "../components/LeadScreenSkeletons";
import { useLeadsScreen } from "../hooks/useLeadsScreen";

export function LeadsScreen() {
  const {
    labels,
    statusOptions,
    filters,
    rows,
    statusLabel,
    isLoading,
    pagination,
    page,
    onPageChange,
    onOpenLead,
  } = useLeadsScreen();

  if (isLoading && rows.length === 0) {
    return <LeadsScreenSkeleton />;
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-4 px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
      <header className="space-y-1 sm:space-y-2">
        <h1 className={cn(headingPageClasses)}>{labels.pageTitle}</h1>
        <p className={cn(bodyLargeTextClasses, "text-muted")}>
          {labels.pageSubtitle}
        </p>
      </header>

      <Card className="rounded-xl border border-secondary/15 bg-surface">
        <CardContent className="p-4 sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-text sm:text-lg">
              {labels.tableTitle}
            </h2>
          </div>

          <LeadListFilters
            search={filters.search}
            status={filters.status}
            assignedAgentId={filters.assignedAgentId}
            propertyId={filters.propertyId}
            dateFrom={filters.dateFrom}
            dateTo={filters.dateTo}
            statusOptions={statusOptions}
            labels={{
              searchPlaceholder: labels.searchPlaceholder,
              clearSearch: labels.clearSearch,
              filterStatus: labels.filterStatus,
              filterAgent: labels.filterAgent,
              filterAgentPlaceholder: labels.filterAgentPlaceholder,
              filterDateFrom: labels.filterDateFrom,
              filterDateTo: labels.filterDateTo,
              filterProperty: labels.filterProperty,
              filterPropertyPlaceholder: labels.filterPropertyPlaceholder,
              clearFilters: labels.clearFilters,
            }}
            onSearchChange={filters.onSearchChange}
            onStatusChange={filters.onStatusChange}
            onAssignedAgentIdChange={filters.onAssignedAgentIdChange}
            onPropertyIdChange={filters.onPropertyIdChange}
            onDateFromChange={filters.onDateFromChange}
            onDateToChange={filters.onDateToChange}
            onClearFilters={filters.onClearFilters}
          />

          <LeadListTable
            rows={rows}
            isLoading={isLoading}
            columns={labels.columns}
            viewDetailsLabel={labels.viewDetails}
            noDataTitle={labels.noDataTitle}
            noDataDescription={labels.noDataDescription}
            statusLabel={statusLabel}
            onOpenLead={onOpenLead}
            paginationLabel={labels.pageOf}
            previousLabel={labels.previous}
            nextLabel={labels.next}
            hasPrevious={Boolean(pagination?.hasPrevious)}
            hasNext={Boolean(pagination?.hasNext)}
            onPrevious={() => onPageChange(Math.max(1, page - 1))}
            onNext={() => onPageChange(page + 1)}
          />
        </CardContent>
      </Card>
    </div>
  );
}
