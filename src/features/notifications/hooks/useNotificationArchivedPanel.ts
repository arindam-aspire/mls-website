"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/src/i18n/navigation";
import type { AppLocale } from "@/src/i18n/routing";
import {
  NOTIFICATION_LIST_PAGE,
  NOTIFICATION_LIST_PAGE_SIZE,
} from "../constants/notification.constants";
import {
  useGetNotifications,
  useMarkNotificationRead,
  useUnarchiveNotification,
} from "../mutations/notification.mutation";
import type { NotificationListParams, NotificationRecord } from "../types/notification.types";
import { formatNotificationListTime } from "../utils/formatNotificationListTime";
import { resolveNotificationHref } from "../utils/resolveNotificationHref";

type UseNotificationArchivedPanelParams = {
  open: boolean;
  onClose: () => void;
};

function isArchivedNotification(notification: NotificationRecord): boolean {
  return notification.archivedAt != null && notification.archivedAt.trim() !== "";
}

export function useNotificationArchivedPanel({
  open,
  onClose,
}: UseNotificationArchivedPanelParams) {
  const router = useRouter();
  const locale = useLocale() as AppLocale;
  const t = useTranslations("notifications");

  const [page, setPage] = useState(NOTIFICATION_LIST_PAGE);
  const [unarchivingId, setUnarchivingId] = useState<string | null>(null);

  const listParams = useMemo(
    (): NotificationListParams => ({
      page,
      pageSize: NOTIFICATION_LIST_PAGE_SIZE,
      includeArchived: true,
    }),
    [page],
  );

  const { data, isPending, isFetching, isError } = useGetNotifications(listParams, {
    enabled: open,
  });

  const { mutateAsync: markReadAsync } = useMarkNotificationRead();
  const { mutate: unarchiveNotification } = useUnarchiveNotification();

  const items = useMemo(() => {
    const rawItems = data?.data?.items ?? [];

    return rawItems
      .filter(isArchivedNotification)
      .sort(
        (left, right) =>
          new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
      );
  }, [data?.data?.items]);

  const isLoading = open && (isPending || isFetching);

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

  const onPageChange = useCallback((nextPage: number) => {
    setPage(nextPage);
  }, []);

  const onClosePanel = useCallback(() => {
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!open) {
      setPage(NOTIFICATION_LIST_PAGE);
    }
  }, [open]);

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

      onClose();
      router.push(href);
    },
    [markReadAsync, onClose, router],
  );

  const onUnarchiveNotification = useCallback(
    (notification: NotificationRecord) => {
      if (unarchivingId) {
        return;
      }

      setUnarchivingId(notification.id);

      unarchiveNotification(notification.id, {
        onSettled: () => {
          setUnarchivingId(null);
        },
      });
    },
    [unarchiveNotification, unarchivingId],
  );

  return {
    title: t("archived"),
    listAriaLabel: t("archivedListAriaLabel"),
    closePanelAriaLabel: t("closePanelAriaLabel"),
    loadErrorMessage: t("loadError"),
    emptyTitle: t("archivedEmptyTitle"),
    emptyDescription: t("archivedEmptyDescription"),
    unarchiveLabel: t("unarchive"),
    paginationPreviousLabel: t("paginationPrevious"),
    paginationNextLabel: t("paginationNext"),
    paginationPageLabel: t("paginationPage", {
      page: pagination.page,
      totalPages: Math.max(pagination.totalPages, 1),
    }),
    items,
    unarchivingId,
    isLoading,
    isError,
    isEmpty: open && !isLoading && !isError && items.length === 0,
    pagination,
    getDisplayTime,
    onClosePanel,
    onPageChange,
    onSelectNotification,
    onUnarchiveNotification,
  };
}
