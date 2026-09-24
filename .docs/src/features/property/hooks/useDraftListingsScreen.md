# File Overview

Screen hook for **Draft Listings** (`/draft-listings`). Fetches `GET /agent-properties/drafts`, maps rows to `DraftList`, and wires pagination and actions including delete.

**Source:** `src/features/property/hooks/useDraftListingsScreen.ts`

# Responsibilities

- Fetch drafts with `{ page, pageSize }` (defaults `1` / `10`).
- Map API items via `mapAgentPropertyDraftListItems` → `MappedDraftListItem[]` (includes `canEdit`, `canDelete`).
- Expose `DraftList` props: `pagination`, `onResume`, `onDelete`, `getDeleteLoading`, labels, `emptyStateContent`.
- **Resume** → `/property-create?submission_id={id}`.
- **Create new** via `useAddPropertyEntry({ restrictForOwnerOnly: true })` → `/property-create`.
- **Delete** → confirm modal → `DELETE /property-submissions/{submission_id}` (card `id` is already `submission_id`) → toast success/error → refresh list. Loading via `isDeleteLoading` on the card and confirm button.

# API Usage

| Method | Path | Service |
| --- | --- | --- |
| GET | `/agent-properties/drafts?page=&pageSize=` | `getAgentPropertyDrafts` |
| DELETE | `/property-submissions/{id}` | `deletePropertySubmission` via `useDeletePropertySubmission("draftListings")` |

# State Management

- Local: page, pageSize, listings, pending delete item, deleting submission id.
- Mutation pending flags drive loading UI.

# Dependencies

- [DraftListingsScreen.md](../screens/DraftListingsScreen.md)
- [useAddPropertyEntry.md](./useAddPropertyEntry.md)
- [agentPropertyDraftsList.mapper.md](../mappers/agentPropertyDraftsList.mapper.md)
