# User utils (`src/features/user/utils/`)

Helpers for user/agent list flows.

## Files

| File | Role |
| --- | --- |
| [buildAgentListRequestParams.md](./buildAgentListRequestParams.md) | Build `GET /agents` query params from toolbar state |
| [filterActiveAgents.md](./filterActiveAgents.md) | Keep only ACTIVE agents |
| [filterAgentsBySearch.md](./filterAgentsBySearch.md) | Client-side search filter (assign-agent modal) |
| [filterAgentsByStatus.md](./filterAgentsByStatus.md) | Legacy client-side status filter |
| [mapAgentListStatusFilterToApiStatus.md](./mapAgentListStatusFilterToApiStatus.md) | UI status key → API `status` enum |
| [parseAgentInviteLink.md](./parseAgentInviteLink.md) | Rewrite agent invite / password-setup URLs onto `window.location.origin` |
| [index.md](./index.md) | Barrel exports |
