import { buildSavedSearchPropertyListHref } from "@/src/features/saved-searches/utils/buildSavedSearchPropertyListHref";
import { NOTIFICATION_EVENT_TYPE } from "../constants/notification.constants";
import type { NotificationRecord } from "../types/notification.types";

function resolveSavedSearchId(notification: NotificationRecord): string | null {
  const fromMetadata = notification.data?.metadata?.saved_search_id?.trim();
  if (fromMetadata) {
    return fromMetadata;
  }

  const fromEntityId = notification.data?.entity_id?.trim();
  if (fromEntityId) {
    return fromEntityId;
  }

  return null;
}

export function resolveNotificationHref(notification: NotificationRecord): string {
  if (notification.eventType === NOTIFICATION_EVENT_TYPE.SAVED_SEARCH_CREATED) {
    const savedSearchId = resolveSavedSearchId(notification);
    if (savedSearchId) {
      return buildSavedSearchPropertyListHref(savedSearchId);
    }
  }

  const redirectPath = notification.data?.metadata?.redirect_path?.trim();
  if (redirectPath) {
    return redirectPath;
  }

  const fromActionUrl = notification.actionUrl?.trim();
  if (fromActionUrl) {
    return fromActionUrl;
  }

  const fromPayload = notification.data?.action_url?.trim();
  if (fromPayload) {
    return fromPayload;
  }

  if (notification.typeKey === "property_submission_created") {
    return "/manage-listings";
  }

  if (notification.typeKey?.startsWith("property_submission_")) {
    return "/my-listings";
  }

  return "/";
}
