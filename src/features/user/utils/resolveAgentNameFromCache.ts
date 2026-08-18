import type { QueryClient } from "@tanstack/react-query";
import type { NormalizedAgentListResponse } from "../types/agent.types";

export function resolveAgentNameFromCache(
  queryClient: QueryClient,
  agentId: string | null | undefined,
): string | null {
  const normalizedId = agentId?.trim();
  if (!normalizedId) {
    return null;
  }

  const cachedQueries = queryClient.getQueriesData<NormalizedAgentListResponse>({
    queryKey: ["agents", "list"],
  });

  for (const [, data] of cachedQueries) {
    const match = data?.agents?.find((agent) => agent.id === normalizedId);
    const fullName = match?.fullName?.trim();
    if (fullName) {
      return fullName;
    }
  }

  return null;
}
