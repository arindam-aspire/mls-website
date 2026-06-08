# notifications/page.tsx

**Source:** `app/[locale]/(main)/notifications/page.tsx`

## File Overview

Protected route for the full notifications page under `(main)` layout.

## Route

- `/notifications` (with locale prefix, e.g. `/en/notifications`)

## Responsibilities

- Guard with `useAuthorize("NOTIFICATIONS")` (same roles as favourites / saved searches).
- Render `NotificationScreen` placeholder when authorized.

## Exports

- Default `NotificationsPage`

## Dependencies

- `NotificationScreen`
- `useAuthorize`, `LoadingScreen`
