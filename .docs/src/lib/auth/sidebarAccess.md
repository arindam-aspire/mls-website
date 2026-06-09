# File Overview

Pure helper to decide whether the authenticated user should see the protected layout sidebar.

**Source:** `src/lib/auth/sidebarAccess.ts`

# Exports

- `hasProtectedSidebarAccess(user)`
- `hasProtectedSidebarAccessFromRoleName(roleName)`

# Logic

`hasProtectedSidebarAccessFromRoleName` returns `true` when `roleName` is one of the sidebar roles below (used with JWT-derived `loggedInUserRole` before `/auth/me`).

`hasProtectedSidebarAccess` returns `true` when any `user.roles[].name` is:

- `admin` (agency portal)
- `agent`
- `agency` (if API sends this alias)

Owner (`owner`) and user (`registered_user`) do **not** get the sidebar.

# Dependencies

- [roles.md](./roles.md)
- `LoggedInUser` from auth types

# Notes

- Used by `useProtectedSidebar` (full user **or** `loggedInUserRole` from JWT) and `ProtectedSidebar`.
