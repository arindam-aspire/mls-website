# useHeaderNotificationUnreadCount

**Source:** `src/features/notifications/hooks/useHeaderNotificationUnreadCount.ts`

## File Overview

Header-only hook that fetches notification unread count for the bell indicator. Used from `useProtectedHeader` after the logged-in user is available — **not** from the popover list hook.

## API Usage

- `GET /notifications/unread-count` via `useGetUnreadNotificationCount`
- Enabled when `Boolean(user)` in `useProtectedHeader` (stable after login; not tied to route changes).
- `staleTime: Infinity`, `refetchOnMount/WindowFocus/Reconnect: false` — refetches only when mark-read mutations invalidate the notifications query key.

## Exports

- `useHeaderNotificationUnreadCount`

## Return values

| Key | Description |
| --- | --- |
| `unreadCount` | Raw count from API |
| `hasUnread` | `unreadCount > 0` — drives header red dot |

## Dependencies

- `notification.mutation.ts` — `useGetUnreadNotificationCount`
- Invalidated when mark-read / mark-all-read mutations succeed
