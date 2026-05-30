# File Overview

Custom hook for the property details flow. Fetches a single property by id, exposes `PropertyView` props, tab state, and upcoming-feature modal handlers.

**Source:** `src/features/property/hooks/usePropertyDetails.ts`

# Responsibilities

- Fetch `GET /properties/:id` when `propertyId` changes.
- Map app locale (`es` → `esp`) for `@abdoun/abdoun-library` `PropertyView`.
- Manage detail tabs synced to URL search param `tab` (overview, features, locations, documents).
- Expose favourite and agent email handlers (placeholder → upcoming modal).

# Imports

- `useLocale` from `next-intl`
- `usePathname`, `useRouter` from `@/src/i18n/navigation`
- `useSearchParams` from `next/navigation`
- `useGetPropertyDetails`, `useGetPropertyFeatureCatalog` from `../mutations/property.mutation`
- `mapFeatureCatalogItems` from `../mappers/propertyFeatures.mapper`
- Types from `../types/property.types`
- `PropertyView` (type-only via `ComponentProps`)

# Exports

- `usePropertyDetails(propertyId: string)`

# State Management

- **Local:** `propertyDetails`, `featureCatalog`, upcoming modal open flag
- **URL:** `tab` search param (default `overview`; omitted from URL when overview)
- **React Query:** details + feature catalog mutations; `isLoading` stays true until each request settles (avoids empty flash on refresh)

# API Usage

| Call | Method | Path |
| --- | --- | --- |
| `getPropertyDetails(id)` | GET | `/properties/:id` |
| `getPropertyFeatureCatalog()` | GET | `/features?is_active=true` |

On property success: `response.data` → `propertyDetails`.

On features success: `response.data.items` → mapped via `mapFeatureCatalogItems` → `featureCatalog` for `PropertyView.features`.

# Navigation

- Tab changes update `?tab=` via `router.replace` (locale-prefixed pathname).
- Valid values: `overview`, `features`, `locations`, `documents`.
- Default tab `overview` removes `tab` from the query string.

# Props / Parameters

| Parameter | Type | Purpose |
| --- | --- | --- |
| `propertyId` | `string` | URL `[id]` segment passed from page |

# Actions / Inputs

| Return key | Purpose |
| --- | --- |
| `isLoading` | Fetch pending (property details or feature catalog) |
| `isError` | Mutation failed |
| `propertyDetails` | Data for `PropertyView` |
| `locale` | Mapped app locale for library |
| `applicationKey` | `"abdoun_web"` |
| `featureCatalog` | Feature/amenity definitions for features tab |
| `tabs` | `{ tabOptions, activeTab, onTabChange }` |
| `toggleFavourite` | Opens upcoming modal (receives property numeric id) |
| `openAgentEmail` | Opens upcoming modal (receives property numeric id) |
| `upcomingFeatureModal` | `{ open, onClose }` for `UpcomingFeatureModal` |

# UI Details

_N/A — hook only._

# Flow Description

1. On mount, fetch active feature catalog (`GET /features?is_active=true`).
2. `activeTab` is read from `?tab=` (defaults to `overview`).
3. On mount or `propertyId` change, fetch property details.
4. Tab change calls `router.replace` with updated `tab` param.
5. Screen passes values to `PropertyView` and wires modal for unreleased actions.

# Dependencies

- [../mutations/property.mutation.md](../mutations/property.mutation.md)
- [../services/property.service.md](../services/property.service.md)
- [../mappers/propertyFeatures.mapper.md](../mappers/propertyFeatures.mapper.md)
- [../screens/PropertyDetailsScreen.md](../screens/PropertyDetailsScreen.md)

# Notes

- Feature catalog is fetched once per screen mount; API `AMENITY` maps to library `AMENITIES` for `PropertyView.features`.
