# useLeadsScreen

### File Overview

Logic hook for the leads list screen.

### Responsibilities

- Debounced search and status filter, page state.
- React Query list with refetch interval.
- Map API leads → `LeadListRow[]`.
- Build `AgentListView` columns, sort config, pagination (`maxPageButtons: 5`), empty copy, pinned columns.
- Navigate to lead detail on row open.

### API Usage

`getLeadList` → `GET /leads` (params: `page`, `pageSize`, optional `status`, `search`).

### Exports

`useLeadsScreen` — returns `{ pageTitle, pageSubtitle, listFilters, leadList }`.

### State Management

Local search/status/sort/page state + React Query for `["leads", "list", params]`.

### Navigation

`router.push(/leads/{id})` via `onRowClick` / column View details.

### Notes

Filter bar matches Agents: search + status only. Pagination object matches agents (`total`, `page`, `pageSize`, `totalPages`, `hasNext`/`hasPrevious`, `maxPageButtons`, `isLoading`, `onPageChange`).
