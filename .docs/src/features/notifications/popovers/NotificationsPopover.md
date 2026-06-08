# NotificationsPopover

**Source:** `src/features/notifications/popovers/NotificationsPopover.tsx` (Client Component)

## File Overview

Header notification bell popover for authenticated users in the protected layout. Mirrors the saved-search popover pattern: lazy refetch on open, list of recent items, empty/error states, and a “see all” link.

## Responsibilities

- Render circular bell trigger with unread indicator dot when any loaded item is unread.
- Show up to five notifications from `GET /notifications?page=1&pageSize=5&includeArchived=false`.
- Display loading skeletons, error message, empty state, or scrollable list.
- Link footer to `/notifications` (full list page).

## Imports

- `@/src/components/ui/popover` — `Popover`, `PopoverButton`, `PopoverPanel`, `PopoverContent`
- `useNotificationsPopover` — data and handlers
- `NotificationPopoverItem` — row UI
- `notificationsIndicatorClass` — unread dot on trigger

## Exports

- `NotificationsPopover`

## State Management

- TanStack Query via `useGetNotifications` (enabled when `enabled` prop is true).
- `useMarkNotificationRead` on item click when unread.

## API Usage

- `GET /notifications` with popover pagination params (auth required).
- `POST /notifications/:id/read` when selecting an unread item.

## Navigation

- Item click: `router.push` to `actionUrl`, `data.metadata.redirect_path`, or `data.action_url` (locale-aware via `@/src/i18n/navigation`).
- Footer: `Link` to `/notifications`.

## Props / Parameters

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | — | Wrapper classes |
| `enabled` | `boolean` | `true` | When false, popover list fetch is disabled |
| `hasUnread` | `boolean` | `false` | From header unread-count API (red dot + mark-all state) |
| `overHero` | `boolean` | `false` | Landing hero header trigger styling |

## Actions / Inputs

- **Open popover** — refetches notification list.
- **Select notification** — marks read if needed, navigates to target URL.
- **See all** — navigates to notifications list route.

## UI Details

- Trigger: `rounded-full` circular bell (`rounded-lg` control family for icon buttons).
- Panel: `rounded-xl`, `border-secondary/15`, `bg-surface`, max width 380px.
- Header: flex row — title on the start (left in LTR), **Mark all as read** text button on the end when unread items exist; calls `PUT /notifications/read-all`.
- Items: `rounded-lg` interactive rows; unread rows use `bg-primary/5` and semibold title.
- Light/dark via semantic tokens; responsive width `min(380px, calc(100vw - 2rem))`.

## Flow Description

1. When user is logged in, notifications query runs for unread indicator.
2. User clicks bell → popover opens → `onOpen` refetches.
3. Loading shows skeleton rows; error/empty show localized messages.
4. User taps item → optional mark-read → navigate to `actionUrl` path.

## Dependencies

- `useNotificationsPopover.ts`
- `NotificationPopoverItem.tsx`
- `ProtectedHeader.tsx` (mobile + desktop instances)

## Notes

- Unread dot: `hasUnread` prop from header (`useHeaderNotificationUnreadCount` → `GET /notifications/unread-count` after user is loaded).
- List: lazy fetch on first popover open only (`GET /notifications?page=1&pageSize=5`).
- Full notifications screen is a placeholder at `/notifications` (`NotificationScreen`).
