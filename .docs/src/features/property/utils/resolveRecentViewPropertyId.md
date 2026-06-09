# File Overview

Resolves the path segment for `DELETE /users/recent-views/{propertyHashId}` from a `PropertyListing` on the recently viewed screen.

**Source:** `src/features/property/utils/resolveRecentViewPropertyId.ts`

# Exports

- `normalizeRecentViewHashId(value)` — trims and rejects empty/`"undefined"`/`"null"` strings
- `resolveRecentViewHashIdFromApiItem(item)` — reads `property_hash_id`, then legacy `property_hash`
- `resolveRecentViewPropertyId(item)` — listing hash id for `DELETE`, else `String(item.id)`

# Notes

- Recent-view list items carry `property_hash_id` from `mapRecentViewsListItem`; favourites use `property_hash` via `resolveFavoriteResourceId` instead.
- Prevents `DELETE /users/recent-views/undefined` when the API still returns only `property_hash`.
