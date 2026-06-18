# `filterActiveAgents`

**Source:** `src/features/user/utils/filterActiveAgents.ts`

Filters agent rows to those with `status === ACTIVE` (case-insensitive, trimmed).

## Consumers

- `useAssignAgentModal` — after each page fetch, before merging into modal state
