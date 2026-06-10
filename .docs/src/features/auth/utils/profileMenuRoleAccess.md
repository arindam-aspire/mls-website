# File Overview

Role-based access helpers for profile menus, mobile activity drawers, listings tab routing, and recent-view tracking.

**Source:** `src/features/auth/utils/profileMenuRoleAccess.ts`

# Exports

- `isAgentUser(user)` — `true` when any role name is `agent` (e.g. Add Property on manage listings)
- `shouldShowRecentlyViewedMenuItem(user)` — `true` for `registered_user`, `owner`
- `shouldShowMyListingsMenuItem(user)` — `true` for `owner` only → `/my-listings`
- `shouldShowManageListingsMenuItem(user)` — `true` for `admin`, `agency`, `agent` → `/manage-listings`
- `canTrackRecentPropertyView(user, loggedInUserRole)` — same roles as recently viewed; used on property details to POST recent view
- `resolveListingsMenuPath(user)` — `/manage-listings` for agency/agent, `/my-listings` for owner, else `null`
- `filterProfileMenuItemsWithRoleAccess(items, user)` — filters `myRecentlyViewed`, `myListings`, and `manageListings` by role

# Allowed roles

| Menu item | API roles |
| --- | --- |
| My Recently Viewed | `registered_user`, `owner` |
| My Listings | `owner` |
| Manage Listings | `admin`, `agency`, `agent` |

# Dependencies

- `UserRole` from `@/src/lib/auth/roles`
- `hasPermission` from `@/src/lib/auth/hasPermission`
- `LoggedInUser` from auth types

# Usage

- `ProfilePopover` (public + landing via `LandingProfilePopover`)
- `PublicMobileMenu` / `LandingMobileMenu` / `ProtectedMobileDrawer` — activity section
- `useProtectedBottomTabBar` — listings tab path and label
- `usePropertyDetails` / `useFavouritePropertyList` — recent view tracking and card sizing
