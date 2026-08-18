# useLeadDetailsScreen

### File Overview

Logic hook for lead details: queries, role permissions, modals, and mutations.

### Responsibilities

- Fetch detail + optional notes/messages/activity.
- Fetch property details when `property_id` exists to resolve property address and assigned agent display name.
- Gate agent vs admin actions via `isAgentUser` / `isAgencyUser` / `isSuperAdminUser`.
- Resolve close permissions separately: only the assigned agent may request closure from `IN_PROGRESS`, while only agency/super administrators may approve or reject a pending request.
- Build Update Status with only `NEW`, `IN_PROGRESS`, `REQUEST_FOR_CLOSE`, and `CLOSED`; preserve disabled state for close-related transitions.
- Use the static canonical list as fallback because the current API contract has no available-statuses endpoint.
- Keep Update Status available for non-terminal leads, including while an administrator reviews a pending close request.
- Validate reply/note required fields before mutate.
- Confirm request-close and approve-close via modal open state.
- Route `REQUEST_FOR_CLOSE` through the dedicated request-close mutation and keep final won/lost outcomes disabled so status updates cannot bypass admin approval.
- Treat `request_close_at` without `closed_at` as pending admin approval, while preserving the current lead status.
- Explicitly refetch lead detail after admin approval so the closed status is current.
- Re-check close permissions in request, approve, and reject callbacks before starting a mutation.
- Do not expose lead-detail email, call, or WhatsApp handlers; customer contact actions remain outside this screen.

### API Usage

Detail, notes, messages, activity GETs; optional property details GET for display enrichment; assign, status, request-close, close, notes, messages POSTs/PATCHs. No endpoint currently returns available status options.

### Exports

`useLeadDetailsScreen`
