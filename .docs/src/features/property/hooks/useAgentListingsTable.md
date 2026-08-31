# File Overview

Shared agent listings table hook: fetches `GET /agent-properties`, maps rows for `ListTableView`, and exposes filters, sort, pagination, and modals.

**Source:** `src/features/property/hooks/useAgentListingsTable.ts`

**Used by:** `useListingPropertyScreen` (`myListings`) and `useManageListingsScreen` for **agent** users (`manageListings`).

# Responsibilities

- Call `GET /agent-properties` with `page`, `pageSize`, and optional `search` / `status` query params.
- Own filter state (`search`, `status`); status defaults to empty so **All** listings are shown, and page resets to `1` when either filter changes.
- Own `page`, `pageSize`, and client-side `sortConfig` for the table.
- Store raw `listings` as `AgentPropertyListItem[]`; expose `tableListings` mapped via `mapAgentPropertyListItems`.
- Build `pagination` for `ListTableView` (page size options 10, 15, 20).
- Expose `noDataFound`, `workflowActions`, per-row action handlers, and `onClickProperty`.
- For **`submission_workflow_label === "rejected"`** rows, per-row `actions` drive the menu: View, Edit, View Rejected Reason, Delete.
- `navigateToPropertyView` → opens `/propert-details/{listing.id}` in a new tab.
- Rejected-reason and delete-confirm modals as `rejectedReasonModal` and `deleteConfirmModal`.
- Own `columnVisibility` state; filter `columns` and `sortConfig` for hidden columns.
- Map app locale `es` → library title locale `esp` for column rendering.
- Resolve `propertyList.{listingsNamespace}` i18n for labels and mutation error toasts.

# Props / Parameters

| Param | Type | Purpose |
| --- | --- | --- |
| `listingsNamespace` | `"myListings" \| "manageListings"` | i18n namespace under `propertyList.*` |

# Exports

- `useAgentListingsTable({ listingsNamespace })`

# API Usage

| Method | Endpoint | Auth |
| --- | --- | --- |
| GET | `/agent-properties?page=&pageSize=` | Yes |
| DELETE | `/property-submissions/{id}` | Yes (delete confirm) |

# Dependencies

- [agentPropertiesList.mapper.md](../mappers/agentPropertiesList.mapper.md)
- `useGetAgentProperties`, `useDeletePropertySubmission` in `property.mutation.ts`

# Notes

- Not imported directly by screens; use `useListingPropertyScreen` or `useManageListingsScreen` instead.
- The initial empty `status` omits the status query parameter, selects the existing **All** placeholder, and fetches listings across every status.
