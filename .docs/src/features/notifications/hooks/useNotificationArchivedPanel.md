# useNotificationArchivedPanel

**Source:** `src/features/notifications/hooks/useNotificationArchivedPanel.ts`

## File Overview

Hook for the archived notifications drawer/sheet: fetch, filter, unarchive, and navigation.

## Responsibilities

- Fetch paginated list with `includeArchived: true` when panel is open (`enabled: open`).
- Filter API items to those with non-null `archivedAt`; sort newest first by `createdAt`.
- Expose flat `items` (no time grouping).
- Handle unarchive mutation, mark-read on select, and panel close/reset page.

## API Usage

| Hook / call | Endpoint |
| --- | --- |
| `useGetNotifications` | `GET /notifications?page&pageSize&includeArchived=true` |
| `useMarkNotificationRead` | `PUT /notifications/:id/read` |
| `useUnarchiveNotification` | `POST /notifications/:id/unarchive` |

## State Management

- Local: `page`, `unarchivingId`.
- Resets `page` to `NOTIFICATION_LIST_PAGE` when panel closes.

## Return values

Labels (i18n), `items`, `pagination`, `isLoading`, `isError`, `isEmpty`, `getDisplayTime`, and handlers (`onClosePanel`, `onPageChange`, `onSelectNotification`, `onUnarchiveNotification`).

## Notes

- Main list uses `includeArchived: false`; archived panel is the only consumer of archived rows in the UI.
- Empty state is based on filtered archived items, not raw API page length.
