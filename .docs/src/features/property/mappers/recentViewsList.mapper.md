# File Overview

Maps `GET /users/recent-views` API items to `PropertyListing[]` for `@abdoun/abdoun-library` `PropertyCardList`.

**Source:** `src/features/property/mappers/recentViewsList.mapper.ts`

# Exports

- `mapRecentViewsListItem` — one recent-view row → `PropertyListing` (`property_hash_id`, `user_id`, `is_favourite: false`)
- `mapRecentViewsListItems` — batch map
- `mapRecentViewsListResponse` — full API response → `{ items, meta }`

# Notes

- Strips nested `agency` from the property payload (not used by list cards).
- `property_hash_id` from the API is normalized via `resolveRecentViewHashIdFromApiItem` (falls back to legacy `property_hash` when the new key is absent).
- Invalid/missing hash values are omitted instead of stringifying to `"undefined"`.
- Favourites still use `property_hash`; recent-view rows do not set `property_hash` on the listing.
