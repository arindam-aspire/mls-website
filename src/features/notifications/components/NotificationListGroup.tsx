"use client";

import { headingSectionClasses } from "@/src/lib/typography";
import { NotificationListItem } from "./NotificationListItem";
import type { NotificationRecord } from "../types/notification.types";
import type { NotificationTimeGroup } from "../utils/groupNotificationsByTime";

type NotificationListGroupProps = {
  group: NotificationTimeGroup;
  archiveLabel: string;
  deleteLabel: string;
  archiveConfirmTitle: string;
  archiveConfirmDescription: string;
  deleteConfirmTitle: string;
  deleteConfirmDescription: string;
  cancelLabel: string;
  archivingLabel: string;
  deletingLabel: string;
  archivingId: string | null;
  deletingId: string | null;
  showArchiveAction: boolean;
  getDisplayTime: (isoDate: string) => string;
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

export function NotificationListGroup({
  group,
  archiveLabel,
  deleteLabel,
  archiveConfirmTitle,
  archiveConfirmDescription,
  deleteConfirmTitle,
  deleteConfirmDescription,
  cancelLabel,
  archivingLabel,
  deletingLabel,
  archivingId,
  deletingId,
  showArchiveAction,
  getDisplayTime,
  onSelect,
  onArchive,
  onDelete,
}: NotificationListGroupProps) {
  return (
    <section className="flex flex-col gap-2 md:gap-3">
      <h2 className={headingSectionClasses}>{group.label}</h2>

      <ul className="flex flex-col gap-2 md:gap-3">
        {group.items.map((item) => (
          <li key={item.id} className="min-w-0">
            <NotificationListItem
              notification={item}
              displayTime={getDisplayTime(item.createdAt)}
              archiveLabel={archiveLabel}
              deleteLabel={deleteLabel}
              archiveConfirmTitle={archiveConfirmTitle}
              archiveConfirmDescription={archiveConfirmDescription}
              deleteConfirmTitle={deleteConfirmTitle}
              deleteConfirmDescription={deleteConfirmDescription}
              cancelLabel={cancelLabel}
              archivingLabel={archivingLabel}
              deletingLabel={deletingLabel}
              isArchiving={archivingId === item.id}
              isDeleting={deletingId === item.id}
              showArchiveAction={showArchiveAction}
              onSelect={onSelect}
              onArchive={onArchive}
              onDelete={onDelete}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
