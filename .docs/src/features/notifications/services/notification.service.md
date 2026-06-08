# notification.service

**Source:** `src/features/notifications/services/notification.service.ts`

## API Usage

| Function | Method | Endpoint | Auth |
| --- | --- | --- | --- |
| `getNotifications` | GET | `/notifications?page=&pageSize=&includeArchived=` | yes |
| `getUnreadNotificationCount` | GET | `/notifications/unread-count` | yes |
| `markNotificationRead` | PUT | `/notifications/:id/read` | yes |
| `markAllNotificationsRead` | PUT | `/notifications/read-all` | yes |
| `archiveNotification` | POST | `/notifications/:id/archive` | yes |
| `unarchiveNotification` | POST | `/notifications/:id/unarchive` | yes |
| `deleteNotification` | DELETE | `/notifications/:id` | yes |

Example delete: `DELETE /notifications/3b877013-4dac-42ba-b771-5498dc2a2300`

## Exports

- `getNotifications`, `getUnreadNotificationCount`, `markNotificationRead`, `markAllNotificationsRead`, `archiveNotification`, `deleteNotification`

## Notes

- Uses `apiClient.request` with `auth: true`.
- Delete is wired through `useDeleteNotification` → `NotificationListItem` confirm modal.
