# NotificationPopoverItem

**Source:** `src/features/notifications/components/NotificationPopoverItem.tsx`

## File Overview

Single notification row in the header popover: type icon, title, message, relative time, and unread styling.

## UI Details

- Left: `rounded-lg` icon shell (`size-10`) from `getNotificationIcon(typeKey, eventType)`.
- Unread: `bg-secondary/10`, `hover:bg-secondary/15`, semibold `text-secondary-dark` title, secondary dot.
- Read: neutral text, `hover:bg-page`, muted icon shell.

## Dependencies

- `notification-icons.ts` — `getNotificationIcon` maps API keys like `saved_search.created` → `SAVED_SEARCH_CREATED` → `BookmarkCheck`.
