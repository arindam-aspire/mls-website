# Leads feature

Lead management for agency admins, agents, and super admins under `/leads`.

## Architecture

- **Hooks** own React Query, filters, role gating, and mutation orchestration.
- **Screens** render layout and bind hook return values to presentational components / modals.
- **Detail enrichment**: lead detail fetches property details when needed to show property address and assigned agent name when lead payload lacks those display fields.
- **Services** call `/api/v1/leads*` via `apiClient`.
- **Mutations** toast + invalidate `["leads", …]` query keys.
- **List UI** reuses library `AgentListView` (same table + numbered pagination as the Agents page) via `LeadList`.

## Routes

| Path | Screen | Permission |
| --- | --- | --- |
| `/leads` | `LeadsScreen` | `LEADS` |
| `/leads/[leadId]?tab=` | `LeadDetailsScreen` | `LEADS` |

Detail tabs: `overview` \| `conversation` \| `notes` \| `timeline` \| `close`.

## Status flow

`NEW` → `IN_PROGRESS` → close request → admin approval → `CLOSED`

- `REQUEST_FOR_CLOSE` is not available in the generic Update Status modal; an assigned agent must use the dedicated `POST …/request-close` action.
- A pending request is identified by `request_close_at` without `closed_at`; the current status remains unchanged until approval.
- Assigned agent: reply, note, update through the four primary lifecycle choices, and request close while the lead is `IN_PROGRESS`.
- Admin / super admin: assign / reassign (`AssignAgentModal`), update ordinary status through the same Update Status action, approve a pending close (`POST …/close`, then refetch detail), or reject it (`PATCH …/status` → `IN_PROGRESS`).
- The old Override Status action is removed. Update Status is limited to New, In Progress, Request to Close, and Closed.
- Owners, registered users, unassigned agents, and non-admin roles cannot approve or reject closure.
- UI handlers re-check permissions before submitting; the backend must enforce the same role, assignment, pending-request, and transition rules.

## Mutations

Toast + invalidate `["leads", …]` query keys for assign / status / close / notes / messages.

`useCreateLead` is used by the property **Email** contact modal: creates a lead with `source: "EMAIL_FORM"`, invalidates the list, and lets the modal show the inquiry success toast. Email delivery is mocked in `lead.service` until the email API is available.

## Real-time

List and detail queries use `refetchInterval` (15s) until a websocket channel exists.

## API gaps (documented)

List returns only documented filters (`status` + optional undocumented query params we send). Notes / messages / activity **list** GETs are attempted; if missing, create actions still work and UI shows empty + helper copy. Timeline falls back to timestamps on the lead object.
