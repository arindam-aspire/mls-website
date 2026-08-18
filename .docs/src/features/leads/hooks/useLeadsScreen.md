# useLeadsScreen

### File Overview

Shared logic hook for agency lead management and owner enquiries lists.

### Responsibilities

- Debounced search and status filter, page state.
- React Query list with refetch interval.
- Map API leads → `LeadListRow[]` with assigned agent names (never raw agent ids).
- Fetch property details once per unique `property_id` on the current page to resolve listing agent names for the Assigned Agent column.
- Build `AgentListView` columns, sort config, pagination (`maxPageButtons: 5`), empty copy, pinned columns.
- Default `management` scope preserves `/leads` behavior and detail navigation.
- `owner` scope reads the logged-in user id, calls the owner-scoped API, uses owner copy, and omits the admin-only detail action.

### API Usage

- Management: `getLeadList` → `GET /leads`.
- Owner: `getOwnerLeadList(user.id, params)` → `GET /agency/owners/{ownerId}/leads`.
- Both preserve `page`, `pageSize`, optional `status`, `search`, current-page sorting, and optional property detail enrichment.

### Exports

`useLeadsScreen({ scope?: "management" | "owner" })` — returns `{ pageTitle, pageSubtitle, listFilters, leadList }`; defaults to `management`.

### State Management

Local search/status/sort/page state. Query keys are separated as `["leads", "list", …]` and `["leads", "owner-list", ownerId, …]`.

### Navigation

Management scope uses `router.push(/leads/{id})`. Owner scope is list-only and does not expose the management detail action.

### Notes

Filter bar matches Agents: search + status only. Pagination object matches agents (`total`, `page`, `pageSize`, `totalPages`, `hasNext`/`hasPrevious`, `maxPageButtons`, `isLoading`, `onPageChange`).
