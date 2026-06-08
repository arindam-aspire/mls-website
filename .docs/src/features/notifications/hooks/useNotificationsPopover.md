# useNotificationsPopover

**Source:** `src/features/notifications/hooks/useNotificationsPopover.ts` (Client Component hook)

## File Overview

Logic hook for the header notifications popover: fetch list, unread indicator, relative timestamps, and item selection (mark read + navigate).

## Responsibilities

- Fetch notifications list with popover list params when popover opens (`hasOpened`); does **not** fetch unread count.
- Receives `hasUnread` from header for mark-all-as-read button state.
- Resolve navigation href and trigger mark-read for unread items.

## Exports

- `useNotificationsPopover`

## State Management

- `useGetNotifications(notificationPopoverListParams)`
- `useMarkNotificationRead`

## API Usage

- `GET /notifications?page=1&pageSize=5&includeArchived=false` (lazy, on popover open)
- `POST /notifications/:id/read` on unread item select

## Navigation

- `useRouter().push(href)` with href from `resolveNotificationHref`.

## Return values

Localized labels (`popoverTitle`, empty/error/see-all copy), `items`, `hasUnread`, loading/error/empty flags, `onOpen`, `onSelectNotification`, `getRelativeTime`.

## Dependencies

- `notification.mutation.ts`, `resolveNotificationHref.ts`, `formatNotificationRelativeTime.ts`
- i18n: `notifications`, `common`
