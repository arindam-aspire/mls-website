import {
  AGENT_LIST_SORT_BY,
  AGENT_LIST_SORT_ORDER,
  DEFAULT_AGENT_LIST_PAGE,
  DEFAULT_AGENT_LIST_PAGE_SIZE,
} from "../constants/agentList.constants";
import type { AgentListParams } from "../types/agent.types";
import { mapAgentListStatusFilterToApiStatus } from "./mapAgentListStatusFilterToApiStatus";

type BuildAgentListRequestParamsInput = {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: AgentListParams["sortOrder"];
  search?: string;
  statusFilter?: string;
};

export function buildAgentListRequestParams({
  page = DEFAULT_AGENT_LIST_PAGE,
  pageSize = DEFAULT_AGENT_LIST_PAGE_SIZE,
  sortBy = AGENT_LIST_SORT_BY,
  sortOrder = AGENT_LIST_SORT_ORDER,
  search = "",
  statusFilter = "",
}: BuildAgentListRequestParamsInput = {}): AgentListParams {
  const trimmedSearch = search.trim();
  const apiStatus = mapAgentListStatusFilterToApiStatus(statusFilter);

  return {
    page,
    pageSize,
    sortBy,
    sortOrder,
    ...(trimmedSearch ? { search: trimmedSearch } : {}),
    ...(apiStatus ? { status: apiStatus } : {}),
  };
}
