"use client";

import { Card, CardContent } from "@/src/components/ui";
import { Skeleton } from "@/src/components/ui/skeleton";
import { cn } from "@/src/lib/cn";

type AgentKPICardsSkeletonProps = {
  className?: string;
};

function AgentKPICardSkeleton() {
  return (
    <Card className="rounded-xl border border-secondary/10 shadow-none">
      <CardContent className="flex items-center justify-between gap-3 p-4 sm:gap-4 sm:p-5">
        <div className="min-w-0 flex-1 space-y-3">
          <Skeleton variant="text" className="h-3 w-24 sm:h-3.5" />
          <Skeleton variant="text" className="h-8 w-16 sm:h-9" />
        </div>
        <Skeleton className="size-11 shrink-0 rounded-xl sm:size-12" />
      </CardContent>
    </Card>
  );
}

export function AgentKPICardsSkeleton({ className }: AgentKPICardsSkeletonProps) {
  return (
    <div
      className={cn("w-full min-w-0", className)}
      aria-hidden
    >
      <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:gap-4 lg:gap-6 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <li key={index}>
            <AgentKPICardSkeleton />
          </li>
        ))}
      </ul>
    </div>
  );
}
