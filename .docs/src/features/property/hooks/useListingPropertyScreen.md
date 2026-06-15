# File Overview

Screen hook for `ListingPropertyScreen`: fetches agent properties, maps rows for `ListTableView`, and exposes filters, sort, and pagination.

**Source:** `src/features/property/hooks/useListingPropertyScreen.ts`

# Responsibilities

- Call `GET /agent-properties` with `page`, `pageSize`, and optional `search` / `status` query params.
- Own filter state (`search`, `status`); reset page to `1` when either changes.
- Own `page`, `pageSize`, and client-side `sortConfig` for the table.
- Store raw `listings` as `AgentPropertyListItem[]`; expose `tableListings` mapped via `mapAgentPropertyListItems`.
- Build `pagination` for `ListTableView` / `TablePaginition` (page size options 10, 15, 20).
- Expose `noDataFound`, `workflowActions`, per-row action handlers, and `onClickProperty`.
- For **`submission_workflow_label === "rejected"`** rows, per-row `actions` drive the menu: View, Edit, View Rejected Reason, Delete (visibility from `can_edit_submission`, `can_delete_submission`, and `submission_review_reason`).
- Other statuses use `@abdoun/abdoun-library` `STATUS_WORKFLOW_ACTION_MATRIX` via `createMyListingRowActionsResolver`.
- `navigateToPropertyView` — **View** action and property name click → `/propert-details/{listing.id}` (`property_hash`).
- Rejected-reason and delete-confirm modals exposed as `rejectedReasonModal` and `deleteConfirmModal`.
- Own `columnVisibility` state; filter `columns` and `sortConfig` for hidden columns; build `columnOptions` for `MyListingFilters`.
- Map app locale `es` → library title locale `esp` for column rendering.

# API Usage

| Method | Endpoint | Auth |
| --- | --- | --- |
| GET | `/agent-properties?page=&pageSize=` | `auth: true` |

- Service: `getAgentProperties` in `property.service.ts`
- Mutation: `useGetAgentProperties` in `property.mutation.ts`
- Endpoint builder: `propertyEndpoints.AGENT_PROPERTIES`

# State Management

- Local state for listings, pagination meta, request params, page, pageSize, sort.
- `isLoading` true until first response or while mutation is pending.

# Exports

- `useListingPropertyScreen()`

# Return values (selected)

| Key | Purpose |
| --- | --- |
| `filters` | Props for `MyListingFilters` |
| `tableListings` | Rows for `ListTableView` |
| `sortConfig` / `onSort` | Table header sort |
| `pagination` | Server pagination footer |
| `workflowActions` | Handlers for `view`, `continue`, `rejected_reason` |
| `rejectedReasonModal` | Props for `MyListingRejectedReasonModal` |
| `deleteConfirmModal` | Props for delete `ConfirmModal` |
| `tableLocale` | Library title locale key |
| `columns` | Visible My Listings table columns for `ListTableView` |
| `pinnedColumns` | Dynamic pin config from visibility (`title` / `actions`) |
| `filters.columnOptions` / `onColumnVisibilityChange` | Column picker props |

# Dependencies

- `AgentPropertiesListParams`, `AgentPropertyListItem` in `property.types.ts`
- [agentPropertiesList.mapper.md](../mappers/agentPropertiesList.mapper.md)
- `propertyList.myListings.*` i18n keys
