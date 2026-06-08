"use client";

import { ArchiveRestore } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { cn } from "@/src/lib/cn";
import { getNotificationIcon } from "../constants/notification-icons";
import type { NotificationRecord } from "../types/notification.types";

export const archivedNotificationListItemShellClassName =
  "w-full min-w-0 rounded-xl border-none bg-surface shadow-none transition-colors";

type ArchivedNotificationListItemProps = {
  notification: NotificationRecord;
  displayTime: string;
  unarchiveLabel: string;
  isUnarchiving?: boolean;
  onSelect: (notification: NotificationRecord) => void | Promise<void>;
  onUnarchive: (notification: NotificationRecord) => void;
};

export function ArchivedNotificationListItem({
  notification,
  displayTime,
  unarchiveLabel,
  isUnarchiving = false,
  onSelect,
  onUnarchive,
}: ArchivedNotificationListItemProps) {
  const Icon = getNotificationIcon(notification.typeKey, notification.eventType);

  return (
    <Card className={archivedNotificationListItemShellClassName}>
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-start gap-3 sm:gap-4">
          <span
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-lg sm:size-11",
              notification.isRead
                ? "bg-secondary/10 text-secondary"
                : "bg-secondary/15 text-secondary-dark",
            )}
            aria-hidden
          >
            <Icon className="size-5 shrink-0" strokeWidth={2} />
          </span>

          <div className="min-w-0 flex-1">
            <div className="flex items-start gap-2 sm:gap-3">
              <button
                type="button"
                className={cn(
                  "min-w-0 flex-1 text-start transition-opacity",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40",
                  "hover:opacity-90",
                )}
                onClick={() => {
                  void onSelect(notification);
                }}
              >
                <span className="inline-flex min-w-0 items-center gap-2">
                  {!notification.isRead ? (
                    <span
                      className="size-2 shrink-0 rounded-full bg-secondary"
                      aria-hidden
                    />
                  ) : null}
                  <span
                    className={cn(
                      "line-clamp-2 text-sm sm:text-base",
                      notification.isRead
                        ? "text-text"
                        : "font-semibold text-secondary-dark",
                    )}
                  >
                    {notification.title}
                  </span>
                </span>
              </button>

              <Button
                type="button"
                color="primary"
                variant="outline"
                size="xs"
                className="hidden shrink-0 rounded-lg md:inline-flex"
                iconStart={<ArchiveRestore className="size-4" aria-hidden />}
                disabled={isUnarchiving}
                isLoading={isUnarchiving}
                onClick={() => {
                  onUnarchive(notification);
                }}
              >
                {unarchiveLabel}
              </Button>
            </div>

            <button
              type="button"
              className={cn(
                "mt-1.5 flex w-full items-start justify-between gap-3 text-start sm:mt-2",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40",
                "hover:opacity-90",
              )}
              onClick={() => {
                void onSelect(notification);
              }}
            >
              <span className="min-w-0 flex-1 line-clamp-3 text-sm text-muted">
                {notification.message}
              </span>

              {displayTime ? (
                <time
                  dateTime={notification.createdAt}
                  className="shrink-0 text-xs whitespace-nowrap text-secondary sm:text-sm"
                >
                  {displayTime}
                </time>
              ) : null}
            </button>

            <div className="mt-2 flex justify-end md:hidden">
              <Button
                type="button"
                color="primary"
                variant="outline"
                size="xs"
                className="rounded-lg"
                iconStart={<ArchiveRestore className="size-4" aria-hidden />}
                disabled={isUnarchiving}
                isLoading={isUnarchiving}
                onClick={() => {
                  onUnarchive(notification);
                }}
              >
                {unarchiveLabel}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
