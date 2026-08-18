# LeadsScreen

### File Overview

Route-level list UI for lead management. Used by `app/[locale]/(main)/leads/page.tsx`.

### Responsibilities

- Render page title / subtitle and `LeadList` (same layout shell as Agents).
- Delegate filters, table columns, sort, and pagination to `useLeadsScreen`.

### Imports

- `useLeadsScreen`, `LeadList`
- Typography helpers (`headingPageClasses`, `bodyLargeTextClasses`)

### Exports

- `LeadsScreen`

### State Management

None locally — all in `useLeadsScreen` (React Query + local filter/sort/page state).

### API Usage

Indirect: `GET /leads` via `getLeadList`.

### Navigation

Row click / View details → `/leads/{id}`.

### Props / Parameters

None.

### Actions / Inputs

Search, status filter, column sort, numbered pagination, view details / row click.

### UI Details

Page layout mirrors Agents (`flex … gap-2 md:gap-4 lg:gap-6`). List shell uses library `AgentListView` with agent-style surface card, numbered pagination (`maxPageButtons: 5`), and generic mobile cards.

### Flow Description

1. Screen mounts → query list with refetch interval.
2. User filters → page resets → query key changes.
3. User changes page via library pagination → `onPageChange`.
4. User opens row → router push detail.

### Dependencies

`useLeadsScreen`, `LeadList`.

### Notes

Table/pagination come from `@abdoun/abdoun-library` `AgentListView` (generic mode), same component Agents use.
