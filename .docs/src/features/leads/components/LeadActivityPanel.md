# LeadActivityPanel

### File Overview

Notification-history-style activity panel for the lead details **Activity** tab. Mirrors conversation/notes timeline layout.

### Responsibilities

- Render a dated timeline grouped by calendar day.
- Show each event in a card with title, type badge, time, description, actor, and full datetime.
- Color timeline dots by event type (created, assigned, close request, closed).
- Show header with title, subtitle, and event count.
- Render loading skeletons and empty state.

### Props

| Prop | Type | Description |
| --- | --- | --- |
| `title` | string | Panel heading |
| `subtitle` | string | Helper text |
| `activityCountLabel` | string | Localized count |
| `items` | `LeadActivityDisplay[]` | Mapped activity rows |
| `byActorLabel` | `(name) => string` | Actor row label |
| `resolveDateGroupLabel` | `(date, dayDiff) => string` | Day group headings |
| `isLoading` | boolean | Skeleton state |

### Dependencies

- `useLeadDetailsScreen` → `mapLeadActivityToDisplay` / `buildLeadTimelineFromLead`
- `groupByCalendarDate`
