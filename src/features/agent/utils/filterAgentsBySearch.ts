import type { AgentListItem } from "../types/agent.types";

export function filterAgentsBySearch(
  agents: AgentListItem[],
  query: string,
): AgentListItem[] {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return agents;
  }

  return agents.filter((agent) => {
    const haystack = [agent.fullName, agent.email, agent.phone, agent.serviceArea]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return haystack.includes(normalized);
  });
}
