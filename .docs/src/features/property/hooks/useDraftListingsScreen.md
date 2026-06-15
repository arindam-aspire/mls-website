# File Overview

Screen hook for **Draft Listings** (`/draft-listings`). Fetches `GET /agent-properties/drafts`, maps rows to `DraftList`, and wires pagination and actions.

**Source:** `src/features/property/hooks/useDraftListingsScreen.ts`

# Responsibilities

- Fetch drafts with `{ page, pageSize }` (defaults `1` / `10`).
- Map API items via `mapAgentPropertyDraftListItems` → `MappedDraftListItem[]` (includes `canEdit`, `canDelete`).
- Expose `DraftList` props: `pagination`, `onResume`, `onDelete`, `onCreateNew`, labels, `emptyStateContent`.
- **Resume** → `/property-create?submission_id={id}`.
- **Create new** via `useAddPropertyEntry({ restrictForOwnerOnly: true })` — owner + no `has_agency` opens agency modal; otherwise `/property-create`.
- **Delete** — stub until delete API exists.

# API Usage

| Method | Path | Service |
| --- | --- | --- |
| GET | `/agent-properties/drafts?page=&pageSize=` | `getAgentPropertyDrafts` |

# Dependencies

- [DraftListingsScreen.md](../screens/DraftListingsScreen.md)
- [useAddPropertyEntry.md](./useAddPropertyEntry.md)
- [agentPropertyDraftsList.mapper.md](../mappers/agentPropertyDraftsList.mapper.md)
