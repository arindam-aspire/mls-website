# File Overview

Shared **My Activity** drawer rows for public, landing, and protected mobile menus.

**Source:** `src/layouts/shared/drawerActivityItems.config.ts`

# Exports

- `DrawerActivityItemConfig`
- `DRAWER_ACTIVITY_ITEMS`

# Items

| `labelKey` | Path | Icon |
| --- | --- | --- |
| `myListings` | `/my-listings` | `List` |
| `manageListings` | `/manage-listings` | `List` |
| `draftListings` | `/draft-listings` | `FilePenLine` |
| `myFavourites` | `/favourites` | `Heart` |
| `mySavedSearches` | `/saved-searches` | `Search` |
| `myRecentlyViewed` | `/recently-viewed` | `History` |

# Role filtering

Consumers pass `DRAWER_ACTIVITY_ITEMS` through `filterProfileMenuItemsWithRoleAccess(user, context)` so only allowed rows render:

- **My Listings** — `owner` (`MY_LISTINGS`)
- **Manage Listings** — `admin` / `agency` / `agent` (`MANAGE_LISTINGS`)
- **Draft Listings** — `owner` + `agent` (`protectedDrawer` / `publicMenu`); protected popover uses separate menu config
- **Recently Viewed** — `owner` / `registered_user`

# Dependencies

- `PublicMobileMenu`, `LandingMobileMenu`, `ProtectedMobileDrawer`
- `filterProfileMenuItemsWithRoleAccess` in `profileMenuRoleAccess.ts`
