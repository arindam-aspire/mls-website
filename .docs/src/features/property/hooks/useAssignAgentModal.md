# File Overview

Logic for `AssignAgentModal`: fetch agents, search, pagination, selection, assign callback.

**Source:** `src/features/property/hooks/useAssignAgentModal.ts`

Imports agent list logic from `src/features/user/` (`getAgentList`, types, constants, filters).

# API Usage

| Method | Path | When |
| --- | --- | --- |
| GET | `/agents?page=&pageSize=10&sortBy=invited_at&sortOrder=desc` | Modal open; load more increments `page` |

# Flow

1. Modal opens → page 1 fetch.
2. User searches (client filter on loaded agents).
3. **Load more** fetches next page and appends.
4. User selects agent → **Assign agent** → `onAssign(agentId)` → parent `PATCH /admin/properties/{propertyId}/assign-agent`.
