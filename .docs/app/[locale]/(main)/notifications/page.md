# notifications/page.tsx

**Source:** `app/[locale]/(main)/notifications/page.tsx`

## File Overview

Protected route for the full notifications page under `(main)` layout.

## Route

- `/notifications` (with locale prefix, e.g. `/en/notifications`)

## Responsibilities

- Client wrapper that calls `useAuthorize("NOTIFICATIONS")` before rendering `NotificationScreen`.
- Shows `LoadingScreen` when auth finished loading and `user` is still absent (redirect pending).

## Exports

- Default `NotificationsPage`

## Dependencies

- `NotificationScreen`
- `useAuthorize`, `LoadingScreen`
