import type { AgentListItem } from "../types/agent.types";

export function filterAgentsByStatus(
  agents: AgentListItem[],
  status: string,
): AgentListItem[] {
  if (!status) {
    return agents;
  }

  return agents.filter((agent) => {
    const normalizedStatus = agent.status.trim().toUpperCase();

    switch (status) {
      case "active":
        return normalizedStatus === "ACTIVE";
      case "inactive":
        return normalizedStatus === "INACTIVE";
      case "invited":
        return Boolean(agent.invitedAt) && !agent.reviewedAt;
      case "pending":
        return (
          normalizedStatus === "PENDING_REVIEW" ||
          normalizedStatus === "PENDING" ||
          normalizedStatus === "PENDING_APPROVAL"
        );
      case "declined":
        return normalizedStatus === "DECLINED";
      default:
        return true;
    }
  });
}
