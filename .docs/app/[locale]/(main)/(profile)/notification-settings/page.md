# Notification settings page

**Source:** `app/[locale]/(main)/(profile)/notification-settings/page.tsx`

Owner and registered-user route for notification preferences.

## Navigation

- Locale-prefixed URL: `/en/notification-settings`
- Drawer account link: **Notification Settings** (`DRAWER_NOTIFICATION_SETTINGS_PATH`)

## Auth

- `useAuthorize("NOTIFICATION_SETTINGS")` — allowed roles: `owner`, `registered_user`
- Middleware: `/notification-settings` is in `PROTECTED_ROUTES`

## Screen

Renders [NotificationSettingsScreen.md](../../../../src/features/profile/screens/NotificationSettingsScreen.md).
