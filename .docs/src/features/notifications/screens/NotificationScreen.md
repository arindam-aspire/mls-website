# NotificationScreen

**Source:** `src/features/notifications/screens/NotificationScreen.tsx` (Client Component)

## File Overview

Full-page notifications view at `/notifications`. Toolbar, grouped main list (non-archived), and archived notifications panel.

## Responsibilities

- Page title/subtitle and toolbar (**Mark all as read**, **Archived**).
- Main list via `NotificationListGroup` (`includeArchived: false`).
- Opens `ArchivedNotificationsPanel` on **Archived** click.
- Pagination on main list when `totalPages > 1`.

## Imports

- `@/src/components/ui/button`
- `../components/ArchivedNotificationsPanel`, `NotificationListGroup`, `NotificationScreenSkeleton`
- `../hooks/useNotificationArchivedPanel`, `useNotificationScreen`

## Actions / Inputs

| Action | Control | Behavior |
| --- | --- | --- |
| Mark all as read | Outline inherit button | `PUT /notifications/read-all` |
| Archived | Solid tertiary button | Opens archived panel (drawer md+, bottom sheet sm) |
| Notification row | Card content click | If unread → mark read, then navigate |
| Archive | Per-item + confirm modal | `POST /notifications/:id/archive` |
| Delete | Per-item + confirm modal | `DELETE /notifications/:id` |
| Unarchive | In archived panel | `POST /notifications/:id/unarchive` |

## Flow Description

1. Main list fetches active notifications.
2. **Archived** opens panel; `useNotificationArchivedPanel` fetches `includeArchived: true` and shows a flat list of items with `archivedAt != null` (no time groups).
3. Archive/unarchive/delete invalidate shared notification queries.

## Dependencies

- `useNotificationScreen`, `useNotificationArchivedPanel`, list/panel components.
