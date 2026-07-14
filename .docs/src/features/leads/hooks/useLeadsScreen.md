# useLeadsScreen

### File Overview

Logic hook for the leads list screen.

### Responsibilities

Debounced search, filters, pagination, React Query list with refetch interval, row mapping, navigation to detail.

### API Usage

`getLeadList` → `GET /leads`.

### Exports

`useLeadsScreen`

### Notes

Sends optional `search`, `assigned_agent_id`, `property_id`, `date_from`, `date_to` query params; backend may ignore until supported.
