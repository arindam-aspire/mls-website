# File Overview

Screen hook for **`ManageListingsScreen`** (`/manage-listings`). Routes data fetching by role:

- **Agent** → `useAgentListingsTable` with `manageListings` namespace (`GET /agent-properties`)
- **Admin / agency** → `useAdminPropertySubmissionsTable` (`GET /admin/property-submissions`)

**Source:** `src/features/property/hooks/useManageListingsScreen.ts`

# Responsibilities

- Read `user` from `useAuthStore` and branch with `isAgentUser(user)`.
- Call both underlying hooks with `enabled` flags so React hook rules stay valid; wait until `user` is hydrated (`!isLoadingUser`) before fetching.

# Imports

- `useAuthStore` from `@/src/features/auth/store/auth.store`
- `isAgentUser` from `@/src/features/auth/utils/profileMenuRoleAccess`
- `useAgentListingsTable`, `useAdminPropertySubmissionsTable`

# Exports

- `useManageListingsScreen()`

# API Usage

| Role | Hook | Endpoint |
| --- | --- | --- |
| Agent | `useAgentListingsTable` | `GET /agent-properties?page=&pageSize=&search=&status=` |
| Admin | `useAdminPropertySubmissionsTable` | `GET /admin/property-submissions?status=&page=&pageSize=` |

# Navigation

- Used by `ManageListingsScreen` at `/en/manage-listings` (`MANAGE_LISTINGS` permission).

# Dependencies

- [useAgentListingsTable.md](./useAgentListingsTable.md)
- [useAdminPropertySubmissionsTable.md](./useAdminPropertySubmissionsTable.md)
- [ManageListingsScreen.md](../screens/ManageListingsScreen.md)
