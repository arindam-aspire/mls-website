# File Overview

Maps `GET /admin/property-submissions` rows (`AdminPropertySubmissionListItem`) into the shared `MyListingTableRow` shape by normalizing to `AgentPropertyListItem` and reusing `mapAgentPropertyListItems`.

**Source:** `src/features/property/mappers/adminPropertySubmissions.mapper.ts`

# Responsibilities

- `mapAdminSubmissionToAgentPropertyListItem` — field mapping (`property_title` → `title`, `status` → `submission_workflow_label`, `submitted_by_name` / `submitted_by` → `submitted_by`, etc.).
- `mapAdminPropertySubmissionListItems` — batch map for the table hook; when `adminRowActionLabels` is provided, sets per-row `actions` via `buildAdminListingRowActions` from `status` and `has_assigned_agent`.

# Notes

- Admin list payload does not include `submission_review_reason`; rejected-reason modal shows the empty state for admin rows.
- `can_edit_submission` / `can_delete_submission` are `false` for admin-mapped rows.
