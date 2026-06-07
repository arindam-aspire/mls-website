# File Overview

Custom hook for the property list flow. Owns URL param sync, fetch mutation, toolbar/pagination config, navigation, save-search modal wiring, and upcoming-feature modal triggers. Filter UI logic is delegated to `usePropertySearchFilters`.

**Source:** `src/features/property/hooks/usePropertyList.ts`

# Responsibilities

- Parse **all** list params from URL search params (single source of truth).
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
- `getInitialBudgetMin` / `getInitialBudgetMax` from `@/src/components/search` (legacy `minPrice` / `maxPrice`)
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
| `getPropertyList(params)` | GET | `/properties?...` |
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
| `isLoading` | Fetch pending or list not yet loaded (`propertyListings === null`) |
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
2. `usePropertySearchFilters({ filterParams: listParams, updateFilterParams: updateSearchParams, onResetSearch, onSaveSearch, savedSearchId })` → `filters`.
3. `useEffect` reads URL → `fetchProperties`.
4. When `user` is set, `useGetAllFavorites` loads the full favourites list.
5. Mutation success writes items + pagination meta to store.
6. `listings` memo applies favourite flags from the lookup before render.
7. Screen spreads `filters` into `PropertyListFilters`.

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
