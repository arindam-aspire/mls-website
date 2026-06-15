# File Overview

Builds custom `ListTableView` columns for **My Listings** and **Manage Listings**: **Property** (stacked name + reference), Status, **Submission** (stacked submitted by + submitted on), Reviewed on, and Actions.

**Source:** `src/features/property/utils/buildMyListingTableColumns.tsx`

# Responsibilities

- Return `TableColumn<PropertyListing>[]` for `@abdoun/abdoun-library` `ListTableView`.
- Column order: `title` (property name + reference), `status`, `submission`, `reviewedOn`, `actions`.
- Sortable columns: **Property** (`title`), **Submission** (`submission`, sorts by submitted-on timestamp), and **Reviewed on** (`reviewedOn`); client-side via `ListTableView` `sortConfig`.
- Reuse library `ListingStatusBadge` for status cells.
- Reuse library `buildPropertyTableColumns` only to obtain the actions column (`createWorkflowActionsResolver` + row menu).
- Format dates via `formatListingSubmittedDate` (date + time, 12-hour AM/PM). **Submission** cell: primary line = submitter (`submission_submitted_by`, then agency/broker fallbacks); secondary line = submitted-on date (`validatedDate` / `submitted_on`). **Reviewed on** uses `reviewedDate` = `submission_reviewed_at`.

# Parameters

| Param | Purpose |
| --- | --- |
| `labels` | Localized column headers and empty placeholders (`submittedByEmpty`, `submittedOnEmpty`) |
| `tableLocale` | Library title locale (`en`, `ar`, `esp`, `fr`) |
| `appLocale` | App locale for date formatting |
| `onClick` | Property name link → property update |
| `workflowActions` | Status-driven row action menu |

# Dependencies

- `useListingPropertyScreen` — builds columns with `propertyList.myListings.columns.*` i18n
- [formatListingSubmittedDate.md](./formatListingSubmittedDate.md)
