# groupByCalendarDate

### File Overview

Generic calendar-day grouping helper used by lead conversation and notes timelines.

### Responsibilities

- Sort items chronologically within each day.
- Sort day groups newest-first.
- Resolve group labels via injected callback (`Today`, `Yesterday`, or formatted date).

### Exports

- `groupByCalendarDate(items, getDateIso, resolveGroupLabel, now?)`
- `CalendarDateGroup<T>`

### Dependencies

- Consumers: `groupLeadConversationByDate`, `LeadNotesPanel`
