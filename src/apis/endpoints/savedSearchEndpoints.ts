export type SavedSearchListQuery = {
  page: number;
  pageSize: number;
};

export const savedSearchEndpoints = {
  CREATE: "/saved-searches",
  DETAIL: (id: string): string =>
    `/saved-searches/${encodeURIComponent(id)}`,
  UPDATE: (id: string): string =>
    `/saved-searches/${encodeURIComponent(id)}`,
  DELETE: (id: string): string =>
    `/saved-searches/${encodeURIComponent(id)}`,
  LIST: ({ page, pageSize }: SavedSearchListQuery): string => {
    const search = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
    });

    return `/saved-searches?${search.toString()}`;
  },
} as const;
