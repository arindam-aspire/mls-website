# Agency settings page

**Source:** `app/[locale]/(main)/(profile)/agency-settings/page.tsx`

Admin/agency route for agency management settings.

## Navigation

- Locale-prefixed URL: `/en/agency-settings`
- Drawer account link: **Agency Settings** (`DRAWER_AGENCY_SETTINGS_PATH`)

## Auth

- `useAuthorize("AGENCY_SETTINGS")` — allowed role: `admin` (`UserRole.AGENCY`)
- Middleware: `/agency-settings` is in `PROTECTED_ROUTES`

## Screen

Renders [AgencySettingsScreen.md](../../../../src/features/profile/screens/AgencySettingsScreen.md).
