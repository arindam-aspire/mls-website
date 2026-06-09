# File Overview

Role gate for **My Recently Viewed** in public/landing profile popover and mobile activity menus.

**Source:** `src/features/auth/utils/shouldShowRecentlyViewedMenu.ts`

# Exports

- `shouldShowRecentlyViewedMenuItem(user)` — `true` for `registered_user`, `admin`, `agency`
- `filterProfileMenuItemsWithRoleAccess(items, user)` — drops `myRecentlyViewed` when role is not allowed

# Allowed roles

| API role | Shown |
| --- | --- |
| `registered_user` | Yes |
| `admin`, `agency` | Yes |
| `owner`, `agent` | No |

# Dependencies

- `UserRole` from `@/src/lib/auth/roles`
- `LoggedInUser` from auth types

# Usage

- `ProfilePopover` (public + landing via `LandingProfilePopover`)
- `PublicMobileMenu` / `LandingMobileMenu` — My Activity section
