# leadStatus.constants

### File Overview

Defines the supported lead statuses, status filters, status-modal choices, close-request eligibility, and semantic badge styles.

### Responsibilities

- Validate values against `LEAD_STATUSES`.
- Permit close requests only from `IN_PROGRESS`.
- Keep Update Status limited to `NEW`, `IN_PROGRESS`, `REQUEST_FOR_CLOSE`, and `CLOSED`.
- Retain all other backend statuses for display, badges, and list filtering without showing them as modal transition choices.
- Mark `CLOSED_WON` and `CLOSED_LOST` as admin-approval outcomes so generic status updates cannot bypass closure approval.
- Identify terminal statuses that disable ordinary lead actions.
- Provide semantic light/dark-safe status badge classes.

### Imports

- `LEAD_STATUSES`, `LeadStatus` from `lead.types.ts`.

### Exports

- `LEAD_STATUS_FILTER_VALUES`
- `LeadStatusFilterValue`
- `isLeadStatus`
- `LEAD_STATUSES_ALLOWING_REQUEST_CLOSE`
- `LEAD_UPDATABLE_STATUSES`
- `LEAD_ADMIN_APPROVAL_STATUSES`
- `LEAD_TERMINAL_STATUSES`
- Compatibility alias for agent status choices
- `LEAD_STATUS_BADGE_CLASS`

### Flow Description

Update Status shows the four primary lifecycle states. `NEW` and `IN_PROGRESS` use the existing status mutation; `REQUEST_FOR_CLOSE` uses the dedicated request action when permitted; `CLOSED` remains visible but disabled because only the administrator approval action may close a lead.

### Dependencies

Used by lead list filters, status badges, and `useLeadDetailsScreen`.

### Notes

Backend transition validation remains mandatory because frontend constants are not an authorization boundary.
