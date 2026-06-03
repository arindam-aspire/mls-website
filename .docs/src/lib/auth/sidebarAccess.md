# File Overview

Pure helper to decide whether the authenticated user should see the protected layout sidebar.

**Source:** `src/lib/auth/sidebarAccess.ts`

# Exports

- `hasProtectedSidebarAccess(user)`

# Logic

Returns `true` when any `user.roles[].name` is:

- `admin` (agency portal)
- `agent`
- `agency` (if API sends this alias)

Owner (`owner`) and user (`registered_user`) do **not** get the sidebar.

# Dependencies

- [roles.md](./roles.md)
- `LoggedInUser` from auth types

# Notes

- Used by `useProtectedSidebar` and `ProtectedSidebar`.
