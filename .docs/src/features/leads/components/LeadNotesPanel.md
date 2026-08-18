# LeadNotesPanel

### File Overview

Notification-history-style notes panel for the lead details **Internal notes** tab. Mirrors `LeadConversationPanel` layout.

### Responsibilities

- Render a dated timeline grouped by calendar day (`Today`, `Yesterday`, or formatted date).
- Show each note in a card with avatar, author name, internal badge, time, note body, and saved status.
- Draw a vertical timeline with secondary-colored dots.
- Show header with title, subtitle, note count, and add-note action.
- Render loading skeletons and an illustrated empty state with optional add-note CTA.

### Props

| Prop | Type | Description |
| --- | --- | --- |
| `title` | string | Panel heading |
| `subtitle` | string | Helper text under the title |
| `noteCountLabel` | string | Localized count summary |
| `items` | `LeadNoteDisplay[]` | Mapped note rows from hook |
| `resolveDateGroupLabel` | `(date, dayDiff) => string` | Builds group headings |
| `internalBadgeLabel` | string | Role/type pill on each card |
| `savedBadgeLabel` | string | Saved status pill |
| `canAddNote` | boolean | Shows add button when true |
| `onAddNote` | `() => void` | Opens add-note modal |
| `isLoading` | boolean | Shows thread skeletons |

### UI Details

- Outer card `rounded-xl`; controls use `rounded-lg`; note cards use semantic tokens for light/dark.
- Scrollable timeline area (`max-h-[40rem]`) with left border and per-note dots.

### Dependencies

- `LeadDetailsScreen` via `useLeadDetailsScreen` labels + note items.
- `mapLeadNotesToDisplay` in `leadDisplay.utils`.
- `groupByCalendarDate` for day grouping.
