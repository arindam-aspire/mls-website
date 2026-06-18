# File Overview

Screen logic for the admin **Agents** page: labels, summary fetch, KPI mapping, agent list fetch, and onboard action handler.

**Source:** `src/features/user/hooks/useAgentsScreen.ts`

# Responsibilities

- Resolve `user.agents` copy for the agents screen header and KPI section.
- Fetch agent summary via TanStack Query (`getAgentSummary`).
- Fetch paginated agent list via TanStack Query (`getAgentList`).
- Map API counts to `AgentKPICards` metrics.
- Toast on summary or list fetch failure.
- Expose `inviteAgentByEmailModal`, `manualOnboardAgentModal`, `resendAgentConfirm`, and `deleteAgentConfirm` for `AgentsScreen`.

# API Usage

| Query key | Service | Endpoint |
| --- | --- | --- |
| `["agents", "summary"]` | `getAgentSummary` | `GET /agents/summary` |
| `["agents", "list", listRequestParams]` | `getAgentList` | `GET /agents?page=&pageSize=&sortBy=invited_at&sortOrder=desc` plus optional `search` and `status` |

Default list params: `page=1`, `pageSize=10`, `sortBy=invited_at`, `sortOrder=desc` (`agentList.constants.ts`).

Optional filters (from `AgentListFilters`):

| UI filter | Query param | Example |
| --- | --- | --- |
| Search text | `search` | `search=john` |
| Status dropdown | `status` (uppercase API enum) | `status=ACTIVE`, `status=PENDING_REVIEW` |

`listRequestParams` is built via `buildAgentListRequestParams`. Changing search or status resets `page` to `1`. Search uses `SearchInput` debounce before `onSearchChange` updates query state.

# Exports

- `useAgentsScreen`

# Return values

| Key | Source |
| --- | --- |
| `pageTitle` | `user.agents.pageTitle` |
| `pageSubtitle` | `user.agents.pageSubtitle` |
| `inviteByEmailLabel` | `user.agents.inviteByEmail` |
| `manualOnboardLabel` | `user.agents.manualOnboard` |
| `kpiMetrics` | `mapAgentSummaryToKpiMetrics` from summary data |
| `kpiSectionAriaLabel` | `user.agents.kpi.ariaLabel` |
| `isKpiLoading` | `useQuery` `isPending` for summary |
| `listFilters` | Search, status, column visibility state + handlers for `AgentListFilters` |
| `agentList` | Mapped agents, columns, sort, pagination, `workflowActions`, loading flags, `page`, `onPageChange` |
| `inviteByEmailLabel` | `user.agents.inviteByEmail` |
| `manualOnboardLabel` | `user.agents.manualOnboard` |
| `onOpenInviteAgentByEmail` | Opens invite-by-email modal |
| `onOpenManualOnboardAgent` | Opens manual onboard modal |
| `inviteAgentByEmailModal` | Props for `InviteAgentByEmailModal` |
| `manualOnboardAgentModal` | Props for `ManualOnboardAgentModal` |
| `resendAgentConfirm` | `openConfirm` + `confirmModal` for resend invitation flow |
| `deleteAgentConfirm` | `openConfirm` + `confirmModal` for revoke/remove delete flow |

# Workflow actions

`workflowActions` is passed to `buildAgentListTableColumns` and `AgentListView`. The library only renders the **Actions** column when at least one handler is defined (`hasAgentWorkflowActions`).

| Action | Handler | API |
| --- | --- | --- |
| `resend` | Opens resend `ConfirmModal` | `POST /agents/{id}/resend-invitation` |
| `revoke` | Opens delete confirm (revoke copy) | `DELETE /agents/{id}` |
| `remove` | Opens delete confirm (remove copy) | `DELETE /agents/{id}` |
| `activate`, `approve`, `deactivate`, `decline`, `grant_admin` | Coming-soon toast | — |

# Dependencies

- [AgentsScreen.md](../screens/AgentsScreen.md)
- [agent.service.md](../services/agent.service.md)
- [mapAgentSummaryToKpiMetrics.md](../utils/mapAgentSummaryToKpiMetrics.md)
