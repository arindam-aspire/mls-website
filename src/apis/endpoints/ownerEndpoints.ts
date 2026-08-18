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
  search?: string;
  status?: string;
  assignedAgentId?: string;
  propertyId?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortOrder?: OwnerListSortOrder;
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
  const search = new URLSearchParams({
    page: String(params.page),
    pageSize: String(params.pageSize),
  });

  if (params.search) search.set("search", params.search);
  if (params.status) search.set("status", params.status);
  if (params.assignedAgentId) {
    search.set("assigned_agent_id", params.assignedAgentId);
  }
  if (params.propertyId) search.set("property_id", params.propertyId);
  if (params.dateFrom) search.set("date_from", params.dateFrom);
  if (params.dateTo) search.set("date_to", params.dateTo);
  if (params.sortBy) search.set("sortBy", params.sortBy);
  if (params.sortOrder) search.set("sortOrder", params.sortOrder);

  return search.toString();
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
