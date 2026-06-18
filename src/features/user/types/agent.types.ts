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
  search?: string;
  status?: string;
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

export type AgentSummaryLastAgentMetadata = {
  email: string;
  userCreatedAt: string;
  cognitoSub: string;
  serviceArea: string;
  statusReason: string | null;
  declineReason: string | null;
  reviewedAt: string | null;
  reviewedBy: string | null;
  formSubmittedAt: string | null;
  passwordSetAt: string | null;
  approvedAt: string | null;
  approvedBy: string | null;
};

export type AgentSummaryLastAgent = {
  agentId: string;
  agentName: string;
  profileStatus: string;
  userIsActive: boolean;
  assignments: unknown[];
  latestInvite: unknown | null;
  metadata: AgentSummaryLastAgentMetadata;
};

export type AgentSummaryData = {
  totalAgents: number;
  activeAgents: number;
  pendingInvites: number;
  pendingReview: number;
  declined: number;
  lastFiveAgents: AgentSummaryLastAgent[];
};

export type AgentSummaryResponse = {
  success: boolean;
  message: string | null;
  data: AgentSummaryData | null;
  error: unknown;
  meta: Record<string, unknown>;
};

export type AgentInviteRequest = {
  email: string;
};

export type AgentInviteData = {
  id: string;
  email: string;
  status: string;
  inviteLink: string;
  invitedAt: string;
  invitedBy: string;
};

export type AgentInviteResult = {
  invite: AgentInviteData;
  message: string;
};

export type AgentInviteResponse = {
  success: boolean;
  message: string | null;
  data: AgentInviteData | null;
  error: unknown;
  meta: Record<string, unknown>;
};

export type ManualOnboardAgentRequest = {
  fullName: string;
  email: string;
  phone: string;
  serviceArea: string;
};

export type ManualOnboardAgentData = {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  serviceArea: string;
  status: string;
  temporaryPassword: string;
};

export type ManualOnboardAgentResult = {
  agent: ManualOnboardAgentData;
  message: string;
};

export type ManualOnboardAgentResponse = {
  success: boolean;
  message: string | null;
  data: ManualOnboardAgentData | null;
  error: unknown;
  meta: Record<string, unknown>;
};

export type AgentResendInvitationResult = AgentInviteResult;

export type AgentResendInvitationResponse = AgentInviteResponse;

export type DeleteAgentResult = {
  message: string;
};

export type DeleteAgentResponse = {
  success: boolean;
  message: string | null;
  data: unknown;
  error: unknown;
  meta: Record<string, unknown>;
};
