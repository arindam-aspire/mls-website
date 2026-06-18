export type OwnerListSortOrder = "asc" | "desc";

export type OwnerListQueryParams = {
  page: number;
  pageSize: number;
  search?: string;
  status?: string;
};

export const ownerEndpoints = {
  LIST: (agencyId: string, params: OwnerListQueryParams): string => {
    const search = new URLSearchParams({
      page: String(params.page),
      pageSize: String(params.pageSize),
    });

    if (params.search) {
      search.set("search", params.search);
    }

    if (params.status) {
      search.set("status", params.status);
    }

    return `/agency/${agencyId}/owners?${search.toString()}`;
  },
} as const;
