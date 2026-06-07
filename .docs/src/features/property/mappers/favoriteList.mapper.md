# File Overview

Maps `GET /favorites` API items to `PropertyListing[]` for `@abdoun/abdoun-library` `PropertyCardList`.

**Source:** `src/features/property/mappers/favoriteList.mapper.ts`

# Exports

- `mapFavoriteListItem` — one favorite row → `PropertyListing` (`is_favourite: true`, `favourite_id`, etc.)
- `mapFavoriteListItems` — batch map
- `mapFavoriteListResponse` — full API response → `{ items, meta }`

# Notes

- Strips nested `agency` from the property payload (not used by list cards).
- `property_hash` is stringified for `PropertyListing` typing.
