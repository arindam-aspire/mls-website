# Agent list status filters

**Source:** `src/features/user/constants/agentListStatusFilters.constants.ts`

Status dropdown values for the agents list toolbar (`AgentListFilters`).

## Exports

| Symbol | Role |
| --- | --- |
| `AGENT_LIST_STATUS_FILTER_VALUES` | `active`, `inactive`, `invited`, `pending`, `declined` |
| `AGENT_LIST_STATUS_FILTER_TO_API_STATUS` | Maps each filter key to uppercase API `status` (`ACTIVE`, `PENDING_REVIEW`, …) |
| `isAgentListStatusFilterValue` | Type guard for dropdown values |
| `AgentListStatusFilterValue` | Union of filter keys |

## i18n

Labels under `user.agents.list.statusFilter.<value>` in all locales.

## Consumers

- `AgentListFilters`
- `useAgentsScreen` → `buildAgentListRequestParams` → `GET /agents?status=…`
