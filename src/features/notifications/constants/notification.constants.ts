export const NOTIFICATION_LIST_PAGE = 1;
export const NOTIFICATION_LIST_PAGE_SIZE = 10;

export const NOTIFICATION_POPOVER_PAGE = 1;
export const NOTIFICATION_POPOVER_PAGE_SIZE = 5;
export const NOTIFICATION_POPOVER_WIDTH_PX = 380;
export const NOTIFICATION_POPOVER_INCLUDE_ARCHIVED = false;

export const NOTIFICATIONS_QUERY_KEY = "notifications" as const;
export const NOTIFICATIONS_UNREAD_COUNT_QUERY_KEY = [
  NOTIFICATIONS_QUERY_KEY,
  "unread-count",
] as const;

/** Unread badge: fetch once per session; refresh only via query invalidation (mark read). */
export const NOTIFICATIONS_UNREAD_COUNT_STALE_TIME_MS = Number.POSITIVE_INFINITY;

export const NOTIFICATION_EVENT_TYPE = {
  SAVED_SEARCH_CREATED: "saved_search.created",
} as const;

export const notificationListParams = {
  page: NOTIFICATION_LIST_PAGE,
  pageSize: NOTIFICATION_LIST_PAGE_SIZE,
  includeArchived: false,
} as const;

export const notificationArchivedListParams = {
  page: NOTIFICATION_LIST_PAGE,
  pageSize: NOTIFICATION_LIST_PAGE_SIZE,
  includeArchived: true,
} as const;
