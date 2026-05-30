# File Overview

Custom hook for the property list flow. Owns URL param sync, fetch mutation, toolbar/pagination config, navigation, and upcoming-feature modal triggers.

**Source:** `src/features/property/hooks/usePropertyList.ts`

# Responsibilities

- Parse **all** list params from URL search params (single source of truth).
- Fetch `GET /properties` and store results in Zustand.
- Expose `PropertyCardList` props: listings, toolbar, pagination, empty state, handlers.
- Navigate to property details on card click.

# Imports

- `useSearchParams` from `next/navigation`
- `usePathname`, `useRouter` from `@/src/i18n/navigation`
- `useGetPropertyList` from `../mutations/property.mutation`
- `useGetPropertyTaxonomy` from `@/src/features/landing/mutations/landing.mutation`
- `usePropertyStore` from `../store/property.store`
- Types from `../types/property.types`

# Exports

- `usePropertyList`

# State Management

- **Zustand:** `propertyListParams`, `propertyListings`
- **Local:** `layoutVariant`
- **React Query:** list mutation + `isPending` as `isLoading`

# API Usage

| Call | Method | Path |
| --- | --- | --- |
| `getPropertyList(params)` | GET | `/properties?...` |
| `getPropertyTaxonomy()` | GET | property taxonomy (via landing service) |

Taxonomy is fetched once on mount when not already in `usePropertyStore` (e.g. cached from landing).

On success, maps `response.data.items` and `response.meta.pagination` into the store.

# Navigation

- Updates **all** `PropertyListParams` fields in the URL via `router.replace`.
- Card click: opens `/propert-details/${id}` in a new tab (locale-aware via `getPathname({ locale, href })`).

# Props / Parameters

_No hook arguments._

# Actions / Inputs

| Return key | Purpose |
| --- | --- |
| `listings` | Card list data array |
| `layoutVariant` | `"grid"` \| `"list"` |
| `listTitle` | Heading (sale/rent from `status` param) |
| `isLoading` | Fetch pending |
| `toolbar` | Sort options, layout toggle |
| `pagination` | Total, page, pageSize, handlers |
| `noDataFound` | Empty state copy |
| `onClickProperty` | Open property details in new tab |
| `onClickEmail` | Open upcoming modal |
| `onClickCall` | Open upcoming modal |
| `onClickWhatsApp` | Open upcoming modal |
| `toggleFavourite` | Open upcoming modal |
| `upcomingFeatureModal` | `{ open, onClose }` for `UpcomingFeatureModal` |

# UI Details

_N/A — hook only._

# Flow Description

1. If `propertyTaxonomy` is missing in store, call `getPropertyTaxonomy()`.
2. Build `filters` from URL + taxonomy; filter changes update URL and reset page to `1`.
3. `useEffect` reads URL + advanced filters → `fetchProperties`.
4. Mutation success writes items + pagination meta to store.
5. Screen spreads `filters` into `PropertyListFilters` and passes list props to `PropertyCardList`.

# Dependencies

- [../store/property.store.md](../store/property.store.md)
- [../mutations/property.mutation.md](../mutations/property.mutation.md)
- [../services/property.service.md](../services/property.service.md)
- [../screens/PropertyListScreen.md](../screens/PropertyListScreen.md)

# Notes

- Favourite, contact, and filter actions open `UpcomingFeatureModal` until those flows ship.
- Sort is synced via URL `sort` query param and sent to the API; changing sort resets `page` to `1`.
