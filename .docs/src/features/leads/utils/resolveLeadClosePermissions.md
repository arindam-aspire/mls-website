# resolveLeadClosePermissions

### File Overview

Pure authorization helper for the lead and property-listing close workflow. Keeps close-request, close-approval, and close-status visibility rules independent from React rendering.

### Responsibilities

- Allow assigned agents **or** agency/super administrators to request closure while the lead is `IN_PROGRESS` and has no pending request.
- Allow only agency administrators and super administrators to approve or reject an existing close request.
- Expose `canViewCloseStatus` so agents never see internal close-status labels, tabs, timeline entries, or badges.
- Deny close actions to owners, registered users, unassigned agents, and users without a matching role.

### Exports

- `resolveLeadClosePermissions`
- `LeadClosePermissions` — `canRequestClose`, `canApproveOrRejectClose`, `canViewCloseStatus`

### Flow Description

1. An assigned agent or agency administrator may request closure from `IN_PROGRESS`.
2. The request remains pending while `request_close_at` exists and `closed_at` does not.
3. Agency administrators see close-status badges, the Close request tab, and approve/reject controls.
4. Agents may submit a close request but see `IN_PROGRESS` instead of `REQUEST_FOR_CLOSE` / `CLOSED` labels.
5. Approval calls the dedicated close endpoint; rejection returns the lead to `IN_PROGRESS`.

Assignment checks compare the signed-in user id against `assigned_agent_id`, property agent ids (`agent_user_id`, etc.), and lead snapshots — not a direct id match only.

Status values from the API are normalized (`in progress` → `IN_PROGRESS`) before permission checks so the Update Status modal and `canRequestClose` stay aligned.

### Dependencies

Used by `useLeadDetailsScreen` and `useLeadsScreen` (via display helpers).

### Notes

This helper protects the UI flow only. The backend must independently validate caller role, assignment, pending request, and allowed transitions.
