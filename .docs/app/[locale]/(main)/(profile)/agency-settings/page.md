# Agency settings page

**Source:** `app/[locale]/(main)/(profile)/agency-settings/page.tsx`

Admin/agency route for agency management settings.

## Navigation

- Locale-prefixed URL: `/en/agency-settings`
- Not linked from the profile popover or mobile drawer account menus (agency admin sees **My Profile** and **My Saved Searches** only)

## Auth

- `useAuthorize("AGENCY_SETTINGS")` — allowed role: `admin` (`UserRole.AGENCY`)
- Middleware: `/agency-settings` is in `PROTECTED_ROUTES`

## Screen

Renders [AgencySettingsScreen.md](../../../../src/features/profile/screens/AgencySettingsScreen.md).
