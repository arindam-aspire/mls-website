# File Overview

Admin manage-listings table hook: fetches `GET /admin/property-submissions`, maps rows for `ListTableView`, and exposes filters, sort, and pagination (no search or delete).

**Source:** `src/features/property/hooks/useAdminPropertySubmissionsTable.ts`

**Used by:** `useManageListingsScreen` when the signed-in user is **not** an agent (admin/agency role).

# Responsibilities

- Call `GET /admin/property-submissions` with `page`, `pageSize`, and optional `status`.
- Map `AdminPropertySubmissionListItem` rows via [adminPropertySubmissions.mapper.md](../mappers/adminPropertySubmissions.mapper.md).
- Attach **dynamic per-row actions** via [adminListingRowActions.constants.md](../constants/adminListingRowActions.constants.md). **Approve** opens a confirm modal then `POST /admin/property-submissions/{submissionId}/review` with `{ "action": "approve" }`.
- **Assign Agent** and **Reassign** open [AssignAgentModal.md](../components/AssignAgentModal.md) (`GET /agents`); both call `PATCH /admin/properties/{propertyId}/assign-agent` with `{ "agent_id": "…" }` then refresh the table. **Reject** opens [RejectSubmissionModal.md](../components/RejectSubmissionModal.md) then `POST /admin/property-submissions/{submissionId}/review` with `{ "action": "reject", "reason": "…" }`. **Unassign** opens a confirm modal then `PATCH /admin/properties/{propertyId}/assign-agent` with `{ "agent_id": null }`.
- Expose `approveConfirmModal`, `assignAgentModal`, `rejectSubmissionModal`, and `unassignConfirmModal` for [ManageListingsScreen.md](../screens/ManageListingsScreen.md).
- Expose the same screen contract as `useAgentListingsTable` except: no search filter, no delete confirm modal, `canViewDelete: false`.
- Status filter options: `submitted`, `approved`, `rejected` only.

# Imports

- `useGetAdminPropertySubmissions` from `../mutations/property.mutation`
- `mapAdminPropertySubmissionListItems` from `../mappers/adminPropertySubmissions.mapper`
- `buildMyListingTableColumns`, listing table constants

# Exports

- `useAdminPropertySubmissionsTable({ enabled?: boolean })`

# API Usage

| Method | Path | Auth |
| --- | --- | --- |
| GET | `/admin/property-submissions?status=&page=&pageSize=` | Yes |
| GET | `/agents?page=&pageSize=&sortBy=invited_at&sortOrder=desc` | Yes — assign-agent modal |
| PATCH | `/admin/properties/{propertyId}/assign-agent` | Yes — `{ "agent_id": "…" }` or `{ "agent_id": null }` to unassign |
| POST | `/admin/property-submissions/{submissionId}/review` | Yes — `{ "action": "approve" }` or `{ "action": "reject", "reason": "…" }` |

# State Management

- Local state for status, pagination, column visibility, sort, and listing rows.
- `enabled: false` skips fetch (used when an agent session uses the agent hook instead).

# Dependencies

- [useManageListingsScreen.md](./useManageListingsScreen.md)
- [adminPropertySubmissions.mapper.md](../mappers/adminPropertySubmissions.mapper.md)
