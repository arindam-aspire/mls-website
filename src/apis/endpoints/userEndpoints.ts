export const userEndpoints = {
  RECENT_VIEWS: "/users/recent-views",
  RECENT_VIEWS_LIST: (params: { page: number; pageSize: number }): string => {
    const search = new URLSearchParams({
      page: String(params.page),
      pageSize: String(params.pageSize),
    });

    return `/users/recent-views?${search.toString()}`;
  },
  RECENT_VIEW_REMOVE: (propertyId: string | number): string =>
    `/users/recent-views/${encodeURIComponent(String(propertyId))}`,
} as const;
