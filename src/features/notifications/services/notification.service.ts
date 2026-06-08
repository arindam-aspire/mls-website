import { apiClient } from "@/src/apis/clients/api.client";
import { notificationEndpoints } from "@/src/apis/endpoints/notificationEndpoints";
import type {
  ArchiveNotificationResponse,
  DeleteNotificationResponse,
  MarkAllNotificationsReadResponse,
  MarkNotificationReadResponse,
  NotificationListParams,
  NotificationListResponse,
  NotificationUnreadCountResponse,
  UnarchiveNotificationResponse,
} from "../types/notification.types";

export async function getNotifications(
  params: NotificationListParams,
): Promise<NotificationListResponse> {
  return apiClient.request<NotificationListResponse>({
    endpoint: notificationEndpoints.LIST(params),
    method: "GET",
    auth: true,
  });
}

export async function getUnreadNotificationCount(): Promise<NotificationUnreadCountResponse> {
  return apiClient.request<NotificationUnreadCountResponse>({
    endpoint: notificationEndpoints.UNREAD_COUNT,
    method: "GET",
    auth: true,
  });
}

export async function markNotificationRead(
  id: string,
): Promise<MarkNotificationReadResponse> {
  return apiClient.request<MarkNotificationReadResponse>({
    endpoint: notificationEndpoints.MARK_READ(id),
    method: "PUT",
    auth: true,
  });
}

export async function markAllNotificationsRead(): Promise<MarkAllNotificationsReadResponse> {
  return apiClient.request<MarkAllNotificationsReadResponse>({
    endpoint: notificationEndpoints.MARK_ALL_READ,
    method: "PUT",
    auth: true,
  });
}

export async function archiveNotification(
  id: string,
): Promise<ArchiveNotificationResponse> {
  return apiClient.request<ArchiveNotificationResponse>({
    endpoint: notificationEndpoints.ARCHIVE(id),
    method: "POST",
    auth: true,
  });
}

export async function unarchiveNotification(
  id: string,
): Promise<UnarchiveNotificationResponse> {
  return apiClient.request<UnarchiveNotificationResponse>({
    endpoint: notificationEndpoints.UNARCHIVE(id),
    method: "POST",
    auth: true,
  });
}

export async function deleteNotification(
  id: string,
): Promise<DeleteNotificationResponse> {
  return apiClient.request<DeleteNotificationResponse>({
    endpoint: notificationEndpoints.DELETE(id),
    method: "DELETE",
    auth: true,
  });
}
