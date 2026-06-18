# `filterAgentsBySearch`

**Source:** `src/features/user/utils/filterAgentsBySearch.ts`

Client-side search over loaded agents. Matches `fullName`, `email`, `phone`, and `serviceArea` (case-insensitive substring).

## Consumers

- `useAssignAgentModal` — filters displayed list without refetching
