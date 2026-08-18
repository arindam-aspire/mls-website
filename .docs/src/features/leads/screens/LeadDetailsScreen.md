# LeadDetailsScreen

### File Overview

Lead detail with overview / conversation / notes / timeline / close tabs and agent/admin action modals.

### Responsibilities

- Display customer, property, inquiry, and status cards.
- Property card includes property address when available from lead snapshot/property details.
- Status card renders assigned agent name only; never shows raw `assigned_agent_id`.
- Host conversation, notes, timeline, and close panels.
- Conversation messages show sender name, localized channel, sent timestamp, recipient context, and a notification-history-style timeline via `LeadConversationPanel`.
- Internal notes use the same timeline card pattern via `LeadNotesPanel` (author, date groups, saved badge).
- Activity events use `LeadActivityPanel` with type badge, description (lead number/source/agent), actor, and datetime — not date-only rows.
- Wire reply / note / status / request-close / approve / reject / assign modals.
- Render one Update Status action; the former Override Status action and its event route are removed.
- Omit direct email, call, and WhatsApp customer actions and their contact modal from Lead Details.

### Imports

- `useLeadDetailsScreen`, `LeadStatusBadge`, `LeadConversationPanel`, `AssignAgentModal`, `ConfirmModal`, UI Modal suite

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

Role-gated action buttons; modal forms with required reply/note validation; confirm before requesting closure or approving/rejecting a pending request. Update Status remains visible for every non-terminal lead, including pending-close review, and shows only New, In Progress, Request to Close, and Closed with selected/disabled styling supplied by the shared `Select`. Assigned agents can request closure; only agency and super administrators receive approval controls.

### UI Details

Responsive action wrap, horizontal tab scroller, `rounded-xl` cards, semantic tokens, light/dark safe.

Reply / note / status form modals follow the shared modal layout: `ModalDescription` lives inside `ModalHeader` (with `pe-10` so title copy clears the absolute close button), and `ModalContent` uses `px-4 sm:px-6` so fields align with header/footer padding.

### Flow Description

Load detail → derive role/assignment close permissions → pick tab → assigned agent requests closure → administrator approves or rejects → invalidate queries → toast. A pending request remains visibly awaiting admin approval for non-admin viewers.

### Dependencies

`useLeadDetailsScreen`, property `AssignAgentModal`.

### Notes

Reject close maps to status `IN_PROGRESS` (no dedicated reject endpoint in current API). Final closure is never exposed as a generic status update and always uses the admin-only approval action.
