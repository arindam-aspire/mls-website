# ArchivedNotificationsPanel

**Source:** `src/features/notifications/components/ArchivedNotificationsPanel.tsx` (Client Component)

## File Overview

Drawer (md+) or bottom sheet (sm) that lists archived notifications. Opened from **Archived** on `NotificationScreen`.

## Responsibilities

- Headless UI `Dialog` with backdrop; responsive layout via `useMatchMedia("(max-width: 767px)")`.
- **Desktop drawer:** fixed width `w-full min-w-md max-w-md`, slides from the end (RTL-aware).
- **Mobile sheet:** full-width bottom sheet with drag handle.
- Flat list of archived items (no time-group headings).
- Loading skeleton, error, empty, and pagination states.

## Imports

- `@headlessui/react` — `Dialog`, `DialogPanel`, `DialogTitle`, `CloseButton`
- `@/src/components/ui/button`
- `@/src/hooks/useMatchMedia`
- `./ArchivedNotificationListItem`, `./ArchivedNotificationsPanelSkeleton`

## Props / Parameters

Receives copy, `items: NotificationRecord[]`, pagination, loading/error/empty flags, and callbacks from `useNotificationArchivedPanel`.

## UI Details

- Drawer panel: `min-w-md max-w-md` (fixed md width on desktop).
- Mobile sheet: `w-full`, `rounded-t-xl`, `max-h-[min(90dvh,100%)]`.
- Semantic tokens (`bg-surface`, `border-secondary/15`, `text-muted`).
- Close button: `rounded-lg`, 44×44 tap target.

## Flow Description

1. Parent sets `open={true}` when user clicks **Archived**.
2. Hook fetches notifications with `includeArchived: true`; panel renders only rows where `archivedAt != null`.
3. User can unarchive, select (mark read + navigate), paginate, or close.

## Dependencies

- `useNotificationArchivedPanel`, `ArchivedNotificationListItem`, `NotificationScreen`.
