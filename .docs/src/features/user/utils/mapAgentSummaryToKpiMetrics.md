# `mapAgentSummaryToKpiMetrics`

**Source:** `src/features/user/utils/mapAgentSummaryToKpiMetrics.ts`

Maps `AgentSummaryData` counts to the four `AgentKPIMetric` rows consumed by `AgentKPICards`.

## Signature

```ts
mapAgentSummaryToKpiMetrics(
  summary: AgentSummaryData | undefined,
  labelForId: (id: AgentKPIMetricId) => string,
): AgentKPIMetric[]
```

## Field mapping

| KPI id | API field |
| --- | --- |
| `activeAgents` | `activeAgents` |
| `pendingReview` | `pendingReview` |
| `pendingInvite` | `pendingInvites` |
| `declined` | `declined` |

Missing summary values default to `0`.

## Consumers

- `useAgentsScreen`
