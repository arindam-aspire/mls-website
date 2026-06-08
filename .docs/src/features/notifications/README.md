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
| `src/layouts/public-layout/PublicNotificationsButton.tsx` | Public header bell |
| `src/layouts/protected-layout/ProtectedNotificationsButton.tsx` | Protected header bell |
| `src/apis/endpoints/notificationEndpoints.ts` | Notification API paths |
| `src/messages/*/notifications.json` | Copy for list and popover |

## Conventions

- Popover UI lives under **`popovers/`** (same pattern as [saved-searches/popovers](../saved-searches/popovers/)).
- Hooks own fetch/mark-read logic; popover components are presentational + wire hooks.
- Use `rounded-xl` on popover panels; `rounded-lg` on controls (see project UI rules).

## Status

Scaffold in progress — `popovers/` folder added; components to be implemented.
