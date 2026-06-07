# File Overview

Shared favourite toggle logic for property list and property details flows. Loads the authenticated user's full favourites list, merges heart state onto listings/details, and handles add/remove API calls.

**Source:** `src/features/property/hooks/usePropertyFavouriteToggle.ts`

# Responsibilities

- Fetch `GET /favorites` (no params) when `user` is set.
- Expose helpers to apply favourite flags and loading state to listing arrays.
- Expose `applyDetailsFavouriteState` for the main `PropertyView` record.
- `toggleFavourite(item)` — POST or DELETE favourite; guest → auth modal.
- `toggleFavouriteById(id, context)` — resolve listing from similar list or lookup, then toggle.

# Imports

- Auth: `useAuthStore`, `tokenStore`, `AUTH_VIEW`
- React Query: `useQueryClient`, `FAVORITES_ALL_QUERY_KEY`, `useGetAllFavorites`, `useAddFavorite`, `useRemoveFavorite`
- Utils: `applyFavoriteFlagsToListings`, `buildFavoriteLookup`, `resolveFavoriteResourceId`, `resolveFavoritePropertyHash`
- i18n: `propertyList.favourites` toast keys

# Exports

- `usePropertyFavouriteToggle`

# State Management

- **Local:** `togglingFavoriteId` for per-card loading
- **React Query:** `useGetAllFavorites`; invalidates `FAVORITES_ALL_QUERY_KEY` after add/remove

# API Usage

| Action | Method | Path |
| --- | --- | --- |
| Load favourites | GET | `/favorites` |
| Add | POST | `/favorites` `{ property_hash }` |
| Remove | DELETE | `/favorites/:propertyHash` |

# Navigation

- Guests: `openAuth(AUTH_VIEW.chooseAccount)` on toggle.

# Props / Parameters

_No hook arguments._

# Actions / Inputs

| Return key | Purpose |
| --- | --- |
| `withFavouriteFlags` | Merge lookup onto `PropertyListing[]` |
| `withFavouriteLoading` | Set `is_favourite_loading` on item being toggled |
| `toggleFavourite` | Toggle from full `PropertyListing` |
| `toggleFavouriteById` | Toggle from numeric id (PropertyView / similar cards) |
| `applyDetailsFavouriteState` | Merge favourite + loading onto detail record |

# UI Details

_N/A — hook only._

# Flow Description

1. When signed in, load all favourites once (shared query key with list screen).
2. Callers merge flags onto listings or details before render.
3. Heart click → auth check → POST or DELETE → toast → invalidate favourites query.

# Dependencies

- [usePropertyList.md](./usePropertyList.md)
- [usePropertyDetails.md](./usePropertyDetails.md)
- [../mutations/property.mutation.md](../mutations/property.mutation.md)
- [../utils/applyFavoriteFlagsToListings.md](../utils/applyFavoriteFlagsToListings.md)

# Notes

- Used by `usePropertyList` and `usePropertyDetails` to avoid duplicated toggle logic.
