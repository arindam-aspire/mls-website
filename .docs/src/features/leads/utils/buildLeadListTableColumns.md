# buildLeadListTableColumns

### File Overview

Builds `TableColumn<LeadListRow>[]` for the leads list rendered by library `AgentListView`.

### Responsibilities

- Define columns: lead number, property, customer, status (badge), assigned agent, created date, actions.
- Wire View details button → `onOpenLead`.
- Expose default pinned columns and mobile-grid hidden column ids.

### Exports

- `buildLeadListTableColumns`
- `LeadListTableColumnLabels`
- `DEFAULT_LEAD_LIST_PINNED_COLUMNS`
- `LEAD_LIST_GRID_HIDDEN_COLUMN_IDS`

### Notes

Client-side sort uses `getSortValue` on the current page of rows (same pattern as agents).
