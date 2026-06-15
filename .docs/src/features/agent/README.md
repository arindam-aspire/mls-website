# Agent feature (`src/features/agent/`)

API layer for **`GET /agents`** — used when admins assign agents to property submissions.

## Architecture

```text
agent/
  constants/   Default list query (page, pageSize, sort)
  services/    `getAgentList`
  types/       Agent list item + pagination shapes
  utils/       Client-side search filter
```

## Consumers

- [AssignAgentModal.md](../property/components/AssignAgentModal.md) — manage-listings admin assign flow

## Related

- Endpoint: `src/apis/endpoints/agentEndpoints.ts`
- Assign submission API (not yet wired) will live in property admin services when provided.
