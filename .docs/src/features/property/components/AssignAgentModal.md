# File Overview

Modal to pick an agent when admin clicks **Assign Agent** on manage-listings.

**Source:** `src/features/property/components/AssignAgentModal.tsx`

# Responsibilities

- Render searchable, selectable agent list (`GET /agents`).
- Paginate with **Load more** (`pageSize=10`, `sortBy=invited_at`, `sortOrder=desc`).
- Only **ACTIVE** agents are shown (filtered client-side); status is not displayed in the list.
- Footer shows selected agent + **Assign agent** button (`UserPlus` icon) → `PATCH /admin/properties/{propertyId}/assign-agent` with `{ "agent_id": "…" }`.

# Props

| Prop | Type | Description |
| --- | --- | --- |
| `open` | `boolean` | Modal visibility |
| `listingTitle` | `string` | Shown in description |
| `isAssigning` | `boolean` | Disables UI during assign mutation |
| `onClose` | `() => void` | Close without assign |
| `onAssign` | `(agentId: string) => void` | Continue with selected agent |

# Dependencies

- [useAssignAgentModal.md](../hooks/useAssignAgentModal.md)
- [agent.service.md](../../agent/services/agent.service.md)
- i18n: `propertyList.manageListings.assignAgentModal.*`
