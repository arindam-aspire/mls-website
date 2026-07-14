export type LeadListSortOrder = "asc" | "desc";

export type LeadListQueryParams = {
  page: number;
  pageSize: number;
  status?: string;
  search?: string;
  assignedAgentId?: string;
  propertyId?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortOrder?: LeadListSortOrder;
};

function appendOptional(
  search: URLSearchParams,
  key: string,
  value: string | undefined,
) {
  if (value) {
    search.set(key, value);
  }
}

export const leadEndpoints = {
  LIST: (params: LeadListQueryParams): string => {
    const search = new URLSearchParams({
      page: String(params.page),
      pageSize: String(params.pageSize),
    });

    appendOptional(search, "status", params.status);
    appendOptional(search, "search", params.search);
    appendOptional(search, "assigned_agent_id", params.assignedAgentId);
    appendOptional(search, "property_id", params.propertyId);
    appendOptional(search, "date_from", params.dateFrom);
    appendOptional(search, "date_to", params.dateTo);
    appendOptional(search, "sortBy", params.sortBy);
    appendOptional(search, "sortOrder", params.sortOrder);

    return `/leads?${search.toString()}`;
  },
  DETAIL: (leadId: string) => `/leads/${encodeURIComponent(leadId)}`,
  CREATE: "/leads",
  ASSIGN: (leadId: string) => `/leads/${encodeURIComponent(leadId)}/assign`,
  STATUS: (leadId: string) => `/leads/${encodeURIComponent(leadId)}/status`,
  REQUEST_CLOSE: (leadId: string) =>
    `/leads/${encodeURIComponent(leadId)}/request-close`,
  CLOSE: (leadId: string) => `/leads/${encodeURIComponent(leadId)}/close`,
  NOTES: (leadId: string) => `/leads/${encodeURIComponent(leadId)}/notes`,
  MESSAGES: (leadId: string) => `/leads/${encodeURIComponent(leadId)}/messages`,
  /** Optional listing endpoints — document as API gaps if backend lacks them. */
  NOTES_LIST: (leadId: string) => `/leads/${encodeURIComponent(leadId)}/notes`,
  MESSAGES_LIST: (leadId: string) =>
    `/leads/${encodeURIComponent(leadId)}/messages`,
  ACTIVITY: (leadId: string) => `/leads/${encodeURIComponent(leadId)}/activity`,
} as const;
