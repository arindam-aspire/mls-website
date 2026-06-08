"use client";

import { Card, CardContent } from "@/src/components/ui/card";
import { Skeleton } from "@/src/components/ui/skeleton";
import { archivedNotificationListItemShellClassName } from "./ArchivedNotificationListItem";

export function ArchivedNotificationsPanelSkeleton() {
  return (
    <ul className="flex flex-col gap-2 px-4 py-4 sm:px-6 md:gap-3" aria-hidden>
      {Array.from({ length: 5 }).map((_, index) => (
        <li key={index}>
          <Card className={archivedNotificationListItemShellClassName}>
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-start gap-3 sm:gap-4">
                <Skeleton className="size-10 shrink-0 rounded-lg sm:size-11" />
                <div className="min-w-0 flex-1">
                  <Skeleton className="h-5 w-4/5 rounded-lg" />
                  <div className="mt-2 flex justify-between gap-3">
                    <Skeleton className="h-4 min-w-0 flex-1 rounded-lg" />
                    <Skeleton className="h-4 w-16 shrink-0 rounded-lg" />
                  </div>
                  <Skeleton className="mt-2 ms-auto h-7 w-24 rounded-lg md:hidden" />
                </div>
              </div>
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  );
}
