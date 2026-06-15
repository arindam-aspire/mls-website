# File Overview

Builds per-row action descriptors for **admin** manage-listings (`GET /admin/property-submissions`).

**Source:** `src/features/property/constants/adminListingRowActions.constants.ts`

# Responsibilities

- Return `PropertyListingRowActionDescriptor[]` attached to each `MyListingTableRow` as `actions`.
- Rules (status from API `item.status`, assignment from `item.has_assigned_agent`):

| Condition | Actions (order) |
| --- | --- |
| `submitted` and `!has_assigned_agent` | Assign Agent (`assign`), Reject (`reject`, danger), View |
| `submitted` and `has_assigned_agent` | Approve, Reassign, Reject (danger), Unassign, View |
| `approved` or `rejected` | View only |
| Other statuses | View only |

- **View** is included in every scenario.
- Action ids match `@abdoun/abdoun-library` workflow ids (`assign`, `approve`, `reject`, `reassign`, `unassign`, `view`).

# Exports

- `buildAdminListingRowActions(item, labels)` — single row descriptor list
- `AdminListingRowActionLabels` — i18n labels from `propertyList.manageListings.workflow.*`

# Dependencies

- [adminPropertySubmissions.mapper.md](../mappers/adminPropertySubmissions.mapper.md) — attaches descriptors when `adminRowActionLabels` is passed
- [useAdminPropertySubmissionsTable.md](../hooks/useAdminPropertySubmissionsTable.md) — supplies labels and `workflowActions` handlers (placeholders until wired)

# Notes

- Agent manage-listings path is unchanged (uses agent row-action matrix via `useAgentListingsTable`).
- Click handlers for assign / reject / reassign / unassign are placeholders in the admin hook for a follow-up step. **Approve** opens a confirm modal and calls `POST /admin/property-submissions/{submissionId}/review` with `{ "action": "approve" }`.
