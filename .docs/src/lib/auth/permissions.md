# File Overview

`src/lib/auth/permissions.ts` maps each permission to the roles allowed to use it.

## Responsibilities

- Centralize permission keys via `PERMISSIONS`.
- Each key lists `UserRole[]` members that grant the permission.
- Export `PermissionKey` for type-safe checks in `authorize.ts`.

## Exports

- `PERMISSIONS`
- `PermissionKey`

## Permission keys (current)

| Key | Roles |
| --- | --- |
| `PROFILE` | agency, agent, owner, user |
| `DASHBOARD` | agency, agent, owner |
| `MY_LISTINGS` | owner |
| `MANAGE_LISTINGS` | agency, agent |
| `DRAFT_LISTINGS` | owner, agent |
| `DRAFT_LISTINGS_SIDEBAR` | agent (sidebar nav only) |
| `PROPERTY_CREATE` | owner, agent |
| `SAVED_SEARCHES` | agency, agent, owner, user |
| `FAVOURITES` | agency, agent, owner, user |
| `NOTIFICATIONS` | agency, agent, owner, user |
| `RECENTLY_VIEWED` | owner, user (`registered_user`) |
| `OWNERS` | admin (`UserRole.AGENCY`) |
| `AGENTS` | admin (`UserRole.AGENCY`) |
| `AGENCY_SETTINGS` | admin (`UserRole.AGENCY`) |
| `NOTIFICATION_SETTINGS` | owner, user (`registered_user`) |

## Notes

- Backend remains the final authority; this map is for client-side UX guards.
