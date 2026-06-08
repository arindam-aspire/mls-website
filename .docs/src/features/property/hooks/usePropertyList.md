# File Overview

Custom hook for the property list flow. Owns URL param sync, fetch mutation, toolbar/pagination config, navigation, save-search modal wiring, and upcoming-feature modal triggers. Filter UI logic is delegated to `usePropertySearchFilters`.

**Source:** `src/features/property/hooks/usePropertyList.ts`

# Responsibilities

- Parse **all** list params from URL via `parsePropertyListUrlParams`.
- When URL has only `savedSearchId`, fetch saved search detail and hydrate full filter query string into the URL (`record.query_string` + `savedSearchId`).
- Keep `savedSearchId` in the URL when filters change; omit it from `GET /properties` only when active filters no longer match the saved search record.
- Fetch `GET /properties` and store results in Zustand.
- When the user is authenticated, fetch `GET /favorites` (no query params) and mark matching list items as favourites.
- Expose `PropertyCardList` props: listings, toolbar, pagination, empty state, handlers.
- Wire `usePropertySearchFilters` with `updateSearchParams`, `onResetSearch`, and `onSaveSearch`.
- Navigate to property details on card click.

# Imports

- `useSearchParams` from `next/navigation`
- `usePathname`, `useRouter` from `@/src/i18n/navigation`
- `useGetPropertyList`, `usePropertyFavouriteToggle` from `./usePropertyFavouriteToggle` / `../mutations/property.mutation`
- `usePropertySearchFilters` from `./usePropertySearchFilters`
- `usePropertyStore` from `../store/property.store`
- `parsePropertyListUrlParams` from `../utils/parsePropertyListUrlParams`
- `savedSearchPropertyListParams` helpers from `@/src/features/saved-searches/utils/savedSearchPropertyListParams`
- Types from `../types/property.types`

# Exports

- `usePropertyList`

# State Management

- **Zustand:** `propertyListParams`, `propertyListings`; `user` from auth store
- **Local:** `layoutVariant`, save-search modal state, upcoming-feature modal
- **React Query:** list mutation; favourites via `usePropertyFavouriteToggle`; saved search detail for modal initial name
- **Filters:** `usePropertySearchFilters` (drafts, taxonomy, handlers)

# API Usage

| Call | Method | Path |
| --- | --- | --- |
| `getPropertyList(params)` | GET | `/properties?...` (includes `savedSearchId` only while filters match saved search) |
| `getSavedSearchById(id)` | GET | saved search detail (hydrate URL from `query_string`) |
| `getAllFavorites()` | GET | `/favorites` (auth; only when `user` is set) |

Filter taxonomy loads are handled inside `usePropertySearchFilters`.

On success, maps `response.data.items` and `response.meta.pagination` into the store. `listings` returned to the screen merges favourite flags via `buildFavoriteLookup` + `applyFavoriteFlagsToListings` (match on `id`, `property_hash`, `property_id`).

# Navigation

- Updates **all** `PropertyListParams` fields in the URL via `router.replace` (`updateSearchParams`).
- Card click: opens `/propert-details/${id}` in a new tab (locale-aware via `getPathname({ locale, href })`).

# Props / Parameters

_No hook arguments._

# Actions / Inputs

| Return key | Purpose |
| --- | --- |
| `listings` | Card list data array (favourite flags applied when signed in) |
| `layoutVariant` | `"grid"` \| `"list"` |
| `listTitle` | Heading (sale/rent from `status` param) |
| `isLoading` | Saved-search hydration, fetch pending, or list not yet loaded |
| `filters` | Full `PropertyListFiltersProps` from `usePropertySearchFilters` |
| `toolbar` | Sort options, layout toggle |
| `pagination` | Total, page, pageSize, handlers |
| `noDataFound` | Empty state copy |
| `onClickProperty` | Open property details in new tab |
| `onClickEmail` / `onClickCall` / `onClickWhatsApp` | Open upcoming modal |
| `toggleFavourite` | Guest → auth modal; signed-in → `POST /favorites` or `DELETE /favorites/:propertyHash` |
| `upcomingFeatureModal` | `{ open, onClose }` for `UpcomingFeatureModal` |
| `saveSearchModal` | Save search form modal state |
| `filters.onSaveSearch` | Guest → `openAuth`; signed-in → opens `saveSearchModal` |

# UI Details

_N/A — hook only._

# Flow Description

1. Parse URL → `listParams`.
2. If `savedSearchId` only (no `category`/`status`), fetch saved search and `router.replace` with `query_string` + `savedSearchId`; skip property fetch until hydrated.
3. `usePropertySearchFilters({ filterParams: listParams, updateFilterParams: updateSearchParams, onResetSearch, onSaveSearch, savedSearchId })` → `filters`.
4. `resolvePropertyListRequestParams`: if filters ≠ saved search record, omit `savedSearchId` from the property list API call only (URL unchanged).
5. `useEffect` → `fetchProperties` when not hydrating.
6. When `user` is set, `useGetAllFavorites` loads the full favourites list.
7. Mutation success writes items + pagination meta to store.
8. `listings` memo applies favourite flags from the lookup before render.
9. Screen spreads `filters` into `PropertyListFilters`.

# Dependencies

- [usePropertySearchFilters.md](./usePropertySearchFilters.md)
- [../store/property.store.md](../store/property.store.md)
- [../mutations/property.mutation.md](../mutations/property.mutation.md)
- [usePropertyFavouriteToggle.md](./usePropertyFavouriteToggle.md)
- [../screens/PropertyListScreen.md](../screens/PropertyListScreen.md)

# Notes

- Favourite hearts reflect saved favourites when signed in; heart toggle calls add/remove favourite APIs (guests see auth modal).
- Sort is synced via URL `sort` query param and sent to the API; changing sort resets `page` to `1`.
- **`onResetSearch`** restores default list params but keeps URL **`similar_to`** when set.
