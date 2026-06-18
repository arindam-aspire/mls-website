import { AGENT_ASSIGNABLE_STATUS } from "../constants/agentList.constants";
import type { AgentListItem } from "../types/agent.types";

export function filterActiveAgents(agents: AgentListItem[]): AgentListItem[] {
  return agents.filter(
    (agent) => agent.status.trim().toUpperCase() === AGENT_ASSIGNABLE_STATUS,
  );
}
