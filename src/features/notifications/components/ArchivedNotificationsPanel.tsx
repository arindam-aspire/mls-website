"use client";

import {
  CloseButton,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { useMatchMedia } from "@/src/hooks/useMatchMedia";
import { cn } from "@/src/lib/cn";
import { bodyLargeTextClasses, sheetTitleClasses } from "@/src/lib/typography";
import { useLocale } from "next-intl";
import type { AppLocale } from "@/src/i18n/routing";
import { isRtlLocale } from "@/src/i18n/routing";
import { ArchivedNotificationListItem } from "./ArchivedNotificationListItem";
import { ArchivedNotificationsPanelSkeleton } from "./ArchivedNotificationsPanelSkeleton";
import type { NotificationRecord } from "../types/notification.types";

type ArchivedNotificationsPanelProps = {
  open: boolean;
  title: string;
  listAriaLabel: string;
  closePanelAriaLabel: string;
  loadErrorMessage: string;
  emptyTitle: string;
  emptyDescription: string;
  unarchiveLabel: string;
  paginationPreviousLabel: string;
  paginationNextLabel: string;
  paginationPageLabel: string;
  items: NotificationRecord[];
  unarchivingId: string | null;
  isLoading: boolean;
  isError: boolean;
  isEmpty: boolean;
  pagination: {
    page: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
  getDisplayTime: (isoDate: string) => string;
  onClose: () => void;
  onPageChange: (page: number) => void;
  onSelectNotification: (notification: NotificationRecord) => void | Promise<void>;
  onUnarchiveNotification: (notification: NotificationRecord) => void;
};

function ArchivedNotificationsPanelContent({
  listAriaLabel,
  loadErrorMessage,
  emptyTitle,
  emptyDescription,
  unarchiveLabel,
  paginationPreviousLabel,
  paginationNextLabel,
  paginationPageLabel,
  items,
  unarchivingId,
  isLoading,
  isError,
  isEmpty,
  pagination,
  getDisplayTime,
  onPageChange,
  onSelectNotification,
  onUnarchiveNotification,
}: Omit<
  ArchivedNotificationsPanelProps,
  "open" | "title" | "closePanelAriaLabel" | "onClose"
>) {
  const showPagination = pagination.totalPages > 1;

  if (isLoading) {
    return <ArchivedNotificationsPanelSkeleton />;
  }

  if (isError) {
    return (
      <p className="px-4 py-6 text-sm text-danger sm:px-6 sm:text-base">
        {loadErrorMessage}
      </p>
    );
  }

  if (isEmpty) {
    return (
      <div className="flex flex-col items-center gap-2 px-4 py-10 text-center sm:px-6">
        <p className="text-base font-semibold text-text sm:text-lg">{emptyTitle}</p>
        <p className={cn("text-muted", bodyLargeTextClasses)}>{emptyDescription}</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-6 [scrollbar-width:thin]"
        aria-label={listAriaLabel}
      >
        <ul className="flex flex-col gap-2 md:gap-3">
          {items.map((item) => (
            <li key={item.id} className="min-w-0">
              <ArchivedNotificationListItem
                notification={item}
                displayTime={getDisplayTime(item.createdAt)}
                unarchiveLabel={unarchiveLabel}
                isUnarchiving={unarchivingId === item.id}
                onSelect={onSelectNotification}
                onUnarchive={onUnarchiveNotification}
              />
            </li>
          ))}
        </ul>
      </div>

      {showPagination ? (
        <div className="shrink-0 border-t border-secondary/15 px-4 py-3 sm:px-6">
          <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-center text-sm text-muted sm:text-start">
              {paginationPageLabel}
            </p>
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
              <Button
                type="button"
                color="inherit"
                variant="outline"
                size="sm"
                className="w-full rounded-lg sm:w-auto"
                iconStart={
                  <ChevronLeft className="size-4 rtl:rotate-180" aria-hidden />
                }
                disabled={!pagination.hasPrevious}
                onClick={() => {
                  onPageChange(pagination.page - 1);
                }}
              >
                {paginationPreviousLabel}
              </Button>
              <Button
                type="button"
                color="inherit"
                variant="outline"
                size="sm"
                className="w-full rounded-lg sm:w-auto"
                iconEnd={
                  <ChevronRight className="size-4 rtl:rotate-180" aria-hidden />
                }
                disabled={!pagination.hasNext}
                onClick={() => {
                  onPageChange(pagination.page + 1);
                }}
              >
                {paginationNextLabel}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function ArchivedNotificationsPanel({
  open,
  title,
  closePanelAriaLabel,
  onClose,
  ...contentProps
}: ArchivedNotificationsPanelProps) {
  const locale = useLocale() as AppLocale;
  const isRtl = isRtlLocale(locale);
  const isMobileSheet = useMatchMedia("(max-width: 767px)");

  const header = (
    <div className="relative shrink-0 border-b border-secondary/15">
      {isMobileSheet ? (
        <div className="flex justify-center pt-2" aria-hidden>
          <div className="h-1 w-10 rounded-full bg-secondary/25" />
        </div>
      ) : null}
      <div className="relative px-4 py-3 sm:px-6">
        <DialogTitle className={cn("pe-12", sheetTitleClasses)}>{title}</DialogTitle>
        <CloseButton
          type="button"
          aria-label={closePanelAriaLabel}
          className="absolute end-3 top-1/2 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-lg text-muted transition-colors hover:bg-page hover:text-text focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40 sm:end-5"
          onClick={onClose}
        >
          <X className="size-5" aria-hidden />
        </CloseButton>
      </div>
    </div>
  );

  return (
    <Dialog open={open} onClose={onClose} transition className="relative z-[80]">
      <DialogBackdrop
        transition
        className={cn(
          "fixed inset-0 bg-black/65 transition-opacity",
          "data-closed:opacity-0 data-enter:opacity-100 data-leave:opacity-0",
        )}
      />

      {isMobileSheet ? (
        <div className="fixed inset-0 z-[80] flex items-end justify-center">
          <DialogPanel
            transition
            className={cn(
              "flex max-h-[min(90dvh,100%)] w-full flex-col overflow-hidden rounded-t-xl bg-surface text-text shadow-lg",
              "transition duration-300 ease-out",
              "data-closed:translate-y-full data-enter:translate-y-0 data-leave:translate-y-full",
            )}
          >
            {header}
            <ArchivedNotificationsPanelContent {...contentProps} />
          </DialogPanel>
        </div>
      ) : (
        <div className="fixed inset-0 z-[80] overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 end-0 flex max-w-full">
              <DialogPanel
                transition
                className={cn(
                  "pointer-events-auto relative flex h-dvh w-full min-w-md max-w-md flex-col overflow-hidden bg-surface text-text shadow-xl outline-none",
                  "transform transition duration-300 ease-in-out",
                  isRtl
                    ? "data-closed:-translate-x-full"
                    : "data-closed:translate-x-full",
                )}
              >
                {header}
                <ArchivedNotificationsPanelContent {...contentProps} />
              </DialogPanel>
            </div>
          </div>
        </div>
      )}
    </Dialog>
  );
}
