# leadDisplay.utils

### File Overview

Display helpers for lead list/detail screens and timeline fallback rendering.

### Responsibilities

- Resolve safe UI labels for status, property title, customer, and assigned agent.
- Resolve property address from lead snapshot first, then property details fallback.
- Resolve assigned agent names from lead payload, embedded property snapshot, property details, cache, or logged-in user.
- Build a synthetic timeline when activity list API is unavailable.
- Normalize incomplete activity API records and derive missing titles from event types.
- Format lead dates for locale-aware display.

### Imports

- Lead types from `src/features/leads/types/lead.types.ts`
- Property details type from `src/features/property/types/property.types.ts`
- Status guard from `leadStatus.constants`

### Exports

- `resolveLeadStatus`
- `resolveLeadPropertyTitle`
- `resolveLeadPropertyAddress`
- `resolveLeadCustomerName`
- `resolveAssignedAgentLabel`
- `hasAssignedLeadAgent`
- `buildLeadTimelineFromLead`
- `normalizeLeadMessageFromApi`
- `resolveLeadMessageSenderName`
- `mapLeadMessagesToConversationDisplay`
- `formatLeadDate`
- `formatLeadTime`
- `formatLeadShortDate`
- `mapLeadNotesToDisplay`
- `mapLeadActivityToDisplay`
- `buildLeadTimelineFromLead` (accepts optional `assignedAgentName`)

### Notes

- Assigned agent label prefers: `assigned_agent_name` → embedded `assigned_agent` snapshot name → property agent when IDs match → cached agents list (no extra request) → logged-in user → property listing agent name → empty value (never raw agent id).
- Activity mapping safely handles missing `title`, `type`, `id`, actor, and timestamp fields so malformed API records cannot crash the Activity tab.
