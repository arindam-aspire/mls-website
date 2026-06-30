import { apiClient } from "@/src/apis/clients/api.client";
import { agentEndpoints } from "@/src/apis/endpoints/agentEndpoints";
import {
  AGENT_LIST_SORT_BY,
  AGENT_LIST_SORT_ORDER,
  DEFAULT_AGENT_LIST_PAGE,
  DEFAULT_AGENT_LIST_PAGE_SIZE,
} from "../constants/agentList.constants";
import type {
  AgentInviteRequest,
  AgentInviteResponse,
  AgentInviteResult,
  AgentInvitationAcceptRequest,
  AgentInvitationAcceptResponse,
  AgentInvitationPreview,
  AgentInvitationPreviewResponse,
  AgentListParams,
  AgentListResponse,
  AgentResendInvitationResponse,
  AgentResendInvitationResult,
  AgentSummaryData,
  AgentSummaryResponse,
  DeleteAgentResponse,
  DeleteAgentResult,
  ManualOnboardAgentRequest,
  ManualOnboardAgentResponse,
  ManualOnboardAgentResult,
  NormalizedAgentListResponse,
} from "../types/agent.types";
import { parseAgentInviteLink } from "../utils/parseAgentInviteLink";

export async function getAgentList(
  params: AgentListParams = {},
): Promise<NormalizedAgentListResponse> {
  const page = params.page ?? DEFAULT_AGENT_LIST_PAGE;
  const pageSize = params.pageSize ?? DEFAULT_AGENT_LIST_PAGE_SIZE;

  const response = await apiClient.request<AgentListResponse>({
    endpoint: agentEndpoints.LIST({
      page,
      pageSize,
      sortBy: params.sortBy ?? AGENT_LIST_SORT_BY,
      sortOrder: params.sortOrder ?? AGENT_LIST_SORT_ORDER,
      search: params.search,
      status: params.status,
    }),
    method: "GET",
    auth: true,
  });

  const data = response.data;
  const pagination =
    response.meta?.pagination ?? data?.pagination ?? {
      page,
      pageSize,
      total: data?.agents.length ?? 0,
      totalPages: 1,
      hasNext: false,
      hasPrevious: false,
    };

  return {
    agents: data?.agents ?? [],
    pagination,
  };
}

const EMPTY_AGENT_SUMMARY: AgentSummaryData = {
  totalAgents: 0,
  activeAgents: 0,
  pendingInvites: 0,
  pendingReview: 0,
  declined: 0,
  lastFiveAgents: [],
};

export async function getAgentSummary(): Promise<AgentSummaryData> {
  const response = await apiClient.request<AgentSummaryResponse>({
    endpoint: agentEndpoints.SUMMARY,
    method: "GET",
    auth: true,
  });

  return response.data ?? EMPTY_AGENT_SUMMARY;
}

export async function inviteAgentByEmail(
  body: AgentInviteRequest,
): Promise<AgentInviteResult> {
  const response = await apiClient.request<AgentInviteResponse>({
    endpoint: agentEndpoints.INVITE,
    method: "POST",
    auth: true,
    body,
  });

  if (!response.success || !response.data) {
    throw new Error(response.message ?? "Failed to send invitation");
  }

  return {
    message: response.message ?? "",
    invite: {
      ...response.data,
      inviteLink: parseAgentInviteLink(response.data.inviteLink),
    },
  };
}

export async function validateAgentInvitation(
  token: string,
): Promise<AgentInvitationPreview> {
  const response = await apiClient.request<AgentInvitationPreviewResponse>({
    endpoint: agentEndpoints.VALIDATE_INVITATION(token),
    method: "GET",
    auth: false,
  });

  if (!response.success || !response.data) {
    throw new Error(response.message ?? "Invitation link is invalid");
  }

  return response.data;
}

export async function acceptAgentInvitation(
  body: AgentInvitationAcceptRequest,
): Promise<string> {
  const response = await apiClient.request<AgentInvitationAcceptResponse>({
    endpoint: agentEndpoints.ACCEPT_INVITATION,
    method: "POST",
    auth: false,
    body,
  });

  if (!response.success || !response.data) {
    throw new Error(response.message ?? "Failed to activate agent account");
  }

  return response.message ?? "Agent account activated successfully";
}

export async function manualOnboardAgent(
  body: ManualOnboardAgentRequest,
): Promise<ManualOnboardAgentResult> {
  const response = await apiClient.request<ManualOnboardAgentResponse>({
    endpoint: agentEndpoints.MANUAL_ONBOARD,
    method: "POST",
    auth: true,
    body,
  });

  if (!response.success || !response.data) {
    throw new Error(response.message ?? "Failed to onboard agent");
  }

  return {
    message: response.message ?? "",
    agent: response.data,
  };
}

export async function resendAgentInvitation(
  agentId: string,
): Promise<AgentResendInvitationResult> {
  const response = await apiClient.request<AgentResendInvitationResponse>({
    endpoint: agentEndpoints.RESEND_INVITATION(agentId),
    method: "POST",
    auth: true,
  });

  if (!response.success || !response.data) {
    throw new Error(response.message ?? "Failed to resend invitation");
  }

  return {
    message: response.message ?? "",
    invite: {
      ...response.data,
      inviteLink: parseAgentInviteLink(response.data.inviteLink),
    },
  };
}

export async function deleteAgent(agentId: string): Promise<DeleteAgentResult> {
  const response = await apiClient.request<DeleteAgentResponse>({
    endpoint: agentEndpoints.DELETE(agentId),
    method: "DELETE",
    auth: true,
  });

  if (!response.success) {
    throw new Error(response.message ?? "Failed to delete agent");
  }

  return {
    message: response.message ?? "",
  };
}
