# Agent service

**Source:** `src/features/user/services/agent.service.ts`

Authenticated API helpers for agent list and summary data.

## `getAgentList`

`GET /agents` with auth. Returns `{ agents, pagination }`.

Default query: `page=1`, `pageSize=10`, `sortBy=invited_at`, `sortOrder=desc`.

Optional query params when provided on `AgentListParams`:

| Param | Description |
| --- | --- |
| `search` | Name/email search string |
| `status` | Uppercase agent status (`ACTIVE`, `INACTIVE`, `INVITED`, `PENDING_REVIEW`, `DECLINED`) |

## `getAgentSummary`

`GET /agents/summary` with auth. Returns `AgentSummaryData` (counts + `lastFiveAgents`).

Falls back to zeroed summary when `data` is null.

## `inviteAgentByEmail`

`POST /agents/invite` with auth. Body: `{ email: string }`.

Returns `{ invite: AgentInviteData, message: string }`. Normalizes `inviteLink` via `parseAgentInviteLink` when the API returns comma-separated URLs.

## `manualOnboardAgent`

`POST /agents/manual-onboard` with auth. Body: `{ fullName, email, phone, serviceArea }` (`serviceArea` comma-separated labels).

Returns `{ agent: ManualOnboardAgentData, message: string }` including `temporaryPassword`.

## `resendAgentInvitation`

`POST /agents/{agentId}/resend-invitation` with auth.

Returns `{ invite: AgentInviteData, message: string }`. Normalizes `inviteLink` via `parseAgentInviteLink`.

## `deleteAgent`

`DELETE /agents/{agentId}` with auth.

Returns `{ message: string }`.

## Consumers

- `useAssignAgentModal` — paginated agent list for assign/reassign modal
- `useAgentsScreen` — KPI metrics from summary counts
- `useInviteAgentByEmail` — agent email invitation
- `useManualOnboardAgent` — manual agent onboarding
- `useResendAgentInvitation` — resend invitation from list workflow
- `useDeleteAgent` — revoke/remove agent from list workflow

## Related

- Endpoint: `src/apis/endpoints/agentEndpoints.ts` (`LIST`, `SUMMARY`, `INVITE`, `MANUAL_ONBOARD`, `RESEND_INVITATION`, `DELETE`)
- Constants: `src/features/user/constants/agentList.constants.ts`
- Types: `src/features/user/types/agent.types.ts`
