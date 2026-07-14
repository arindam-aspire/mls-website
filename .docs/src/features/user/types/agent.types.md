# Agent types

**Source:** `src/features/user/types/agent.types.ts`

TypeScript shapes for `GET /agents` and `GET /agents/summary` responses.

## List types

| Type | Role |
| --- | --- |
| `AgentListItem` | Single agent row (`data.agents[]`) |
| `AgentListPagination` | Page metadata |
| `AgentListParams` | Optional query overrides (`page`, `pageSize`, `sortBy`, `sortOrder`, `search`, `status`) |
| `AgentListResponse` | Raw API envelope |
| `NormalizedAgentListResponse` | `{ agents, pagination }` from `getAgentList` |
| `AgentStatus` | Status string union (`ACTIVE`, `PENDING_REVIEW`, …) |

## Summary types

| Type | Role |
| --- | --- |
| `AgentSummaryData` | Counts + `lastFiveAgents` from `GET /agents/summary` |
| `AgentSummaryLastAgent` | Recent agent row in summary |
| `AgentSummaryLastAgentMetadata` | Email, service area, review timestamps |
| `AgentSummaryResponse` | Raw summary API envelope |

## Invitation / onboarding types

| Type | Role |
| --- | --- |
| `AgentInviteData` | Invite/resend payload; `inviteLink` plus optional `invitation_url` |
| `AgentInvitationSubmitRequest` | Public submit; `position` and `identityDocument` optional |
| `ManualOnboardAgentRequest` | Admin onboard; same optional position/identity fields |
| `AgentResendInvitationResult` | Alias of invite result (includes invitation URL for copy modal) |

## Consumers

- `useAssignAgentModal`, `AssignAgentListItem` (property feature) — list types
- `useAgentsScreen`, `getAgentSummary` — summary types
- Invite/resend/onboarding hooks and services — invitation types
