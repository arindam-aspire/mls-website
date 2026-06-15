export type AgentStatus = "ACTIVE" | "PENDING_REVIEW" | string;

/** Single row from `GET /agents` (`data.agents[]`). */
export type AgentListItem = {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  serviceArea: string;
  status: AgentStatus;
  invitedAt: string | null;
  invitedBy: string | null;
  formSubmittedAt: string | null;
  reviewedAt: string | null;
  declineReason: string | null;
};

export type AgentListPagination = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
};

export type AgentListParams = {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

export type AgentListResponse = {
  success: boolean;
  message: string | null;
  data: {
    agents: AgentListItem[];
    pagination: AgentListPagination;
  } | null;
  error: unknown;
  meta?: {
    pagination?: AgentListPagination;
  };
};

export type NormalizedAgentListResponse = {
  agents: AgentListItem[];
  pagination: AgentListPagination;
};
