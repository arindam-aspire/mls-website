export type OwnerListSortOrder = "asc" | "desc";

export type OwnerListQueryParams = {
  page: number;
  pageSize: number;
  search?: string;
  status?: string;
  agencyId?: string;
};

function buildOwnerListSearch(params: OwnerListQueryParams): string {
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

  if (params.agencyId) {
    search.set("agencyId", params.agencyId);
  }

  return search.toString();
}

export const ownerEndpoints = {
  LIST: (agencyId: string, params: OwnerListQueryParams): string => {
    return `/agency/${agencyId}/owners?${buildOwnerListSearch(params)}`;
  },
  PLATFORM_LIST: (params: OwnerListQueryParams): string =>
    `/agency/owners?${buildOwnerListSearch(params)}`,
  ASSIGN_AGENCY: (ownerId: string): string => `/agency/owners/${ownerId}/agency`,
} as const;
