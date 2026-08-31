# File Overview

Builds per-row action descriptors for **admin** manage-listings (`GET /admin/property-submissions`).

**Source:** `src/features/property/constants/adminListingRowActions.constants.ts`

# Responsibilities

- Return `PropertyListingRowActionDescriptor[]` attached to each `MyListingTableRow` as `actions`.
- Rules use API `item.status`, `item.has_assigned_agent`, `item.agency`, and role-derived options:

| Condition | Actions (order) |
| --- | --- |
| Agency Admin + `submitted` | Assign Agent, View |
| Agency Admin + `agent-assigned` with agent | Approve, Reject (danger), Reassign, Unassign (danger), View |
| Agency Admin + `pending-approval` with agent | Approve, Reject (danger), View |
| Super Admin + unassigned agency + `submitted`, `agent-assigned`, or `pending-approval` | Approve, Reject (danger), View |
| Super Admin + agency assigned | Existing actions only; no new Approve or Reject |
| Super Admin + `active` | Deactivate (danger), View |
| `rejected` | View, optional rejected reason, optional Delete when allowed by API |
| Other statuses | View only |

- **View** is included in every scenario.
- Unassigned agency is detected by `isAdminSubmissionAgencyUnassigned`: `agency` is `null`/`undefined`, or an object without a usable `agency_id`.
- Action ids match `@abdoun/abdoun-library` workflow ids (`assign`, `approve`, `reject`, `reassign`, `unassign`, `view`).

# Exports

- `buildAdminListingRowActions(item, labels, options)` — single row descriptor list
- `isAdminSubmissionAgencyUnassigned(agency)` — shared Super Admin unassigned-agency gate
- `AdminListingRowActionLabels` — i18n labels from `propertyList.manageListings.workflow.*`
- `AdminListingRowActionOptions` — separates normal Agency Admin review from Super Admin review of unassigned-agency submissions.

# Dependencies

- [adminPropertySubmissions.mapper.md](../mappers/adminPropertySubmissions.mapper.md) — attaches descriptors when `adminRowActionLabels` is passed
- [useAdminPropertySubmissionsTable.md](../hooks/useAdminPropertySubmissionsTable.md) — supplies role options, labels, and wired workflow handlers.

# Notes

- Agent manage-listings path is unchanged (uses agent row-action matrix via `useAgentListingsTable`).
- Owner/my-listings behavior is unchanged.
- Approve and Reject reuse the existing confirmation UI, review endpoint, loading state, localized toasts, and table refresh.
