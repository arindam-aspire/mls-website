# File Overview

Maps `GET /agent-properties` rows (`AgentPropertyListItem`) into `@abdoun/abdoun-library` `ListTableView` row shape via `mapSubmissionApiListingToPropertyListing`.

**Source:** `src/features/property/mappers/agentPropertiesList.mapper.ts`

# Responsibilities

- Convert API list items to library `PropertyListing` rows for `ListTableView`.
- Delegate status, title, price, and `submission_review_reason` mapping to `mapSubmissionApiListingToPropertyListing`.
- Override `validatedDate` with `submission_submitted_at` for the **Submitted on** column and set `reviewedDate` from `submission_reviewed_at` for **Reviewed on**.
- When `submission_workflow_label === "rejected"`, attach per-row `actions` from `buildRejectedListingRowActions` (View, Edit, View Rejected Reason, Delete) with visibility from `can_edit_submission`, `can_delete_submission`, and `submission_review_reason`.
- Other workflow statuses omit `actions` so row menus follow `STATUS_WORKFLOW_ACTION_MATRIX` in the library.

# Exports

- `mapAgentPropertyListItem(item, options?)` — single row
- `mapAgentPropertyListItems(items, options?)` — array (empty-safe)
- `MapAgentPropertyListItemsOptions` — optional `rejectedRowActionLabels` for i18n action labels

# Dependencies

- `@abdoun/abdoun-library` — `mapSubmissionApiListingToPropertyListing`, `SubmissionApiListing`
- `buildRejectedListingRowActions` in `myListingRowActions.constants.ts`
- `AgentPropertyListItem` in `property.types.ts`
- Used by `useListingPropertyScreen`
