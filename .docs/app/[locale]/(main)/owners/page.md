# Owners page

**Source:** `app/[locale]/(main)/owners/page.tsx`

Locale-prefixed Owner Management route.

## Navigation

- Locale-prefixed URL: `/en/owners`, `/ar/owners`, etc.
- Sidebar: User Management → Owners (`OWNERS` permission)

## Guards

- Middleware: `/owners` in `PROTECTED_ROUTES` (requires `access_token` cookie)
- Client: `useAuthorize("OWNERS")` — Super Admin (`super_admin`) and Agency Admin (`admin`) only; others → `/unauthorized`

## Screen

Renders `OwnersScreen` after auth hydration.

## Related

- [OwnersScreen.md](../../../../src/features/user/screens/OwnersScreen.md)
- [useOwnersScreen.md](../../../../src/features/user/hooks/useOwnersScreen.md)
