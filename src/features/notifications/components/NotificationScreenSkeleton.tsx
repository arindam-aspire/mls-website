"use client";

import { Card, CardContent } from "@/src/components/ui/card";
import { Skeleton } from "@/src/components/ui/skeleton";
import { notificationListItemShellClassName } from "./NotificationListItem";

export function NotificationScreenSkeleton() {
  return (
    <div className="flex flex-col gap-4 md:gap-6" aria-hidden>
      {Array.from({ length: 2 }).map((_, groupIndex) => (
        <div key={groupIndex} className="flex flex-col gap-2 md:gap-3">
          <Skeleton className="h-6 w-32 rounded-lg" />

          <ul className="flex flex-col gap-2 md:gap-3">
            {Array.from({ length: groupIndex === 0 ? 3 : 2 }).map((__, itemIndex) => (
              <li key={itemIndex}>
                <Card className={notificationListItemShellClassName}>
                  <CardContent className="p-4 sm:p-5">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <Skeleton className="size-10 shrink-0 rounded-lg sm:size-11" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start gap-2 sm:gap-3">
                          <Skeleton className="h-5 min-w-0 flex-1 rounded-lg" />
                          <div className="hidden shrink-0 gap-1.5 md:flex">
                            <Skeleton className="h-7 w-20 rounded-lg" />
                            <Skeleton className="h-7 w-20 rounded-lg" />
                          </div>
                        </div>
                        <div className="mt-2 flex items-start justify-between gap-3">
                          <Skeleton className="h-4 min-w-0 flex-1 rounded-lg" />
                          <Skeleton className="h-4 w-16 shrink-0 rounded-lg" />
                        </div>
                        <div className="mt-2 flex justify-end gap-1.5 md:hidden">
                          <Skeleton className="h-7 w-20 rounded-lg" />
                          <Skeleton className="h-7 w-20 rounded-lg" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
