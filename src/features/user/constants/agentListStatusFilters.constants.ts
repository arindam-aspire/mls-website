export const AGENT_LIST_STATUS_FILTER_VALUES = [
  "active",
  "inactive",
  "invited",
  "pendingPassword",
  "pending",
  "declined",
] as const;

export type AgentListStatusFilterValue =
  (typeof AGENT_LIST_STATUS_FILTER_VALUES)[number];

/** UI filter value → `GET /agents` `status` query param (uppercase API enum). */
export const AGENT_LIST_STATUS_FILTER_TO_API_STATUS: Record<
  AgentListStatusFilterValue,
  string
> = {
  active: "ACTIVE",
  inactive: "INACTIVE",
  invited: "INVITED",
  pendingPassword: "PENDING_PASSWORD",
  pending: "PENDING_REVIEW",
  declined: "DECLINED",
};

export function isAgentListStatusFilterValue(
  value: string,
): value is AgentListStatusFilterValue {
  return (AGENT_LIST_STATUS_FILTER_VALUES as readonly string[]).includes(value);
}
