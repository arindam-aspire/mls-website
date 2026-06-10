# File Overview

Builds custom `ListTableView` columns for **My Listings**: Property Name, Reference, Status, Submitted on, and Actions.

**Source:** `src/features/property/utils/buildMyListingTableColumns.tsx`

# Responsibilities

- Return `TableColumn<PropertyListing>[]` for `@abdoun/abdoun-library` `ListTableView`.
- Column order: `title` (property name), `reference`, `status`, `submittedOn`, `actions`.
- Sortable columns only: **Property Name** (`title`) and **Submitted on** (`submittedOn`); client-side via `ListTableView` `sortConfig`.
- Reuse library `ListingStatusBadge` for status cells.
- Reuse library `buildPropertyTableColumns` only to obtain the actions column (`createWorkflowActionsResolver` + row menu).
- Format submitted date via `formatListingSubmittedDate` (`validatedDate` on mapped rows = `submission_submitted_at`).

# Parameters

| Param | Purpose |
| --- | --- |
| `labels` | Localized column headers and empty submitted-on placeholder |
| `tableLocale` | Library title locale (`en`, `ar`, `esp`, `fr`) |
| `appLocale` | App locale for date formatting |
| `onClick` | Property name link → property update |
| `workflowActions` | Status-driven row action menu |

# Dependencies

- `useListingPropertyScreen` — builds columns with `propertyList.myListings.columns.*` i18n
- [formatListingSubmittedDate.md](./formatListingSubmittedDate.md)
