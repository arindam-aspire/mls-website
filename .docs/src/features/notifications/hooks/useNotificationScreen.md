# useNotificationScreen

**Source:** `src/features/notifications/hooks/useNotificationScreen.ts` (Client hook)

## File Overview

Screen-level logic for `NotificationScreen`: copy, unread badge gate, mark-all-read mutation, archived filter toggle, and paginated notification list fetch.

## Responsibilities

- Resolve `notifications` i18n strings (`pageTitle`, `pageSubtitle`, `markAllRead`, `archived`).
- Fetch notifications via `GET /notifications` with `pageSize: 10` and `includeArchived` from `showArchived`.
- Track `page` for pagination (UI not wired yet).
- Expose list data and loading/error state for future list rendering.

## Imports

- `next-intl` — `useTranslations("notifications")`
- `../constants/notification.constants` — `NOTIFICATION_LIST_PAGE`, `NOTIFICATION_LIST_PAGE_SIZE`
- `./useHeaderNotificationUnreadCount`
- `../mutations/notification.mutation` — `useGetNotifications`, `useMarkAllNotificationsRead`

## Exports

- `useNotificationScreen()`

## State Management

- Local: `showArchived`, `page` (`useState`).
- Server: unread count query; notification list query; mark-all mutation.

## API Usage

| Call | When |
| --- | --- |
| `GET /notifications?page=&pageSize=10&includeArchived=` | On mount and when `page` / `showArchived` changes |
| `GET /notifications/unread-count` | Via header hook — enables/disables mark all |
| `PUT /notifications/read-all` | Mark all button — invalidates list + unread count |

Query key: `[NOTIFICATIONS_QUERY_KEY, page, pageSize, includeArchived]` (shared invalidation with popover on mark read).

## Return values

| Key | Type | Description |
| --- | --- | --- |
| `title` | `string` | Page heading |
| `subtitle` | `string` | Page description |
| `markAllAsReadLabel` | `string` | Mark all button label |
| `archivedLabel` | `string` | Archived button label |
| `showArchived` | `boolean` | Archived filter active |
| `canMarkAllAsRead` | `boolean` | Unread badge or unread items on current page |
| `isMarkingAllRead` | `boolean` | Mark-all mutation pending |
| `items` | `NotificationRecord[]` | Current page items |
| `isLoading` | `boolean` | List fetch in progress |
| `isError` | `boolean` | List fetch failed |
| `pagination` | object | `page`, `pageSize`, `total`, `totalPages`, `hasNext`, `hasPrevious` |
| `listParams` | `NotificationListParams` | Active query params |
| `onMarkAllAsRead` | `() => void` | Mark all handler |
| `onToggleArchived` | `() => void` | Toggle archived; resets page to 1 |
| `onPageChange` | `(page: number) => void` | Pagination handler (UI TBD) |
| `refetch` | `() => void` | Manual list refetch |

## Dependencies

- `NotificationScreen.tsx` (toolbar only for now; list UI pending)
- `notification.service.ts` — `getNotifications`
- Shared invalidation with popover via `NOTIFICATIONS_QUERY_KEY`

## Notes

- List display is intentionally not implemented in `NotificationScreen` yet; hook exposes `items` and `pagination` for follow-up UI work.
- Toggling **Archived** resets `page` to `NOTIFICATION_LIST_PAGE` (1).
