"use client";

import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/lib/cn";
import { bodyLargeTextClasses, headingPageClasses } from "@/src/lib/typography";
import { Archive, ChevronLeft, ChevronRight } from "lucide-react";
import { ArchivedNotificationsPanel } from "../components/ArchivedNotificationsPanel";
import { NotificationListGroup } from "../components/NotificationListGroup";
import { NotificationScreenSkeleton } from "../components/NotificationScreenSkeleton";
import { useNotificationArchivedPanel } from "../hooks/useNotificationArchivedPanel";
import { useNotificationScreen } from "../hooks/useNotificationScreen";

export function NotificationScreen() {
  const {
    title,
    subtitle,
    markAllAsReadLabel,
    archivedLabel,
    archiveLabel,
    deleteLabel,
    listAriaLabel,
    loadErrorMessage,
    emptyTitle,
    emptyDescription,
    deleteConfirmTitle,
    deleteConfirmDescription,
    archiveConfirmTitle,
    archiveConfirmDescription,
    cancelLabel,
    archivingLabel,
    deletingLabel,
    paginationPreviousLabel,
    paginationNextLabel,
    paginationPageLabel,
    isArchivedPanelOpen,
    canMarkAllAsRead,
    isMarkingAllRead,
    groupedNotifications,
    archivingId,
    deletingId,
    isLoading,
    isError,
    isEmpty,
    pagination,
    getDisplayTime,
    onMarkAllAsRead,
    onOpenArchivedPanel,
    onCloseArchivedPanel,
    onPageChange,
    onSelectNotification,
    onArchiveNotification,
    onDeleteNotification,
  } = useNotificationScreen();

  const archivedPanel = useNotificationArchivedPanel({
    open: isArchivedPanelOpen,
    onClose: onCloseArchivedPanel,
  });

  const showPagination = pagination.totalPages > 1;

  return (
    <>
      <div className="flex w-full min-w-0 flex-col gap-2 md:gap-4 lg:gap-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between md:gap-4 lg:gap-6">
          <div className="min-w-0 flex-1">
            <h1 className={headingPageClasses}>{title}</h1>
            <p className={cn("text-muted", bodyLargeTextClasses)}>{subtitle}</p>
          </div>

          <div className="flex w-full shrink-0 flex-col gap-2 sm:w-auto sm:flex-row sm:justify-end">
            <Button
              type="button"
              color="inherit"
              variant="outline"
              size="sm"
              className="w-full rounded-lg sm:w-auto"
              disabled={!canMarkAllAsRead || isMarkingAllRead}
              isLoading={isMarkingAllRead}
              onClick={onMarkAllAsRead}
            >
              {markAllAsReadLabel}
            </Button>

            <Button
              type="button"
              color="tertiary"
              variant="solid"
              size="sm"
              className="w-full rounded-lg sm:w-auto"
              iconStart={<Archive className="size-4" aria-hidden />}
              aria-expanded={isArchivedPanelOpen}
              onClick={onOpenArchivedPanel}
            >
              {archivedLabel}
            </Button>
          </div>
        </div>

        {isLoading ? <NotificationScreenSkeleton /> : null}

        {!isLoading && isError ? (
          <p className="text-sm text-danger sm:text-base">{loadErrorMessage}</p>
        ) : null}

        {!isLoading && !isError && isEmpty ? (
          <div className="flex flex-col items-center gap-2 rounded-xl border border-secondary/15 bg-surface px-4 py-8 text-center md:gap-4 sm:px-6 sm:py-10">
            <div className="space-y-1">
              <p className="text-base font-semibold text-text sm:text-lg">{emptyTitle}</p>
              <p className={cn("text-muted", bodyLargeTextClasses)}>{emptyDescription}</p>
            </div>
          </div>
        ) : null}

        {!isLoading && !isError && !isEmpty ? (
          <div className="flex flex-col gap-4 md:gap-6">
            <div
              className="flex flex-col gap-4 md:gap-6"
              aria-label={listAriaLabel}
            >
              {groupedNotifications.map((group) => (
                <NotificationListGroup
                  key={group.id}
                  group={group}
                  archiveLabel={archiveLabel}
                  deleteLabel={deleteLabel}
                  archiveConfirmTitle={archiveConfirmTitle}
                  archiveConfirmDescription={archiveConfirmDescription}
                  deleteConfirmTitle={deleteConfirmTitle}
                  deleteConfirmDescription={deleteConfirmDescription}
                  cancelLabel={cancelLabel}
                  archivingLabel={archivingLabel}
                  deletingLabel={deletingLabel}
                  archivingId={archivingId}
                  deletingId={deletingId}
                  showArchiveAction
                  getDisplayTime={getDisplayTime}
                  onSelect={onSelectNotification}
                  onArchive={onArchiveNotification}
                  onDelete={onDeleteNotification}
                />
              ))}
            </div>

            {showPagination ? (
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
            ) : null}
          </div>
        ) : null}
      </div>

      <ArchivedNotificationsPanel
        open={isArchivedPanelOpen}
        onClose={archivedPanel.onClosePanel}
        title={archivedPanel.title}
        listAriaLabel={archivedPanel.listAriaLabel}
        closePanelAriaLabel={archivedPanel.closePanelAriaLabel}
        loadErrorMessage={archivedPanel.loadErrorMessage}
        emptyTitle={archivedPanel.emptyTitle}
        emptyDescription={archivedPanel.emptyDescription}
        unarchiveLabel={archivedPanel.unarchiveLabel}
        paginationPreviousLabel={archivedPanel.paginationPreviousLabel}
        paginationNextLabel={archivedPanel.paginationNextLabel}
        paginationPageLabel={archivedPanel.paginationPageLabel}
        items={archivedPanel.items}
        unarchivingId={archivedPanel.unarchivingId}
        isLoading={archivedPanel.isLoading}
        isError={archivedPanel.isError}
        isEmpty={archivedPanel.isEmpty}
        pagination={archivedPanel.pagination}
        getDisplayTime={archivedPanel.getDisplayTime}
        onPageChange={archivedPanel.onPageChange}
        onSelectNotification={archivedPanel.onSelectNotification}
        onUnarchiveNotification={archivedPanel.onUnarchiveNotification}
      />
    </>
  );
}
