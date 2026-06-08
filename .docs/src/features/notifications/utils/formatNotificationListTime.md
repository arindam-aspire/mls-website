# formatNotificationListTime

**Source:** `src/features/notifications/utils/formatNotificationListTime.ts`

## File Overview

Formats notification timestamps for the full-page list row (message row, right-aligned).

## Rules

| Age | Example format |
| --- | --- |
| Today (&lt; 60 min or same calendar day) | Relative (`2 hours ago`) via `formatNotificationRelativeTime` |
| Yesterday | Time only (`3:56 PM`) |
| 2–7 days ago | Weekday + time (`Sat 3:56 PM`) |
| 8–30 days ago | Weekday + date (`Wed 6/3`) |
| Older | Full date (`4/14/2026`) |

Uses `Intl.DateTimeFormat` with the active locale.

## Exports

- `formatNotificationListTime(isoDate, locale, now?)`
