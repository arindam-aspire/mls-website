"use client";

import { useCallback, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/src/i18n/navigation";
import type { AppLocale } from "@/src/i18n/routing";
import {
  NOTIFICATION_LIST_PAGE,
  NOTIFICATION_LIST_PAGE_SIZE,
} from "../constants/notification.constants";
import { buildNotificationGroupLabels } from "../i18n/buildNotificationGroupLabels";
import {
  useArchiveNotification,
  useDeleteNotification,
  useGetNotifications,
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
} from "../mutations/notification.mutation";
import type { NotificationListParams, NotificationRecord } from "../types/notification.types";
import { formatNotificationListTime } from "../utils/formatNotificationListTime";
import { groupNotificationsByTime } from "../utils/groupNotificationsByTime";
import { resolveNotificationHref } from "../utils/resolveNotificationHref";
import { useHeaderNotificationUnreadCount } from "./useHeaderNotificationUnreadCount";

export function useNotificationScreen() {
  const router = useRouter();
  const locale = useLocale() as AppLocale;
  const t = useTranslations("notifications");

  const [isArchivedPanelOpen, setIsArchivedPanelOpen] = useState(false);
  const [page, setPage] = useState(NOTIFICATION_LIST_PAGE);
  const [archivingId, setArchivingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const listParams = useMemo(
    (): NotificationListParams => ({
      page,
      pageSize: NOTIFICATION_LIST_PAGE_SIZE,
      includeArchived: false,
    }),
    [page],
  );

  const { data, isPending, isFetching, isError } = useGetNotifications(listParams);

  const { hasUnread } = useHeaderNotificationUnreadCount({ enabled: true });
  const { mutate: markAllRead, isPending: isMarkingAllRead } =
    useMarkAllNotificationsRead();
  const { mutateAsync: markReadAsync } = useMarkNotificationRead();
  const { mutate: archiveNotification } = useArchiveNotification();
  const { mutate: deleteNotification } = useDeleteNotification();

  const items = useMemo(() => data?.data?.items ?? [], [data?.data?.items]);

  const groupLabels = useMemo(() => buildNotificationGroupLabels(t), [t]);

  const groupedNotifications = useMemo(
    () => groupNotificationsByTime(items, locale, groupLabels),
    [groupLabels, items, locale],
  );

  const hasUnreadInList = useMemo(
    () => items.some((item) => !item.isRead),
    [items],
  );

  const canMarkAllAsRead = hasUnread || hasUnreadInList;
  const isLoading = isPending || isFetching;

  const pagination = useMemo(
    () => ({
      page: data?.data?.page ?? page,
      pageSize: data?.data?.pageSize ?? NOTIFICATION_LIST_PAGE_SIZE,
      total: data?.data?.total ?? 0,
      totalPages: data?.data?.totalPages ?? 0,
      hasNext: data?.data?.hasNext ?? false,
      hasPrevious: data?.data?.hasPrevious ?? false,
    }),
    [data?.data, page],
  );

  const getDisplayTime = useCallback(
    (isoDate: string) => formatNotificationListTime(isoDate, locale),
    [locale],
  );

  const onMarkAllAsRead = useCallback(() => {
    if (!canMarkAllAsRead || isMarkingAllRead) {
      return;
    }

    markAllRead();
  }, [canMarkAllAsRead, isMarkingAllRead, markAllRead]);

  const onOpenArchivedPanel = useCallback(() => {
    setIsArchivedPanelOpen(true);
  }, []);

  const onCloseArchivedPanel = useCallback(() => {
    setIsArchivedPanelOpen(false);
  }, []);

  const onPageChange = useCallback((nextPage: number) => {
    setPage(nextPage);
  }, []);

  const onSelectNotification = useCallback(
    async (notification: NotificationRecord) => {
      const href = resolveNotificationHref(notification);

      if (!notification.isRead) {
        try {
          await markReadAsync(notification.id);
        } catch {
          return;
        }
      }

      router.push(href);
    },
    [markReadAsync, router],
  );

  const onArchiveNotification = useCallback(
    (
      notification: NotificationRecord,
      options?: { onSuccess?: () => void },
    ) => {
      if (notification.archivedAt || archivingId) {
        return;
      }

      setArchivingId(notification.id);

      archiveNotification(notification.id, {
        onSuccess: () => {
          options?.onSuccess?.();
        },
        onSettled: () => {
          setArchivingId(null);
        },
      });
    },
    [archiveNotification, archivingId],
  );

  const onDeleteNotification = useCallback(
    (
      notification: NotificationRecord,
      options?: { onSuccess?: () => void },
    ) => {
      if (deletingId) {
        return;
      }

      setDeletingId(notification.id);

      deleteNotification(notification.id, {
        onSuccess: () => {
          options?.onSuccess?.();
        },
        onSettled: () => {
          setDeletingId(null);
        },
      });
    },
    [deleteNotification, deletingId],
  );

  return {
    title: t("pageTitle"),
    subtitle: t("pageSubtitle"),
    markAllAsReadLabel: t("markAllRead"),
    archivedLabel: t("archived"),
    archiveLabel: t("archive"),
    deleteLabel: t("delete"),
    listAriaLabel: t("listAriaLabel"),
    loadErrorMessage: t("loadError"),
    emptyTitle: t("emptyTitle"),
    emptyDescription: t("emptyDescription"),
    deleteConfirmTitle: t("deleteConfirmTitle"),
    deleteConfirmDescription: t("deleteConfirmDescription"),
    archiveConfirmTitle: t("archiveConfirmTitle"),
    archiveConfirmDescription: t("archiveConfirmDescription"),
    cancelLabel: t("cancel"),
    archivingLabel: t("archiving"),
    deletingLabel: t("deleting"),
    paginationPreviousLabel: t("paginationPrevious"),
    paginationNextLabel: t("paginationNext"),
    paginationPageLabel: t("paginationPage", {
      page: pagination.page,
      totalPages: Math.max(pagination.totalPages, 1),
    }),
    isArchivedPanelOpen,
    canMarkAllAsRead,
    isMarkingAllRead,
    groupedNotifications,
    archivingId,
    deletingId,
    isLoading,
    isError,
    isEmpty: !isLoading && !isError && items.length === 0,
    pagination,
    getDisplayTime,
    onMarkAllAsRead,
    onOpenArchivedPanel,
    onCloseArchivedPanel,
    onPageChange,
    onSelectNotification,
    onArchiveNotification,
    onDeleteNotification,
  };
}
