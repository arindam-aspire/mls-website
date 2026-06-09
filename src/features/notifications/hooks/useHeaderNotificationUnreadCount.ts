"use client";

import { useMemo } from "react";
import { useGetUnreadNotificationCount } from "../mutations/notification.mutation";

type UseHeaderNotificationUnreadCountParams = {
  /** When true, fetches unread count (e.g. logged-in user ready in header). */
  enabled?: boolean;
};

export function useHeaderNotificationUnreadCount({
  enabled = false,
}: UseHeaderNotificationUnreadCountParams = {}) {
  const { data } = useGetUnreadNotificationCount({ enabled });

  const unreadCount = enabled ? (data?.data?.unreadCount ?? 0) : 0;

  const hasUnread = useMemo(() => unreadCount > 0, [unreadCount]);

  return {
    unreadCount,
    hasUnread,
  };
}
