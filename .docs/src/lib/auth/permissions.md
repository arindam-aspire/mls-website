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

## Notes

- Backend remains the final authority; this map is for client-side UX guards.
