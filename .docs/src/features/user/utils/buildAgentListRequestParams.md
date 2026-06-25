# `buildAgentListRequestParams`

**Source:** `src/features/user/utils/buildAgentListRequestParams.ts`

Builds `AgentListParams` for `GET /agents`, including optional `search` and uppercase `status` from toolbar filter state.

## Mapping

- Trims `search`; omitted when empty.
- Maps UI status filter keys via `mapAgentListStatusFilterToApiStatus` (e.g. `pending` → `PENDING_REVIEW`).

## Consumers

- `useAgentsScreen`
