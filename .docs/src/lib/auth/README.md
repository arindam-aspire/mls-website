# Auth utilities (`src/lib/auth/`)

Shared client-side authorization helpers: role constants, permission map, and the `useAuthorize` hook.

## Files

| File | Purpose |
| --- | --- |
| [roles.md](./roles.md) | `UserRole` enum (API role names) |
| [permissions.md](./permissions.md) | Permission keys → allowed roles |
| [authorize.md](./authorize.md) | Client hook `useAuthorize` (auth store + i18n router) |
| [sidebarAccess.md](./sidebarAccess.md) | `hasProtectedSidebarAccess` (agency/agent sidebar) |
| [hasPermission.md](./hasPermission.md) | `hasPermission` for nav item visibility |

## Usage

Protected App Router pages under `(main)` call `useAuthorize(<permission>)` before rendering screens. Server edge guard: `proxy.ts` redirects unauthenticated requests (no `access_token` cookie) away from `/dashboard`, `/manage-listings`, `/my-profile`, `/my-listings`, `/saved-searches`, `/favourites`, and `/recently-viewed`.

## Notes

- Backend remains the source of truth; this map is for client UX guards only.
- Keep permission keys stable when adding routes or menu items.
