# File Overview

Client hook for `ProtectedProfileMenu`: role label resolution, menu labels, logout flow.

**Source:** `src/layouts/protected-layout/hooks/useProtectedProfileMenu.ts`

# Exports

- `useProtectedProfileMenu`
- `useProtectedProfileMenuItem`
- `ProtectedProfileMenuEntry`, `ProtectedProfileMenuAccountGroup`, `ProtectedProfileMenuLinkItem`

# Return value (`useProtectedProfileMenu`)

| Key | Description |
| --- | --- |
| `t` | `common` translations |
| `user` | Passed-in `LoggedInUser` |
| `roleLabel` | Primary role line for header/panel |
| `menuEntries` | Localized menu entries (links or agency account group) |
| `menuAriaLabel` | `myAccount` for agency; `profile` for other roles |
| `showLogoutConfirm` | Confirm modal open state |
| `isLoggingOut` | Logout mutation pending |
| `openLogoutConfirm` / `closeLogoutConfirm` / `confirmLogout` | Modal handlers |
| `router` | Locale-aware router |

# Profile popover menu items (role-specific)

| Roles | Menu links in popover |
| --- | --- |
| `owner` | Profile, My Listings, Favourites, Saved Searches, Recently Viewed, Inquiries |
| `registered_user` | Profile, Favourites, Saved Searches, Recently Viewed, Inquiries |
| `agent` | My Profile only (+ Sign out) |
| `admin`, `agency` | **My Account** row with chevron; hover/focus opens flyout: Profile (`/my-profile`), Agency Settings (`/agency-settings`) |

Agency detection uses `isAgencyUser` from `profileMenuRoleAccess`. Other roles pass through `filterProfileMenuItemsWithRoleAccess` with context `protectedPopover`.

# Dependencies

- `useLogout`, `useRouter`, `next-intl`
- `isAgencyUser`, `filterProfileMenuItemsWithRoleAccess`
- `DRAWER_AGENCY_SETTINGS_PATH` from `resolveDrawerAccountLabel`
