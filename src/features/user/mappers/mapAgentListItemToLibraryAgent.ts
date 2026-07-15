import {
  mapAgentApiListingToAgent,
  type Agent,
  type AgentStatus,
  type AgentStatusKey,
} from "@abdoun/abdoun-library";
import type { AgentListItem } from "../types/agent.types";
import { formatAgentStatusLabel } from "../utils/formatAgentStatusLabel";

/**
 * Library badge/workflow keys. Label always comes from the backend status string —
 * never derive Active from password setup or onboarding completion.
 *
 * Upstream suggestion for `@abdoun/abdoun-library`: add `PENDING_PASSWORD` and
 * `PENDING_REVIEW` to `AGENT_API_STATUS_KEY_MAP` (both → `pending`).
 */
const AGENT_STATUS_KEY_BY_API: Record<string, AgentStatusKey> = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  PENDING: "pending",
  PENDING_APPROVAL: "pending",
  PENDING_REVIEW: "pending",
  PENDING_PASSWORD: "pending",
  SUSPENDED: "suspended",
  DECLINED: "declined",
  INVITED: "invited",
};

/**
 * Prefer the most recent meaningful lifecycle timestamp for the Activity Date column.
 * After onboarding submit the invite is marked used, so `invitedAt` alone used to disappear
 * from list payloads that only looked up unused invites — fall back through review / password /
 * form submit / invite times.
 */
export function resolveAgentActivityDate(agent: AgentListItem): string {
  return (
    agent.reviewedAt?.trim() ||
    agent.passwordSetAt?.trim() ||
    agent.formSubmittedAt?.trim() ||
    agent.invitedAt?.trim() ||
    ""
  );
}

export function mapAgentListStatus(status: string): AgentStatus {
  const normalized = status.trim().toUpperCase();
  const key = AGENT_STATUS_KEY_BY_API[normalized] ?? "inactive";

  return {
    key,
    label: formatAgentStatusLabel(normalized || status),
  };
}

export function mapAgentListItemToLibraryAgent(agent: AgentListItem): Agent {
  const libraryAgent = mapAgentApiListingToAgent({
    id: agent.id,
    email: agent.email,
    fullName: agent.fullName,
    phone: agent.phone,
    serviceArea: agent.serviceArea,
    status: agent.status,
    reviewedAt: resolveAgentActivityDate(agent),
  });

  return {
    ...libraryAgent,
    status: mapAgentListStatus(agent.status),
  };
}

export function mapAgentListItemsToLibraryAgents(agents: AgentListItem[]): Agent[] {
  return agents.map(mapAgentListItemToLibraryAgent);
}
