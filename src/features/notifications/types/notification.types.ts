export type NotificationMetadata = {
  redirect_path?: string;
  saved_search_id?: string;
  [key: string]: string | undefined;
};

export type NotificationPayload = {
  metadata?: NotificationMetadata;
  entity_id?: string;
  action_url?: string;
  entity_type?: string;
  search_name?: string;
  creator_name?: string;
};

export type NotificationRecord = {
  id: string;
  typeKey: string;
  eventType: string;
  title: string;
  message: string;
  actionUrl: string | null;
  isRead: boolean;
  createdAt: string;
  readAt: string | null;
  archivedAt: string | null;
  data: NotificationPayload | null;
};

export type NotificationListParams = {
  page: number;
  pageSize: number;
  includeArchived: boolean;
};

export type NotificationListData = {
  items: NotificationRecord[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
};

export type NotificationListResponse = {
  success: boolean;
  message: string | null;
  data: NotificationListData | null;
  error: unknown;
  meta: Record<string, unknown>;
};

export type MarkNotificationReadResponse = {
  success: boolean;
  message: string | null;
  data: NotificationRecord | null;
  error: unknown;
  meta: Record<string, unknown>;
};

export type MarkAllNotificationsReadData = {
  updated: number;
};

export type MarkAllNotificationsReadResponse = {
  success: boolean;
  message: string | null;
  data: MarkAllNotificationsReadData | null;
  error: unknown;
  meta: Record<string, unknown>;
};

export type NotificationUnreadCountData = {
  unreadCount: number;
};

export type NotificationUnreadCountResponse = {
  success: boolean;
  message: string | null;
  data: NotificationUnreadCountData | null;
  error: unknown;
  meta: Record<string, unknown>;
};

export type ArchiveNotificationResponse = {
  success: boolean;
  message: string | null;
  data: boolean | null;
  error: unknown;
  meta: Record<string, unknown>;
};

export type UnarchiveNotificationResponse = {
  success: boolean;
  message: string | null;
  data: boolean | null;
  error: unknown;
  meta: Record<string, unknown>;
};

export type DeleteNotificationResponse = {
  success: boolean;
  message: string | null;
  data: { id: string } | null;
  error: unknown;
  meta: Record<string, unknown>;
};
