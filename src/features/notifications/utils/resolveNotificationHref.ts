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

function resolveLeadId(notification: NotificationRecord): string | null {
  const fromMetadata =
    notification.data?.metadata?.lead_id?.trim() ||
    notification.data?.metadata?.entity_id?.trim();
  if (fromMetadata) {
    return fromMetadata;
  }

  const fromEntityId = notification.data?.entity_id?.trim();
  if (fromEntityId) {
    return fromEntityId;
  }

  return null;
}

const LEAD_TYPE_KEY_PREFIXES = [
  "lead_",
  "LEAD_",
] as const;

export function resolveNotificationHref(notification: NotificationRecord): string {
  if (notification.eventType === NOTIFICATION_EVENT_TYPE.SAVED_SEARCH_CREATED) {
    const savedSearchId = resolveSavedSearchId(notification);
    if (savedSearchId) {
      return buildSavedSearchPropertyListHref(savedSearchId);
    }
  }

  const leadId = resolveLeadId(notification);
  const typeKey = notification.typeKey ?? "";
  const isLeadNotification =
    LEAD_TYPE_KEY_PREFIXES.some((prefix) => typeKey.startsWith(prefix)) ||
    typeKey.toUpperCase().startsWith("LEAD_");

  if (isLeadNotification) {
    if (leadId) {
      if (
        typeKey.toUpperCase().includes("MESSAGE") ||
        typeKey.toUpperCase().includes("LEAD_MESSAGE")
      ) {
        return `/leads/${leadId}?tab=conversation`;
      }
      if (
        typeKey.toUpperCase().includes("CLOSURE") ||
        typeKey.toUpperCase().includes("CLOSE")
      ) {
        return `/leads/${leadId}?tab=close`;
      }
      return `/leads/${leadId}`;
    }
    return "/leads";
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
