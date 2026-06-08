# NotificationListItem

**Source:** `src/features/notifications/components/NotificationListItem.tsx` (Client Component)

## File Overview

Single notification card on the full-page list with icon, copy, relative time, archive, and delete actions.

## Responsibilities

- Present notification title, message, icon, unread styling.
- Main content click → `onSelect` (mark read + navigate from hook).
- Archive / Delete buttons open `ConfirmModal`; archive confirm uses solid tertiary button + tertiary `Archive` modal icon.

## Props

| Prop | Description |
| --- | --- |
| `notification` | API record |
| `relativeTime` | Formatted timestamp |
| `showArchiveAction` | Hide archive when viewing archived list |
| `onSelect` / `onArchive` / `onDelete` | Handlers from screen hook |

## UI Details

- Shell: `rounded-xl`, no border; unread `bg-secondary/5`, read default `bg-surface`.
- Title row: actions inline from `md` (`hidden md:flex`); below message on smaller screens (`md:hidden`, right-aligned) — same pattern as `SearchCard`.
- Message row: message left, dynamic time right (`formatNotificationListTime`).
