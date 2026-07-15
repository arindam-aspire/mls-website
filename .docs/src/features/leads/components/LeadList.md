# LeadList

### File Overview

Leads list shell that matches the Agents page layout: surface card from `md+`, lead filters, and library `AgentListView` for the table + numbered pagination.

### Responsibilities

- Compose `LeadListFilters` + `AgentListView<LeadListRow>`.
- Pass columns, sort, pagination, empty state, pinned columns, and mobile card config from the screen hook.
- Use `mobileCardVariant="generic"` so lead rows render with column-driven cards (not agent-specific cards).
- Filters match Agents: search + status only.

### Imports

- `@abdoun/abdoun-library` — `AgentListView`, pagination / column / sort types
- `./LeadListFilters`
- `../types/leadList.types` — `LeadListRow`

### Exports

- `LeadList`
- `LeadListProps`, `LeadListData`

### State Management

None — presentational; all state comes from `useLeadsScreen` via props.

### API Usage

None directly.

### Navigation

Row click / View details → handled by `list.onRowClick` / column handlers from the hook (`/leads/{id}`).

### Props / Parameters

| Prop | Role |
| --- | --- |
| `filters` | `LeadListFiltersProps` |
| `list` | Table data, columns, sort, pagination (`maxPageButtons: 5`), loading, empty copy |

### UI Details

Matches `AgentList`:
- Flush on mobile; from `md`: `rounded-xl bg-surface` + soft shadow
- Padding `md:p-4 lg:p-6`
- Library numbered pagination (same component as agents)

### Flow Description

1. Filters render above the list view.
2. `AgentListView` shows skeleton while loading/fetching, empty state when no rows, else desktop table + mobile cards + pagination.

### Dependencies

`LeadListFilters`, `useLeadsScreen`, `buildLeadListTableColumns`.

### Notes

Uses generic `AgentListView<T>` (not property `ListTableView`). Prefer a dedicated `LeadListView` upstream later if the library adds one.
