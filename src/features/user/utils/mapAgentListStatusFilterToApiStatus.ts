import {
  AGENT_LIST_STATUS_FILTER_TO_API_STATUS,
  isAgentListStatusFilterValue,
} from "../constants/agentListStatusFilters.constants";

export function mapAgentListStatusFilterToApiStatus(
  statusFilter: string,
): string | undefined {
  if (!isAgentListStatusFilterValue(statusFilter)) {
    return undefined;
  }

  return AGENT_LIST_STATUS_FILTER_TO_API_STATUS[statusFilter];
}
