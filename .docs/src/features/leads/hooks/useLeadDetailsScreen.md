# useLeadDetailsScreen

### File Overview

Logic hook for lead details: queries, role permissions, modals, and mutations.

### Responsibilities

- Fetch detail + optional notes/messages/activity.
- Gate agent vs admin actions via `isAgentUser` / `isAgencyUser` / `isSuperAdminUser`.
- Validate reply/note required fields before mutate.
- Confirm request-close and approve-close via modal open state.

### API Usage

Detail, notes, messages, activity GETs; assign, status, request-close, close, notes, messages POSTs/PATCHs.

### Exports

`useLeadDetailsScreen`
