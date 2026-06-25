# Owners page

**Source:** `app/[locale]/(main)/owners/page.tsx`

Admin-only route for the Owners management screen.

## Navigation

- Locale-prefixed URL: `/en/owners`, `/ar/owners`, etc.
- Sidebar: **User Management → Owners** (`OWNERS` permission)
- Protected mobile drawer: **User Management → Owners** (admin only; not in profile popover or My Activity)

## Auth

- `useAuthorize("OWNERS")` — allowed role: `admin` (`UserRole.AGENCY`)
- Middleware: `/owners` is in `PROTECTED_ROUTES` (requires `access_token` cookie)

## Screen

Renders [OwnersScreen.md](../../../src/features/user/screens/OwnersScreen.md).
