import type { AgentKPIMetric, AgentKPIMetricId } from "../components/AgentKPICards";
import type { AgentSummaryData } from "../types/agent.types";

const KPI_METRIC_IDS: AgentKPIMetricId[] = [
  "activeAgents",
  "pendingReview",
  "pendingInvite",
  "declined",
];

const KPI_VALUE_KEY: Record<
  AgentKPIMetricId,
  "activeAgents" | "pendingReview" | "pendingInvites" | "declined"
> = {
  activeAgents: "activeAgents",
  pendingReview: "pendingReview",
  pendingInvite: "pendingInvites",
  declined: "declined",
};

export function mapAgentSummaryToKpiMetrics(
  summary: AgentSummaryData | undefined,
  labelForId: (id: AgentKPIMetricId) => string,
): AgentKPIMetric[] {
  return KPI_METRIC_IDS.map((id) => ({
    id,
    label: labelForId(id),
    value: summary?.[KPI_VALUE_KEY[id]] ?? 0,
  }));
}
