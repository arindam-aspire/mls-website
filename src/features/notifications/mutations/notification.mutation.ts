"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import type { ApiError } from "@/src/apis/core/error.normalizer";
import { useToast } from "@/src/hooks/useToast";
import {
  NOTIFICATION_POPOVER_INCLUDE_ARCHIVED,
  NOTIFICATION_POPOVER_PAGE,
  NOTIFICATION_POPOVER_PAGE_SIZE,
  NOTIFICATIONS_QUERY_KEY,
  NOTIFICATIONS_UNREAD_COUNT_QUERY_KEY,
  NOTIFICATIONS_UNREAD_COUNT_STALE_TIME_MS,
} from "../constants/notification.constants";
import {
  archiveNotification,
  deleteNotification,
  getNotifications,
  getUnreadNotificationCount,
  markAllNotificationsRead,
  markNotificationRead,
  unarchiveNotification,
} from "../services/notification.service";
import type { NotificationListParams } from "../types/notification.types";

export function useGetNotifications(
  params: NotificationListParams,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: [
      NOTIFICATIONS_QUERY_KEY,
      params.page,
      params.pageSize,
      params.includeArchived,
    ],
    queryFn: () => getNotifications(params),
    enabled: options?.enabled ?? true,
  });
}

export function useGetUnreadNotificationCount(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: NOTIFICATIONS_UNREAD_COUNT_QUERY_KEY,
    queryFn: getUnreadNotificationCount,
    enabled: options?.enabled ?? true,
    staleTime: NOTIFICATIONS_UNREAD_COUNT_STALE_TIME_MS,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

export function useMarkNotificationRead() {
  const t = useTranslations("notifications");
  const toast = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markNotificationRead,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [NOTIFICATIONS_QUERY_KEY] });
      void queryClient.invalidateQueries({
        queryKey: NOTIFICATIONS_UNREAD_COUNT_QUERY_KEY,
      });
    },
    onError: (error: ApiError) => {
      toast.error(t("markReadErrorTitle"), {
        description: error.message,
      });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const t = useTranslations("notifications");
  const toast = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [NOTIFICATIONS_QUERY_KEY] });
      void queryClient.invalidateQueries({
        queryKey: NOTIFICATIONS_UNREAD_COUNT_QUERY_KEY,
      });
    },
    onError: (error: ApiError) => {
      toast.error(t("markReadErrorTitle"), {
        description: error.message,
      });
    },
  });
}

export function useArchiveNotification() {
  const t = useTranslations("notifications");
  const toast = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: archiveNotification,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [NOTIFICATIONS_QUERY_KEY] });
      toast.success(t("archiveSuccessTitle"));
    },
    onError: (error: ApiError) => {
      toast.error(t("archiveErrorTitle"), {
        description: error.message,
      });
    },
  });
}

export function useUnarchiveNotification() {
  const t = useTranslations("notifications");
  const toast = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: unarchiveNotification,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [NOTIFICATIONS_QUERY_KEY] });
      toast.success(t("unarchiveSuccessTitle"));
    },
    onError: (error: ApiError) => {
      toast.error(t("unarchiveErrorTitle"), {
        description: error.message,
      });
    },
  });
}

export function useDeleteNotification() {
  const t = useTranslations("notifications");
  const toast = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteNotification,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [NOTIFICATIONS_QUERY_KEY] });
      void queryClient.invalidateQueries({
        queryKey: NOTIFICATIONS_UNREAD_COUNT_QUERY_KEY,
      });
      toast.success(t("deleteSuccessTitle"));
    },
    onError: (error: ApiError) => {
      toast.error(t("deleteErrorTitle"), {
        description: error.message,
      });
    },
  });
}

export const notificationPopoverListParams = {
  page: NOTIFICATION_POPOVER_PAGE,
  pageSize: NOTIFICATION_POPOVER_PAGE_SIZE,
  includeArchived: NOTIFICATION_POPOVER_INCLUDE_ARCHIVED,
} as const;
