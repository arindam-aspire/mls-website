export type AgentListSortOrder = "asc" | "desc";

export type AgentListQueryParams = {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: AgentListSortOrder;
  search?: string;
  status?: string;
};

export const agentEndpoints = {
  LIST: (params: AgentListQueryParams): string => {
    const search = new URLSearchParams({
      page: String(params.page),
      pageSize: String(params.pageSize),
    });

    if (params.sortBy) {
      search.set("sortBy", params.sortBy);
    }

    if (params.sortOrder) {
      search.set("sortOrder", params.sortOrder);
    }

    if (params.search) {
      search.set("search", params.search);
    }

    if (params.status) {
      search.set("status", params.status);
    }

    return `/agents?${search.toString()}`;
  },
  SUMMARY: "/agents/summary",
  INVITE: "/agents/invite",
  VALIDATE_INVITATION: (token: string) =>
    `/agents/invitations/validate?token=${encodeURIComponent(token)}`,
  ACCEPT_INVITATION: "/agents/invitations/accept",
  MANUAL_ONBOARD: "/agents/manual-onboard",
  RESEND_INVITATION: (agentId: string) => `/agents/${agentId}/resend-invitation`,
  DELETE: (agentId: string) => `/agents/${agentId}`,
} as const;
