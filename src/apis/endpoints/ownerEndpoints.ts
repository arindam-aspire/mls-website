export type OwnerListSortOrder = "asc" | "desc";

export type OwnerListQueryParams = {
  page: number;
  pageSize: number;
  search?: string;
  status?: string;
  agencyId?: string;
};

export type OwnerLinkedListQueryParams = {
  page: number;
  pageSize: number;
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

function buildOwnerLinkedListSearch(params: OwnerLinkedListQueryParams): string {
  return new URLSearchParams({
    page: String(params.page),
    pageSize: String(params.pageSize),
  }).toString();
}

export const ownerEndpoints = {
  LIST: (agencyId: string, params: OwnerListQueryParams): string => {
    return `/agency/${agencyId}/owners?${buildOwnerListSearch(params)}`;
  },
  PLATFORM_LIST: (params: OwnerListQueryParams): string =>
    `/agency/owners?${buildOwnerListSearch(params)}`,
  ASSIGN_AGENCY: (ownerId: string): string => `/agency/owners/${ownerId}/agency`,
  DETAIL: (ownerId: string): string => `/agency/owners/${ownerId}`,
  UPDATE: (ownerId: string): string => `/agency/owners/${ownerId}`,
  UPDATE_STATUS: (ownerId: string): string => `/agency/owners/${ownerId}/status`,
  LINKED_PROPERTIES: (ownerId: string, params: OwnerLinkedListQueryParams): string =>
    `/agency/owners/${ownerId}/properties?${buildOwnerLinkedListSearch(params)}`,
  LINKED_LEADS: (ownerId: string, params: OwnerLinkedListQueryParams): string =>
    `/agency/owners/${ownerId}/leads?${buildOwnerLinkedListSearch(params)}`,
} as const;
