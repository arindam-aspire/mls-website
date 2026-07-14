# LeadDetailsScreen

### File Overview

Lead detail with overview / conversation / notes / timeline / close tabs and agent/admin action modals.

### Responsibilities

- Display customer, property, inquiry, and status cards.
- Host conversation, notes, timeline, and close panels.
- Wire reply / note / status / request-close / approve / reject / assign modals.

### Imports

- `useLeadDetailsScreen`, `LeadStatusBadge`, `AssignAgentModal`, `ConfirmModal`, UI Modal suite

### Exports

- `LeadDetailsScreen`

### State Management

All state in `useLeadDetailsScreen`.

### API Usage

`GET /leads/{id}`, optional list GETs for notes/messages/activity, mutations for assign/status/close/notes/messages.

### Navigation

Back → `/leads`. Tab changes update `?tab=`.

### Props / Parameters

| Prop | Type | Description |
| --- | --- | --- |
| `leadId` | string | Lead UUID |
| `initialTab` | string \| null | Optional tab from searchParams |

### Actions / Inputs

Role-gated action buttons; modal forms with required reply/note validation; confirm before request/approve close.

### UI Details

Responsive action wrap, horizontal tab scroller, `rounded-xl` cards, semantic tokens, light/dark safe.

### Flow Description

Load detail → pick tab → act via mutations → invalidate queries → toast.

### Dependencies

`useLeadDetailsScreen`, property `AssignAgentModal`.

### Notes

Reject close maps to status `IN_PROGRESS` (no dedicated reject endpoint in current API).
