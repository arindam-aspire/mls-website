# buildLeadListTableColumns

### File Overview

Builds `TableColumn<LeadListRow>[]` for the leads list rendered by library `AgentListView`.

### Responsibilities

- Define columns: lead number, property, customer, status (badge), assigned agent, and created date.
- Add the Actions/View details column only when `onOpenLead` is provided; management passes it, owner enquiries do not.
- Expose default pinned columns and mobile-grid hidden column ids.

### Exports

- `buildLeadListTableColumns`
- `LeadListTableColumnLabels`
- `DEFAULT_LEAD_LIST_PINNED_COLUMNS`
- `LEAD_LIST_GRID_HIDDEN_COLUMN_IDS`

### Notes

Client-side sort uses `getSortValue` on the current page of rows (same pattern as agents).
