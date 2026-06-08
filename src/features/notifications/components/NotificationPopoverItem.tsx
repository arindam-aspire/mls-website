"use client";

import { cn } from "@/src/lib/cn";
import { getNotificationIcon } from "../constants/notification-icons";
import type { NotificationRecord } from "../types/notification.types";

type NotificationPopoverItemProps = {
  notification: NotificationRecord;
  relativeTime: string;
  onSelect: (notification: NotificationRecord) => void;
};

export function NotificationPopoverItem({
  notification,
  relativeTime,
  onSelect,
}: NotificationPopoverItemProps) {
  const Icon = getNotificationIcon(notification.typeKey, notification.eventType);

  return (
    <button
      type="button"
      className={cn(
        "flex w-full items-start gap-3 border border-transparent px-3 py-2.5 text-start transition-colors",
        notification.isRead ? "hover:bg-page" : "bg-secondary/5 hover:bg-secondary/10",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40",
      )}
      onClick={() => {
        onSelect(notification);
      }}
    >
      <span
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-lg",
          notification.isRead
            ? "bg-secondary/10 text-secondary"
            : "bg-secondary/15 text-secondary-dark",
        )}
        aria-hidden
      >
        <Icon className="size-5 shrink-0" strokeWidth={2} />
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex items-start justify-between gap-2">
          <span
            className={cn(
              "line-clamp-2 text-sm",
              notification.isRead ? "text-text" : "font-semibold text-secondary-dark",
            )}
          >
            {notification.title}
          </span>
          {!notification.isRead ? (
            <span
              className="mt-1 size-2 shrink-0 rounded-full bg-secondary"
              aria-hidden
            />
          ) : null}
        </span>

        <span className="line-clamp-2 text-sm text-muted">{notification.message}</span>

        {relativeTime ? (
          <span className="text-xs text-muted">{relativeTime}</span>
        ) : null}
      </span>
    </button>
  );
}
