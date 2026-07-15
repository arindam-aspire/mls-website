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
  /** Public profile submit — deployed API path (`/invitations/submit` is an optional alias). */
  SUBMIT_INVITATION: "/agents/onboarding",
  ACCEPT_INVITATION: "/agents/invitations/accept",
  PASSWORD_SETUP: "/agents/password/setup",
  MANUAL_ONBOARD: "/agents/manual-onboard",
  RESEND_INVITATION: (agentId: string) => `/agents/${agentId}/resend-invitation`,
  UPDATE_STATUS: (agentId: string) => `/agents/${agentId}/status`,
  DELETE: (agentId: string) => `/agents/${agentId}`,
} as const;
