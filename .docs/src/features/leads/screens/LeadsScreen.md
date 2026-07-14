# LeadsScreen

### File Overview

Route-level list UI for lead management. Used by `app/[locale]/(main)/leads/page.tsx`.

### Responsibilities

- Render page title, filters, and lead table / mobile cards.
- Show skeleton while the first page loads.
- Delegate all data and filter state to `useLeadsScreen`.

### Imports

- `useLeadsScreen`, `LeadListFilters`, `LeadListTable`, `LeadsScreenSkeleton`
- UI: `Card`, typography helpers

### Exports

- `LeadsScreen`

### State Management

None locally — all in `useLeadsScreen` (React Query + local filter state).

### API Usage

Indirect: `GET /leads` via `getLeadList`.

### Navigation

Row action → `/leads/{id}`.

### Props / Parameters

None.

### Actions / Inputs

Search, status, agent id, date from/to, property id, clear filters, pagination, view details.

### UI Details

Mobile-first cards under `md`, table from `md+`. Cards `rounded-xl`, controls `rounded-lg`. Semantic tokens.

### Flow Description

1. Screen mounts → query list with refetch interval.
2. User filters → page resets → query key changes.
3. User opens row → router push detail.

### Dependencies

`useLeadsScreen`, list components.

### Notes

Feature-local table until library `LeadListView` ships (see Required abdoun-library Changes in PR notes).
