export type NotificationListQuery = {
  page: number;
  pageSize: number;
  includeArchived: boolean;
};

export const notificationEndpoints = {
  LIST: ({ page, pageSize, includeArchived }: NotificationListQuery): string => {
    const search = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
      includeArchived: String(includeArchived),
    });

    return `/notifications?${search.toString()}`;
  },
  MARK_READ: (id: string) => `/notifications/${encodeURIComponent(id)}/read`,
  MARK_ALL_READ: "/notifications/read-all",
  ARCHIVE: (id: string) => `/notifications/${encodeURIComponent(id)}/archive`,
  UNARCHIVE: (id: string) => `/notifications/${encodeURIComponent(id)}/unarchive`,
  DELETE: (id: string) => `/notifications/${encodeURIComponent(id)}`,
  UNREAD_COUNT: "/notifications/unread-count",
} as const;
