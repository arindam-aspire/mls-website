# LeadConversationPanel

### File Overview

Notification-history-style conversation panel for the lead details **Conversation** tab.

### Responsibilities

- Render a dated timeline grouped by calendar day (`Today`, `Yesterday`, or formatted date).
- Show each message in a card with avatar, sender name, role badge, time, message body, recipient, channel, and sent status.
- Draw a vertical timeline with colored dots (primary for agent, info for customer).
- Show header with title, subtitle, message count, and reply action.
- Render loading skeletons and an illustrated empty state with optional reply CTA.

### Props

| Prop | Type | Description |
| --- | --- | --- |
| `title` | string | Panel heading |
| `subtitle` | string | Helper text under the title |
| `messageCountLabel` | string | Localized count summary |
| `items` | `LeadConversationMessageDisplay[]` | Mapped conversation rows from hook |
| `resolveDateGroupLabel` | `(date, dayDiff) => string` | Builds group headings |
| `toRecipientLabel` | `(name) => string` | Recipient row label |
| `channelWithValueLabel` | `(channel) => string` | Channel row label |
| `sentBadgeLabel` | string | Sent status pill |
| `canReply` | boolean | Shows reply button when true |
| `onReply` | `() => void` | Opens reply modal |
| `isLoading` | boolean | Shows thread skeletons |

### UI Details

- Outer card `rounded-xl`; controls use `rounded-lg`; message cards use semantic tokens for light/dark.
- Scrollable timeline area (`max-h-[40rem]`) with left border and per-message dots.
- Agent messages: primary dot; customer messages: info dot.

### Dependencies

- `LeadDetailsScreen` via `useLeadDetailsScreen` labels + conversation items.
- `leadDisplay.utils` for sender/recipient/variant mapping.
- `groupLeadConversationByDate` for day grouping.
