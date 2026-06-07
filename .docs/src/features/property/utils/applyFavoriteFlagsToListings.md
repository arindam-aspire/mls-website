# File Overview

Utility helpers that merge authenticated favourite records onto property list items for `PropertyCardList` heart state.

**Source:** `src/features/property/utils/applyFavoriteFlagsToListings.ts`

# Responsibilities

- Build a lookup map from `GET /favorites` items keyed by `property_hash`, nested `property.id`, and `property.property_id`.
- Apply `is_favourite: true` (plus `favourite_id`, `property_hash`, `user_id`) to matching listings from `GET /properties`.

# Imports

- `FavoriteListItem`, `PropertyListing` from `../types/property.types`

# Exports

- `buildFavoriteLookup(items)` → `Map<string, FavoriteLookupEntry>`
- `applyFavoriteFlagsToListings(listings, lookup)` → `PropertyListing[]`

# State Management

_N/A — pure functions._

# API Usage

_N/A — consumes already-fetched favourite list items._

# Navigation

_N/A._

# Props / Parameters

| Function | Args | Returns |
| --- | --- | --- |
| `buildFavoriteLookup` | `FavoriteListItem[] \| undefined` | Map for O(1) match by property identifiers |
| `applyFavoriteFlagsToListings` | `PropertyListing[]`, lookup map | Listings with favourite flags set |

# Actions / Inputs

_N/A._

# UI Details

_N/A._

# Flow Description

1. `usePropertyList` calls `useGetAllFavorites` when `user` is set.
2. `buildFavoriteLookup(allFavoritesResponse?.data?.items)` runs in a memo.
3. After property list fetch, `applyFavoriteFlagsToListings` merges flags before passing `listings` to the screen.

# Dependencies

- [usePropertyList.md](../hooks/usePropertyList.md)
- [property.types.md](../types/property.types.md)

# Notes

- Non-matching listings are returned unchanged (no forced `is_favourite: false`).
- Used on the public property list only for display; favourite add/remove on the list still uses the upcoming-feature modal.
