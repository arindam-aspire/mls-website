export const userEndpoints = {
  RECENT_VIEWS_LIST: (params: { page: number; pageSize: number }): string => {
    const search = new URLSearchParams({
      page: String(params.page),
      pageSize: String(params.pageSize),
    });

    return `/users/recent-views?${search.toString()}`;
  },
} as const;
