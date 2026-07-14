import {
  mapAgentApiListingToAgent,
  mapAgentApiStatus,
  type Agent,
  type AgentStatus,
  type AgentStatusKey,
} from "@abdoun/abdoun-library";
import type { AgentListItem } from "../types/agent.types";

const AGENT_STATUS_KEY_OVERRIDES: Record<string, AgentStatusKey> = {
  PENDING_REVIEW: "pending",
};

export function resolveAgentActivityDate(agent: AgentListItem): string {
  return agent.reviewedAt ?? agent.invitedAt ?? "";
}

function mapAgentListStatus(status: string): AgentStatus {
  const normalized = status.trim().toUpperCase();
  const mapped = mapAgentApiStatus(status);
  const overrideKey = AGENT_STATUS_KEY_OVERRIDES[normalized];

  if (normalized === "PENDING_PASSWORD") {
    return {
      key: "pending",
      label: mapped.label,
    };
  }

  if (overrideKey) {
    return {
      key: overrideKey,
      label: mapped.label,
    };
  }

  return mapped;
}

export function mapAgentListItemToLibraryAgent(agent: AgentListItem): Agent {
  const libraryAgent = mapAgentApiListingToAgent({
    id: agent.id,
    email: agent.email,
    fullName: agent.fullName,
    phone: agent.phone,
    serviceArea: agent.serviceArea,
    status: agent.status,
    reviewedAt: agent.reviewedAt ?? agent.invitedAt ?? "",
  });

  return {
    ...libraryAgent,
    status: mapAgentListStatus(agent.status),
  };
}

export function mapAgentListItemsToLibraryAgents(agents: AgentListItem[]): Agent[] {
  return agents.map(mapAgentListItemToLibraryAgent);
}
