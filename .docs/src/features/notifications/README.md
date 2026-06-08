# Notifications feature (`src/features/notifications/`)

Feature-first module for in-app notifications: list screen, header popover, API integration, and unread state.

## Architecture

```text
notifications/
  components/  Shared notification UI blocks (list items, badges)
  constants/   Query keys, popover sizing, pagination defaults
  hooks/       Popover and screen logic
  mutations/   React Query hooks (list, mark read)
  popovers/    Header notification popover(s)
  screens/     Full notifications page
  services/    GET /notifications, mark-read endpoints
  store/       Optional client state (unread count cache)
  types/       Notification API types
  utils/       Mappers and formatters
```

## Related app code (outside this folder)

| Path | Role |
| --- | --- |
| `src/layouts/shared/notificationsButtonStyles.ts` | Bell indicator styles |
| `src/features/notifications/popovers/NotificationsPopover.tsx` | Shared header popover (public, landing, protected) |
| `src/layouts/public-layout/PublicHeader.tsx` | Mobile popover (public) |
| `src/layouts/public-layout/ProfilePopover.tsx` | Desktop popover (public + landing) |
| `src/layouts/landing-layout/LandingHeader.tsx` | Mobile popover with `overHero` |
| `src/layouts/protected-layout/ProtectedHeader.tsx` | Mobile + desktop popover (protected) |
| `src/apis/endpoints/notificationEndpoints.ts` | Notification API paths |
| `src/messages/*/notifications.json` | Copy for list and popover |

## Conventions

- Popover UI lives under **`popovers/`** (same pattern as [saved-searches/popovers](../saved-searches/popovers/)).
- Hooks own fetch/mark-read logic; popover components are presentational + wire hooks.
- Use `rounded-xl` on popover panels; `rounded-lg` on controls (see project UI rules).

## Status

Header popover and full list screen at `/notifications` with grouped list, archive/delete, archived drawer/sheet panel with unarchive, and pagination.

| File | Role |
| --- | --- |
| `popovers/NotificationsPopover.tsx` | Header bell + popover panel |
| `screens/NotificationScreen.tsx` | Full notifications page (toolbar + grouped list) |
| `components/NotificationListItem.tsx` | Main list row with archive/delete |
| `components/ArchivedNotificationsPanel.tsx` | Archived drawer (`min-w-md max-w-md`, md+) / bottom sheet (sm); flat archived list |
| `components/ArchivedNotificationsPanelSkeleton.tsx` | Flat list loading skeleton for archived panel |
| `components/ArchivedNotificationListItem.tsx` | Archived row with unarchive |
| `hooks/useNotificationArchivedPanel.ts` | Archived fetch, filter by `archivedAt`, unarchive |
| `components/NotificationListGroup.tsx` | Group heading + items |
| `components/NotificationScreenSkeleton.tsx` | Loading skeleton |
| `utils/groupNotificationsByTime.ts` | Time bucket grouping |
| `hooks/useNotificationScreen.ts` | Screen copy, mark all read, archived toggle |
| `hooks/useNotificationsPopover.ts` | Popover fetch, mark read, navigation |
| `components/NotificationPopoverItem.tsx` | Single notification row |
| `services/notification.service.ts` | API client wrappers |
| `mutations/notification.mutation.ts` | React Query hooks |
| `types/notification.types.ts` | API types |
| `constants/notification.constants.ts` | Popover page size, query key |
| `constants/notification-icons.ts` | Semantic notification type → Lucide icon map (`notificationIcons`) |
| `utils/resolveNotificationHref.ts` | `actionUrl` / metadata path resolution |
| `utils/formatNotificationRelativeTime.ts` | Locale-relative timestamps |
