# Leads feature

Lead management for agency admins, agents, and super admins under `/leads`.

## Architecture

- **Hooks** own React Query, filters, role gating, and mutation orchestration.
- **Screens** render layout and bind hook return values to presentational components / modals.
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

`NEW` → `IN_PROGRESS` → `REQUEST_FOR_CLOSE` → `CLOSED`

- Agent: reply, note, update status (`IN_PROGRESS`), request close.
- Admin / super admin: assign / reassign (`AssignAgentModal`), override status, approve close (`POST …/close`), reject close (`PATCH …/status` → `IN_PROGRESS`).

## Mutations

Toast + invalidate `["leads", …]` query keys for assign / status / close / notes / messages.

`useCreateLead` is used by the property **Email** contact modal: creates a lead with `source: "EMAIL_FORM"`, invalidates the list, and lets the modal show the inquiry success toast. Email delivery is mocked in `lead.service` until the email API is available.

## Real-time

List and detail queries use `refetchInterval` (15s) until a websocket channel exists.

## API gaps (documented)

List returns only documented filters (`status` + optional undocumented query params we send). Notes / messages / activity **list** GETs are attempted; if missing, create actions still work and UI shows empty + helper copy. Timeline falls back to timestamps on the lead object.
