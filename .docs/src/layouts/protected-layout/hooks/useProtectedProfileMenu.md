# File Overview

Client hook for `ProtectedProfileMenu`: role label resolution, menu labels, logout flow.

**Source:** `src/layouts/protected-layout/hooks/useProtectedProfileMenu.ts`

# Exports

- `useProtectedProfileMenu`
- `useProtectedProfileMenuItem`

# Return value (`useProtectedProfileMenu`)

| Key | Description |
| --- | --- |
| `t` | `common` translations |
| `user` | Passed-in `LoggedInUser` |
| `roleLabel` | Primary role line for header/panel |
| `menuItems` | Localized menu entries (role-filtered for popover) |
| `showLogoutConfirm` | Confirm modal open state |
| `isLoggingOut` | Logout mutation pending |
| `openLogoutConfirm` / `closeLogoutConfirm` / `confirmLogout` | Modal handlers |
| `router` | Locale-aware router |

# Role label resolution

Maps `user.roles[0].name` to `auth.accountType*` titles only:

| API role name | Label |
| --- | --- |
| `admin`, `agency` | Agency |
| `agent` | Agent |
| `owner` | Owner |
| `registered_user` | User |

Unknown roles return an empty subtitle.

# Profile popover menu items (role-specific)

| Roles | Menu links in popover |
| --- | --- |
| `owner`, `registered_user` | Profile, My Listings, Favourites, Saved Searches, Recently Viewed, Inquiries |
| `admin`, `agency`, `agent` | Profile only (+ Sign out button) |

Mobile drawer menu is unchanged (`ProtectedMobileDrawer`).

# Dependencies

- `useLogout`, `useRouter`, `next-intl`
