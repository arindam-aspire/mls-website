# File Overview

Role gates for profile / mobile activity menu items in public and landing layouts.

**Source:** `src/features/auth/utils/shouldShowRecentlyViewedMenu.ts`

# Exports

- `shouldShowRecentlyViewedMenuItem(user)` — `true` for `registered_user`, `owner`
- `shouldShowMyListingsMenuItem(user)` — `true` for `owner` only → `/listing`
- `shouldShowManageListingsMenuItem(user)` — `true` for `admin`, `agency`, `agent` → `/manage-listings`
- `canTrackRecentPropertyView(user, loggedInUserRole)` — same roles as recently viewed; used on property details to POST recent view
- `resolveListingsMenuPath(user)` — `/manage-listings` for agency/agent, `/listing` for owner, else `null`
- `filterProfileMenuItemsWithRoleAccess(items, user)` — filters `myRecentlyViewed`, `myListings`, and `manageListings` by role

# Allowed roles

| Menu item | API roles |
| --- | --- |
| My Recently Viewed | `registered_user`, `owner` |
| My Listings | `owner` |
| Manage Listings | `admin`, `agency`, `agent` |

# Dependencies

- `UserRole` from `@/src/lib/auth/roles`
- `LoggedInUser` from auth types

# Usage

- `ProfilePopover` (public + landing via `LandingProfilePopover`)
- `PublicMobileMenu` / `LandingMobileMenu` — My Activity section
