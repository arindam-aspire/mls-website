import { apiClient } from "@/src/apis/clients/api.client";
import { agentEndpoints } from "@/src/apis/endpoints/agentEndpoints";
import {
  AGENT_LIST_SORT_BY,
  AGENT_LIST_SORT_ORDER,
  DEFAULT_AGENT_LIST_PAGE,
  DEFAULT_AGENT_LIST_PAGE_SIZE,
} from "../constants/agentList.constants";
import type {
  AgentListParams,
  AgentListResponse,
  NormalizedAgentListResponse,
} from "../types/agent.types";

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
