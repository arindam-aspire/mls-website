# File Overview

Builds custom `ListTableView` columns for **My Listings**: Property Name, Reference, Status, Submitted on, Reviewed on, and Actions.

**Source:** `src/features/property/utils/buildMyListingTableColumns.tsx`

# Responsibilities

- Return `TableColumn<PropertyListing>[]` for `@abdoun/abdoun-library` `ListTableView`.
- Column order: `title` (property name), `reference`, `status`, `submittedOn`, `reviewedOn`, `actions`.
- Sortable columns: **Property Name** (`title`), **Submitted on** (`submittedOn`), and **Reviewed on** (`reviewedOn`); client-side via `ListTableView` `sortConfig`.
- Reuse library `ListingStatusBadge` for status cells.
- Reuse library `buildPropertyTableColumns` only to obtain the actions column (`createWorkflowActionsResolver` + row menu).
- Format dates via `formatListingSubmittedDate`: `validatedDate` = `submission_submitted_at`, `reviewedDate` = `submission_reviewed_at`.

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
