"use client";

import { Archive, Trash2 } from "lucide-react";
import { useState } from "react";
import { ConfirmModal } from "@/src/components/common/ConfirmModal";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { cn } from "@/src/lib/cn";
import { getNotificationIcon } from "../constants/notification-icons";
import type { NotificationRecord } from "../types/notification.types";

export const notificationListItemShellClassName =
  "w-full min-w-0 rounded-xl border-none shadow-none transition-colors";

type NotificationListItemProps = {
  notification: NotificationRecord;
  displayTime: string;
  archiveLabel: string;
  deleteLabel: string;
  archiveConfirmTitle: string;
  archiveConfirmDescription: string;
  deleteConfirmTitle: string;
  deleteConfirmDescription: string;
  cancelLabel: string;
  archivingLabel: string;
  deletingLabel: string;
  isArchiving?: boolean;
  isDeleting?: boolean;
  showArchiveAction?: boolean;
  onSelect: (notification: NotificationRecord) => void | Promise<void>;
  onArchive: (
    notification: NotificationRecord,
    options?: { onSuccess?: () => void },
  ) => void;
  onDelete: (
    notification: NotificationRecord,
    options?: { onSuccess?: () => void },
  ) => void;
};

function NotificationListItemActions({
  notification,
  archiveLabel,
  deleteLabel,
  isArchiving,
  isDeleting,
  showArchiveAction,
  onArchiveClick,
  onDeleteClick,
  className,
}: {
  notification: NotificationRecord;
  archiveLabel: string;
  deleteLabel: string;
  isArchiving: boolean;
  isDeleting: boolean;
  showArchiveAction: boolean;
  onArchiveClick: () => void;
  onDeleteClick: () => void;
  className?: string;
}) {
  return (
    <div className={cn("flex shrink-0 flex-wrap items-center gap-1.5", className)}>
      {showArchiveAction ? (
        <Button
          type="button"
          color="tertiary"
          variant="outline"
          size="xs"
          className="rounded-lg"
          iconStart={<Archive className="size-4" aria-hidden />}
          disabled={Boolean(notification.archivedAt) || isArchiving || isDeleting}
          onClick={onArchiveClick}
        >
          {archiveLabel}
        </Button>
      ) : null}

      <Button
        type="button"
        color="danger"
        variant="outline"
        size="xs"
        className="rounded-lg"
        iconStart={<Trash2 className="size-4" aria-hidden />}
        disabled={isArchiving || isDeleting}
        onClick={onDeleteClick}
      >
        {deleteLabel}
      </Button>
    </div>
  );
}

export function NotificationListItem({
  notification,
  displayTime,
  archiveLabel,
  deleteLabel,
  archiveConfirmTitle,
  archiveConfirmDescription,
  deleteConfirmTitle,
  deleteConfirmDescription,
  cancelLabel,
  archivingLabel,
  deletingLabel,
  isArchiving = false,
  isDeleting = false,
  showArchiveAction = true,
  onSelect,
  onArchive,
  onDelete,
}: NotificationListItemProps) {
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const Icon = getNotificationIcon(notification.typeKey, notification.eventType);

  const actionButtons = (
    <NotificationListItemActions
      notification={notification}
      archiveLabel={archiveLabel}
      deleteLabel={deleteLabel}
      isArchiving={isArchiving}
      isDeleting={isDeleting}
      showArchiveAction={showArchiveAction}
      onArchiveClick={() => {
        setShowArchiveConfirm(true);
      }}
      onDeleteClick={() => {
        setShowDeleteConfirm(true);
      }}
    />
  );

  return (
    <>
      <Card
        className={cn(
          notificationListItemShellClassName,
          notification.isRead ? undefined : "bg-secondary/5",
        )}
      >
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
                    notification.isRead && "hover:opacity-90",
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

                <div className="hidden shrink-0 md:flex">{actionButtons}</div>
              </div>

              <button
                type="button"
                className={cn(
                  "mt-1.5 flex w-full items-start justify-between gap-3 text-start sm:mt-2",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40",
                  notification.isRead && "hover:opacity-90",
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

              <div className="mt-2 flex items-center justify-end gap-1.5 md:hidden">
                {actionButtons}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <ConfirmModal
        open={showArchiveConfirm}
        onClose={() => {
          setShowArchiveConfirm(false);
        }}
        onConfirm={() => {
          onArchive(notification, {
            onSuccess: () => {
              setShowArchiveConfirm(false);
            },
          });
        }}
        onCancel={() => {
          setShowArchiveConfirm(false);
        }}
        variant="primary"
        title={archiveConfirmTitle}
        description={archiveConfirmDescription}
        icon={<Archive className="size-6" aria-hidden />}
        iconContainerClassName="bg-tertiary-light text-tertiary-dark"
        confirmLabel={archiveLabel}
        cancelLabel={cancelLabel}
        cancelColor="inherit"
        confirmIcon={<Archive className="size-4" aria-hidden />}
        confirmColor="tertiary"
        confirmVariant="solid"
        isLoading={isArchiving}
        loadingLabel={archivingLabel}
      />

      <ConfirmModal
        open={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
        }}
        onConfirm={() => {
          onDelete(notification, {
            onSuccess: () => {
              setShowDeleteConfirm(false);
            },
          });
        }}
        onCancel={() => {
          setShowDeleteConfirm(false);
        }}
        variant="danger"
        title={deleteConfirmTitle}
        description={deleteConfirmDescription}
        confirmLabel={deleteLabel}
        cancelLabel={cancelLabel}
        cancelColor="inherit"
        confirmIcon={<Trash2 className="size-4" aria-hidden />}
        isLoading={isDeleting}
        loadingLabel={deletingLabel}
      />
    </>
  );
}
