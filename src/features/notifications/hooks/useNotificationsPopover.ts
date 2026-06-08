"use client";

import { useCallback, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/src/i18n/navigation";
import type { AppLocale } from "@/src/i18n/routing";
import { NOTIFICATION_POPOVER_PAGE_SIZE } from "../constants/notification.constants";
import {
  notificationPopoverListParams,
  useGetNotifications,
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
} from "../mutations/notification.mutation";
import type { NotificationRecord } from "../types/notification.types";
import { formatNotificationRelativeTime } from "../utils/formatNotificationRelativeTime";
import { resolveNotificationHref } from "../utils/resolveNotificationHref";

type UseNotificationsPopoverParams = {
  enabled?: boolean;
  hasUnread?: boolean;
};

export function useNotificationsPopover({
  enabled = true,
  hasUnread = false,
}: UseNotificationsPopoverParams = {}) {
  const t = useTranslations("notifications");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const locale = useLocale() as AppLocale;
  const [hasOpened, setHasOpened] = useState(false);

  const { data, isPending, isFetching, isError, refetch } = useGetNotifications(
    notificationPopoverListParams,
    { enabled: enabled && hasOpened },
  );

  const { mutateAsync: markReadAsync } = useMarkNotificationRead();
  const { mutate: markAllRead, isPending: isMarkingAllRead } =
    useMarkAllNotificationsRead();

  const items = useMemo(
    () => (data?.data?.items ?? []).slice(0, NOTIFICATION_POPOVER_PAGE_SIZE),
    [data?.data?.items],
  );

  const isLoading = hasOpened && enabled && (isPending || isFetching);

  const onOpen = useCallback(() => {
    if (!hasOpened) {
      setHasOpened(true);
      return;
    }

    void refetch();
  }, [hasOpened, refetch]);

  const getRelativeTime = useCallback(
    (isoDate: string) => formatNotificationRelativeTime(isoDate, locale),
    [locale],
  );

  const onMarkAllAsRead = useCallback(() => {
    if (!hasUnread || isMarkingAllRead) {
      return;
    }

    markAllRead();
  }, [hasUnread, isMarkingAllRead, markAllRead]);

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

  return {
    notificationsAriaLabel: tCommon("notifications"),
    popoverTitle: t("popoverTitle"),
    markAllAsReadLabel: t("markAllRead"),
    listAriaLabel: t("listAriaLabel"),
    emptyTitle: t("popoverEmptyTitle"),
    emptyDescription: t("popoverEmptyDescription"),
    seeAllNotificationsLabel: t("popoverSeeAll"),
    loadErrorMessage: t("popoverLoadError"),
    items,
    showMarkAllAsRead: hasOpened && !isLoading && !isError,
    isMarkingAllRead,
    isLoading,
    isError,
    isEmpty: hasOpened && enabled && !isLoading && !isError && items.length === 0,
    onOpen,
    onMarkAllAsRead,
    onSelectNotification,
    getRelativeTime,
  };
}
