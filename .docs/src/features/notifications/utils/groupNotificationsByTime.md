# groupNotificationsByTime

**Source:** `src/features/notifications/utils/groupNotificationsByTime.ts`

## File Overview

Groups notification records into ordered time buckets for the full-page list.

## Group order

1. **Just now** — less than 60 minutes ago
2. **Earlier today** — same calendar day, 60+ minutes ago
3. **Yesterday**
4. **Last week** — 2–7 days ago
5. **Last month** — 8–30 days ago
6. **Month names** — same calendar year, older than 30 days (locale via `Intl`)
7. **Last year** — previous calendar year
8. **Years** — e.g. 2024, 2023 (descending)

## Exports

- `groupNotificationsByTime(items, locale, labels, now?)`
- `NotificationTimeGroup`, `NotificationTimeGroupId`

## Dependencies

- `buildNotificationGroupLabels` for fixed bucket labels
- `NotificationRecord` type
