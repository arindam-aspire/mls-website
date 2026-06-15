# File Overview

Maps `GET /agent-properties` rows (`AgentPropertyListItem`) into `@abdoun/abdoun-library` `ListTableView` row shape via `mapSubmissionApiListingToPropertyListing`.

**Source:** `src/features/property/mappers/agentPropertiesList.mapper.ts`

# Responsibilities

- Convert API list items to library `PropertyListing` rows for `ListTableView`.
- Delegate base row mapping to `mapSubmissionApiListingToPropertyListing`, then override `status.key` for display:
  - `submission_status === "approved"` or `"rejected"` → use `submission_status`
  - otherwise → use `submission_workflow_label` (fallback `status_slug`)
- Override `validatedDate` with `submission_submitted_at` for the **Submission** column (submitted-on line) and set `reviewedDate` from `submission_reviewed_at` for **Reviewed on**.
- Pass optional `submitted_by` from the API row into `SubmissionApiListing.submission_submitted_by` (admin submissions prefer `submitted_by_name`, then `submitted_by`).
- When resolved display status is `"rejected"`, attach per-row `actions` from `buildRejectedListingRowActions` (View, Edit, View Rejected Reason, Delete) with visibility from `can_edit_submission`, `can_delete_submission`, and `submission_review_reason`.
- Other workflow statuses omit `actions` so row menus follow `STATUS_WORKFLOW_ACTION_MATRIX` in the library.

# Exports

- `mapAgentPropertyListItem(item, options?)` — single row
- `mapAgentPropertyListItems(items, options?)` — array (empty-safe)
- `MapAgentPropertyListItemsOptions` — optional `rejectedRowActionLabels` for i18n action labels

# Dependencies

- `SubmissionApiListing` uses `submitted_on` (maps from API `submission_submitted_at`); library `PropertyListing` exposes `submitted_on` and `submission_submitted_by`.
- `buildRejectedListingRowActions` in `myListingRowActions.constants.ts`
- `AgentPropertyListItem` in `property.types.ts`
- Used by `useListingPropertyScreen` and `useManageListingsScreen` (via `useAgentListingsTable`)
