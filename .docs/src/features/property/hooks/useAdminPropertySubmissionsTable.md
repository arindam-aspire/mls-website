# File Overview

Admin manage-listings table hook: fetches `GET /admin/property-submissions`, maps rows for `ListTableView`, and exposes filters, sort, pagination, workflow confirmations, and status mutations.

**Source:** `src/features/property/hooks/useAdminPropertySubmissionsTable.ts`

# Responsibilities

- Call `GET /admin/property-submissions` with `page`, `pageSize`, and optional `status`.
- Map `AdminPropertySubmissionListItem` rows via [adminPropertySubmissions.mapper.md](../mappers/adminPropertySubmissions.mapper.md).
- Attach **dynamic per-row actions** via [adminListingRowActions.constants.md](../constants/adminListingRowActions.constants.md). Agency admins retain their assigned-agent review flow. Super Admin receives Approve and Reject only when the submission has an unassigned agency (`null`, omitted, or empty `agency_id`); agency-assigned property behavior is unchanged.
- **Approve** opens the existing confirm modal then `POST /admin/property-submissions/{submissionId}/review` with `{ "action": "approve" }`.
- **Assign Agent** and **Reassign** open [AssignAgentModal.md](../components/AssignAgentModal.md) (`GET /agents`); both call `PATCH /admin/properties/{propertyId}/assign-agent` with `{ "agent_id": "…" }` then refresh the table. **Reject** opens [RejectSubmissionModal.md](../components/RejectSubmissionModal.md) then `POST /admin/property-submissions/{submissionId}/review` with `{ "action": "reject", "reason": "…" }`. **Unassign** opens a confirm modal then `PATCH /admin/properties/{propertyId}/assign-agent` with `{ "agent_id": null }`.
- Expose `approveConfirmModal`, `assignAgentModal`, `rejectSubmissionModal`, and `unassignConfirmModal` for [ManageListingsScreen.md](../screens/ManageListingsScreen.md).
- Expose the same screen contract as `useAgentListingsTable`, with no search filter. Rejected submissions can expose the existing delete confirmation when the API returns `can_delete_submission`.
- `navigateToPropertyView` opens `/propert-details/{listing.id}` in a new tab.
- Status filter options come from `ADMIN_PROPERTY_SUBMISSION_STATUS_FILTER_VALUES`.

# Imports

- `useTranslations("propertyList.manageListings")`
- `useAuthStore` + `isAgencyUser` / `isSuperAdminUser`
- Admin submission queries/mutations from `property.mutation`
- `mapAdminPropertySubmissionListItems`
- `buildMyListingTableColumns`

# State Management

- Local state for status, pagination, column visibility, sort, and listing rows.
- `enabled: false` skips fetch (used when an agent session uses the agent hook instead).
- Role-derived row-action options keep assignment/reassignment/unassignment and normal assigned-agent review with Agency Admin. Super Admin keeps deactivation and gains only the unassigned-agency review option.

# Flow Description

1. Fetch the current admin submission page and retain raw rows, including `agency`.
2. Resolve role capabilities from the authenticated user.
3. Build row actions from status, assigned-agent state, and agency assignment.
4. For a Super Admin row with an unassigned agency, reuse the existing Approve confirmation or Reject reason modal.
5. Submit the existing review request, show the existing localized success/error toast, and refresh the current page.
6. Rows with an agency continue through the existing Agency Admin workflow without additional Super Admin review actions.

# Dependencies

- [adminListingRowActions.constants.md](../constants/adminListingRowActions.constants.md)
- [adminPropertySubmissions.mapper.md](../mappers/adminPropertySubmissions.mapper.md)
- [ManageListingsScreen.md](../screens/ManageListingsScreen.md)
- [RejectSubmissionModal.md](../components/RejectSubmissionModal.md)
- [AssignAgentModal.md](../components/AssignAgentModal.md)
