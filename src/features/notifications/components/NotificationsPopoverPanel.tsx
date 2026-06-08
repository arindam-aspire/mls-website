"use client";

import { useClose } from "@headlessui/react";
import { ArrowRight, Bell } from "lucide-react";
import { useCallback } from "react";
import {
  PopoverContent,
  PopoverHeader,
  PopoverPanel,
  PopoverTitle,
} from "@/src/components/ui/popover";
import { Skeleton } from "@/src/components/ui/skeleton";
import { Link } from "@/src/i18n/navigation";
import { cn } from "@/src/lib/cn";
import { NotificationPopoverItem } from "../components/NotificationPopoverItem";
import {
  NOTIFICATION_POPOVER_PAGE_SIZE,
  NOTIFICATION_POPOVER_WIDTH_PX,
} from "../constants/notification.constants";
import type { NotificationRecord } from "../types/notification.types";

type NotificationsPopoverPanelProps = {
  popoverTitle: string;
  markAllAsReadLabel: string;
  listAriaLabel: string;
  emptyTitle: string;
  emptyDescription: string;
  seeAllNotificationsLabel: string;
  loadErrorMessage: string;
  items: NotificationRecord[];
  hasUnread: boolean;
  showMarkAllAsRead: boolean;
  isMarkingAllRead: boolean;
  isLoading: boolean;
  isError: boolean;
  isEmpty: boolean;
  onMarkAllAsRead: () => void;
  onSelectNotification: (notification: NotificationRecord) => void | Promise<void>;
  getRelativeTime: (isoDate: string) => string;
};

function NotificationsPopoverPanel({
  popoverTitle,
  markAllAsReadLabel,
  listAriaLabel,
  emptyTitle,
  emptyDescription,
  seeAllNotificationsLabel,
  loadErrorMessage,
  items,
  hasUnread,
  showMarkAllAsRead,
  isMarkingAllRead,
  isLoading,
  isError,
  isEmpty,
  onMarkAllAsRead,
  onSelectNotification,
  getRelativeTime,
}: NotificationsPopoverPanelProps) {
  const close = useClose();
  const showList = !isLoading && !isError && items.length > 0;

  const handleMarkAllAsRead = useCallback(() => {
    close();
    onMarkAllAsRead();
  }, [close, onMarkAllAsRead]);

  const handleSelectNotification = useCallback(
    (notification: NotificationRecord) => {
      close();
      void onSelectNotification(notification);
    },
    [close, onSelectNotification],
  );

  const handleSeeAllClick = useCallback(() => {
    close();
  }, [close]);

  return (
    <PopoverPanel
      anchor="bottom end"
      className="!p-0"
      style={{
        width: `min(${NOTIFICATION_POPOVER_WIDTH_PX}px, calc(100vw - 2rem))`,
        maxWidth: `${NOTIFICATION_POPOVER_WIDTH_PX}px`,
      }}
    >
      <PopoverHeader className="flex items-center justify-between gap-3 px-4 py-3">
        <PopoverTitle className="min-w-0 truncate !text-sm sm:!text-base">
          {popoverTitle}
        </PopoverTitle>

        {showMarkAllAsRead ? (
          <button
            type="button"
            disabled={!hasUnread || isMarkingAllRead}
            className={cn(
              "shrink-0 text-sm font-medium text-primary-dark",
              "transition-colors hover:text-primary hover:underline",
              "focus:outline-none focus-visible:underline",
              "disabled:cursor-not-allowed disabled:opacity-50",
            )}
            onClick={handleMarkAllAsRead}
          >
            {markAllAsReadLabel}
          </button>
        ) : null}
      </PopoverHeader>

      <PopoverContent className="!p-0">
        {isLoading ? (
          <ul className="flex flex-col gap-1 px-1" aria-hidden>
            {Array.from({ length: NOTIFICATION_POPOVER_PAGE_SIZE }).map(
              (_, index) => (
                <li key={index} className="px-2 py-2.5">
                  <Skeleton className="mb-1.5 h-4 w-4/5 rounded-lg" />
                  <Skeleton className="mb-1.5 h-3 w-full rounded-lg" />
                  <Skeleton className="h-3 w-1/3 rounded-lg" />
                </li>
              ),
            )}
          </ul>
        ) : null}

        {!isLoading && isError ? (
          <p className="px-2 py-3 text-sm text-danger">{loadErrorMessage}</p>
        ) : null}

        {!isLoading && !isError && isEmpty ? (
          <div className="flex flex-col items-center gap-3 px-3 py-4 text-center">
            <div
              className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"
              aria-hidden
            >
              <Bell className="size-6" strokeWidth={2} />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-text">{emptyTitle}</p>
              <p className="text-sm text-muted">{emptyDescription}</p>
            </div>
          </div>
        ) : null}

        {showList ? (
          <>
            <ul
              className="flex max-h-[min(20rem,calc(100vh-8rem))] flex-col overflow-y-auto"
              aria-label={listAriaLabel}
            >
              {items.map((item) => (
                <li
                  key={item.id}
                  className="border-b border-secondary/10 last:border-b-0"
                >
                  <NotificationPopoverItem
                    notification={item}
                    relativeTime={getRelativeTime(item.createdAt)}
                    onSelect={handleSelectNotification}
                  />
                </li>
              ))}
            </ul>

            <div className="flex justify-center border-t border-secondary/15 px-3 py-2.5">
              <Link
                href="/notifications"
                onClick={handleSeeAllClick}
                className={cn(
                  "inline-flex items-center justify-center gap-1.5 text-sm font-medium text-primary-dark",
                  "transition-colors hover:text-primary hover:underline",
                  "focus:outline-none focus-visible:underline",
                )}
              >
                {seeAllNotificationsLabel}
                <ArrowRight
                  className="size-4 shrink-0 rtl:rotate-180"
                  aria-hidden
                />
              </Link>
            </div>
          </>
        ) : null}
      </PopoverContent>
    </PopoverPanel>
  );
}

export { NotificationsPopoverPanel };
