# groupLeadConversationByDate

### File Overview

Groups lead conversation messages by calendar day for the timeline UI in `LeadConversationPanel`.

### Responsibilities

- Thin wrapper around `groupByCalendarDate` using each message’s `sentAt`.
- Resolve group labels via injected callback (`Today`, `Yesterday`, or formatted date).

### Exports

- `groupLeadConversationByDate(items, resolveGroupLabel, now?)`
- `LeadConversationDateGroup`

### Dependencies

- `LeadConversationMessageDisplay` from `lead.types`
- `groupByCalendarDate`
- Requires `sentAt` ISO timestamps on display rows
