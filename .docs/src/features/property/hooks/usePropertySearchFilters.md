# File Overview

Reusable hook that owns property search **filter** UI state and handlers. Returns props for `PropertyListFilters` (`PropertyListFiltersProps`). Used by `usePropertyList`; can be reused anywhere filters need the same behavior without list fetch or URL parsing.

**Source:** `src/features/property/hooks/usePropertySearchFilters.ts`

# Responsibilities

- Draft state for location, budget, area, plot area, and governorate fields (synced from `filterParams` when URL/source changes).
- Load property and location taxonomy via landing mutations when missing from `usePropertyStore`.
- Build category/type/location options from taxonomy.
- All filter change handlers that call `updateFilterParams` (including `page: 1` resets).
- Compose and return a `PropertyListFiltersProps` object (status, advanced filters, reset/save callbacks).

# Imports

- `useGetPropertyTaxonomy`, `useGetLocationTaxonomy` from landing mutations
- Location taxonomy utils from `@/src/features/landing/utils/locationTaxonomy.utils`
- `usePropertyStore` from `../store/property.store`
- `PropertyListFiltersProps` from `../components/PropertyListFilters`
- Advanced filter helpers from `../components/propertyListAdvancedFilters.constants`
- `PROPERTY_SEARCH_STATUS_OPTIONS` from `./propertySearchFilter.constants`
- Types: `PropertyListParams`, `SaveSearchSubmitPayload`

# Exports

- `UsePropertySearchFiltersOptions` (type)
- `usePropertySearchFilters`

# State Management

- **Zustand (read):** `propertyTaxonomy`, `locationTaxonomy`
- **Local:** draft strings for location, budget, areas, governorate block; `selectedLocationValue` for autocomplete

Draft fields resync from `filterParams` during render when param-derived keys change (replacing prior `useEffect` sync).

# API Usage

| Call | When |
| --- | --- |
| `getPropertyTaxonomy()` | On mount if `propertyTaxonomy` is null in store |
| `getLocationTaxonomy()` | On mount if `locationTaxonomy` is null in store |

Does **not** call `GET /properties`.

# Navigation

None — URL updates are delegated to the caller via `updateFilterParams`.

# Props / Parameters

| Option | Type | Purpose |
| --- | --- | --- |
| `filterParams` | `PropertyListParams` | Current filter/search param snapshot |
| `updateFilterParams` | `(partial) => void` | Apply partial param updates (caller syncs URL or other source) |
| `onResetSearch` | `() => void` | Reset filters (passed through to UI) |
| `onSaveSearch` | optional callback | Save-search flow; omitted hides Save button in UI |
| `savedSearchId` | optional string | Update vs create save-search label |
| `disabled` | optional boolean | Override; default `isLoadingTaxonomy && propertyTaxonomy == null` |

# Actions / Inputs

All handlers returned on the `PropertyListFiltersProps` object: status/category/type/location/budget/advanced field changes, amenity toggles, commit handlers for text/numeric fields, `onResetSearch`, optional `onSaveSearch`.

# UI Details

Return value is spread into `PropertyListFilters`. Uses `PROPERTY_SEARCH_STATUS_OPTIONS` for buy/rent toggle items.

# Flow Description

1. Initialize draft state from `filterParams` (+ location taxonomy when available).
2. On param changes, resync drafts via render-phase keys.
3. Fetch taxonomies if store cache empty.
4. Derive category/type/location options and active dropdown values.
5. Handlers call `updateFilterParams` with merged partial updates.
6. Return memoized `PropertyListFiltersProps`.

# Dependencies

- [usePropertyList.md](./usePropertyList.md) — primary consumer
- [../components/PropertyListFilters.md](../components/PropertyListFilters.md)
- [propertySearchFilter.constants.ts](./propertySearchFilter.constants.ts) (source: `propertySearchFilter.constants.ts`)

# Notes

- Does not own pagination, toolbar, property list fetch, save-search modal state, or router URL logic.
- `onSaveSearch` is optional; when undefined, `PropertyListFilters` hides the Save Search button.
