# lead.types

### File Overview

Type contracts for lead list/detail entities, mutations, notes/messages/activity, and lead tabs.

### Responsibilities

- Define lead workflow enums (`LeadStatus`, `LeadSource`, `LeadMessageChannel`).
- Define API envelope/list/detail shapes used by lead services.
- Define request payload shapes for assign/status/close/note/message mutations.
- Define optional enriched lead fields used for UI fallbacks.
- Define the complete lead workflow status union used by API records, list filters, and badges: new, progress, contact/qualification/follow-up stages, meeting/proposal/negotiation, close request, won/lost outcomes, hold, cancellation, and legacy closed records. The Update Status modal intentionally exposes only four primary lifecycle choices.

### Key Types

- `Lead` includes assignment identifiers and optional display enrichments (`assigned_agent_name`, `assigned_agent` snapshot).
- `LeadAssignedAgentSnapshot` models optional embedded assignee profile fields (`fullName`, `full_name`, `name`).
- `LeadDetailTab` constrains detail navigation to `overview | conversation | notes | timeline | close`.
- `LeadStatus` is derived from the single `LEAD_STATUSES` tuple so status consumers do not maintain duplicate mappings.

### Dependencies

- Consumed by `lead.service.ts`, `lead.mutation.ts`, `useLeadDetailsScreen.ts`, and display utils.
