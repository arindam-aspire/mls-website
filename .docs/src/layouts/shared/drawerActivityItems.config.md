# File Overview

Shared **My Activity** drawer rows for public, landing, and protected mobile menus.

**Source:** `src/layouts/shared/drawerActivityItems.config.ts`

# Exports

- `DrawerActivityItemConfig`
- `DRAWER_ACTIVITY_ITEMS`

# Items

| `labelKey` | Path | Icon |
| --- | --- | --- |
| `myListings` | `/listing` | `List` |
| `manageListings` | `/manage-listings` | `List` |
| `myFavourites` | `/favourites` | `Heart` |
| `mySavedSearches` | `/saved-searches` | `Search` |
| `myRecentlyViewed` | `/recently-viewed` | `History` |

# Role filtering

Consumers pass `DRAWER_ACTIVITY_ITEMS` through `filterProfileMenuItemsWithRoleAccess(user)` so only allowed rows render:

- **My Listings** — `owner` (`MY_LISTINGS`)
- **Manage Listings** — `admin` / `agency` / `agent` (`MANAGE_LISTINGS`)
- **Recently Viewed** — `owner` / `registered_user`

# Dependencies

- `PublicMobileMenu`, `LandingMobileMenu`, `ProtectedMobileDrawer`
- `filterProfileMenuItemsWithRoleAccess` in `shouldShowRecentlyViewedMenu.ts`
