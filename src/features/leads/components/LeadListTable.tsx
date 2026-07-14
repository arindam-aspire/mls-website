"use client";

import { Button, Skeleton } from "@/src/components/ui";
import { LeadStatusBadge } from "./LeadStatusBadge";

export type LeadListRow = {
  id: string;
  leadNumber: string;
  propertyTitle: string;
  customerName: string;
  status: string;
  assignedAgent: string;
  createdAtLabel: string;
};

type LeadListTableProps = {
  rows: LeadListRow[];
  isLoading: boolean;
  columns: {
    leadNo: string;
    property: string;
    customer: string;
    status: string;
    assignedAgent: string;
    createdDate: string;
    actions: string;
  };
  viewDetailsLabel: string;
  noDataTitle: string;
  noDataDescription: string;
  statusLabel: (status: string) => string;
  onOpenLead: (leadId: string) => void;
  paginationLabel: string;
  previousLabel: string;
  nextLabel: string;
  hasPrevious: boolean;
  hasNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
};

export function LeadListTable({
  rows,
  isLoading,
  columns,
  viewDetailsLabel,
  noDataTitle,
  noDataDescription,
  statusLabel,
  onOpenLead,
  paginationLabel,
  previousLabel,
  nextLabel,
  hasPrevious,
  hasNext,
  onPrevious,
  onNext,
}: LeadListTableProps) {
  if (isLoading) {
    return <LeadListTableSkeleton />;
  }

  if (rows.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-secondary/20 bg-page px-4 py-12 text-center">
        <p className="text-sm font-semibold text-text sm:text-base">{noDataTitle}</p>
        <p className="mt-2 text-sm text-muted">{noDataDescription}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[52rem] border-collapse text-start text-sm">
          <thead>
            <tr className="border-b border-secondary/15 text-muted">
              <th className="px-3 py-3 font-semibold">{columns.leadNo}</th>
              <th className="px-3 py-3 font-semibold">{columns.property}</th>
              <th className="px-3 py-3 font-semibold">{columns.customer}</th>
              <th className="px-3 py-3 font-semibold">{columns.status}</th>
              <th className="px-3 py-3 font-semibold">{columns.assignedAgent}</th>
              <th className="px-3 py-3 font-semibold">{columns.createdDate}</th>
              <th className="px-3 py-3 font-semibold">{columns.actions}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-secondary/10 text-text last:border-b-0"
              >
                <td className="px-3 py-3 font-medium">{row.leadNumber}</td>
                <td className="max-w-[12rem] truncate px-3 py-3">
                  {row.propertyTitle}
                </td>
                <td className="max-w-[10rem] truncate px-3 py-3">
                  {row.customerName}
                </td>
                <td className="px-3 py-3">
                  <LeadStatusBadge
                    status={row.status}
                    label={statusLabel(row.status)}
                  />
                </td>
                <td className="max-w-[10rem] truncate px-3 py-3">
                  {row.assignedAgent}
                </td>
                <td className="whitespace-nowrap px-3 py-3">
                  {row.createdAtLabel}
                </td>
                <td className="px-3 py-3">
                  <Button
                    type="button"
                    variant="outline"
                    color="secondary"
                    size="sm"
                    className="min-h-11"
                    onClick={() => onOpenLead(row.id)}
                  >
                    {viewDetailsLabel}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 md:hidden">
        {rows.map((row) => (
          <article
            key={row.id}
            className="rounded-xl border border-secondary/15 bg-surface p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-text">
                  {row.leadNumber}
                </p>
                <p className="mt-1 truncate text-sm text-muted">
                  {row.propertyTitle}
                </p>
              </div>
              <LeadStatusBadge
                status={row.status}
                label={statusLabel(row.status)}
              />
            </div>
            <dl className="mt-3 space-y-1 text-sm">
              <div className="flex justify-between gap-2">
                <dt className="text-muted">{columns.customer}</dt>
                <dd className="truncate font-medium text-text">{row.customerName}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-muted">{columns.assignedAgent}</dt>
                <dd className="truncate text-text">{row.assignedAgent}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-muted">{columns.createdDate}</dt>
                <dd className="text-text">{row.createdAtLabel}</dd>
              </div>
            </dl>
            <Button
              type="button"
              variant="outline"
              color="secondary"
              className="mt-4 min-h-11 w-full"
              onClick={() => onOpenLead(row.id)}
            >
              {viewDetailsLabel}
            </Button>
          </article>
        ))}
      </div>

      <div className="flex flex-col items-stretch justify-between gap-3 border-t border-secondary/10 pt-4 sm:flex-row sm:items-center">
        <p className="text-sm text-muted">{paginationLabel}</p>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            color="secondary"
            className="min-h-11 flex-1 sm:flex-none"
            disabled={!hasPrevious}
            onClick={onPrevious}
          >
            {previousLabel}
          </Button>
          <Button
            type="button"
            variant="outline"
            color="secondary"
            className="min-h-11 flex-1 sm:flex-none"
            disabled={!hasNext}
            onClick={onNext}
          >
            {nextLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

export function LeadListTableSkeleton() {
  return (
    <div aria-hidden className="space-y-3">
      <div className="hidden space-y-2 md:block">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} variant="block" className="h-12 w-full rounded-lg" />
        ))}
      </div>
      <div className="flex flex-col gap-3 md:hidden">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} variant="block" className="h-40 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}
