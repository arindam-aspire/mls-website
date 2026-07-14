"use client";

import { Card, CardContent, Skeleton } from "@/src/components/ui";
import { LeadListTableSkeleton } from "./LeadListTable";

export function LeadsScreenSkeleton() {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-4 px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
      <div className="space-y-2">
        <Skeleton variant="text" className="h-8 w-40" />
        <Skeleton variant="text" className="h-4 w-full max-w-xl" />
      </div>
      <Card className="rounded-xl border border-secondary/15 bg-surface">
        <CardContent className="p-4 sm:p-6">
          <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} variant="block" className="h-11 w-full rounded-lg" />
            ))}
          </div>
          <LeadListTableSkeleton />
        </CardContent>
      </Card>
    </div>
  );
}

export function LeadDetailsScreenSkeleton() {
  return (
    <div
      aria-hidden
      className="mx-auto w-full max-w-7xl space-y-4 px-4 py-4 sm:px-6 sm:py-6 lg:px-8"
    >
      <Skeleton variant="text" className="h-5 w-32" />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton variant="text" className="h-8 w-48" />
        <Skeleton variant="block" className="h-7 w-28 rounded-full" />
      </div>
      <div className="flex gap-2 overflow-x-auto">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} variant="block" className="h-11 w-28 shrink-0 rounded-lg" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="rounded-xl border border-secondary/15 bg-surface">
            <CardContent className="space-y-3 p-4 sm:p-6">
              <Skeleton variant="text" className="h-5 w-40" />
              <Skeleton variant="text" className="h-4 w-full" />
              <Skeleton variant="text" className="h-4 w-3/4" />
              <Skeleton variant="text" className="h-4 w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
