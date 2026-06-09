# File Overview

Custom hook for the property details flow. Fetches a single property by id, exposes `PropertyView` props, tab state, and upcoming-feature modal handlers.

**Source:** `src/features/property/hooks/usePropertyDetails.ts`

# Responsibilities

- Fetch `GET /properties/:id` when `propertyId` changes.
- Fetch `GET /properties/:id/similar` when `propertyId` changes (separate `isSimilarLoading`; does not block `PropertyView`).
- Map app locale (`es` → `esp`) for `@abdoun/abdoun-library` `PropertyView`.
- Manage detail tabs synced to URL `tab`. **Overview** and **Features** are public; **Location** and **Documents** only for signed-in **admin** (agency), **agent**, and **owner**.
- Expose favourite and agent email handlers (favourite → add/remove APIs via `usePropertyFavouriteToggle`; agent email → upcoming modal).
- After details load, signed-in **registered_user** / **owner** POST `addRecentView` once per `propertyId` (silent; no UI).

# Imports

- `useLocale` from `next-intl`
- `usePathname`, `useRouter` from `@/src/i18n/navigation`
- `useSearchParams` from `next/navigation`
- `useAddRecentView`, `useGetPropertyDetails`, `useGetPropertyFeatureCatalog`, `useGetSimilarProperties` from `../mutations/property.mutation`
- `canTrackRecentPropertyView` from `@/src/features/auth/utils/shouldShowRecentlyViewedMenu`
- `mapFeatureCatalogItems` from `../mappers/propertyFeatures.mapper`
- `useAuthStore` from `@/src/features/auth/store/auth.store`
- `hasPropertyDetailsRestrictedTabsAccess` from `@/src/lib/auth/propertyDetailsTabAccess`
- Tab constants from `../constants/propertyDetailsTabs.constants`
- `useTranslations("propertyList.details")` for tab labels
- `PropertyView` (type-only via `ComponentProps`)

# Exports

- `usePropertyDetails(propertyId: string)`

# State Management

- **Local:** `propertyDetails`, `featureCatalog`, upcoming modal open flag
- **Zustand:** `user`, `loggedInUserRole` from auth store (tab visibility; recent-view role gate)
- **URL:** `tab` search param (default `overview`; omitted when overview)
- **React Query:** details + feature catalog mutations; `isLoading` stays true until each request settles (avoids empty flash on refresh)

# API Usage

| Call | Method | Path |
| --- | --- | --- |
| `getPropertyDetails(id)` | GET | `/properties/:id` |
| `getPropertyFeatureCatalog()` | GET | `/features?is_active=true` |

| `getSimilarProperties(id)` | GET | `/properties/:id/similar` |
| `getAllFavorites()` | GET | `/favorites` (when signed in) |
| `addFavorite` / `removeFavorite` | POST / DELETE | `/favorites` (heart toggle) |
| `addRecentView` | POST | `/users/recent-views` body `{ property_hash_id }` (user/owner only) |

On property success: `response.data` → favourite flags applied → `propertyDetails` for `PropertyView`. When role allows, one `addRecentView` per visit.

On features success: `response.data.items` → mapped via `mapFeatureCatalogItems` → `featureCatalog` for `PropertyView.features`.

On similar success: `response.data.items` → favourite flags applied → `similarListings` for `SimilarProperties`.

# Navigation

- Tab changes update `?tab=` via `router.replace` (locale-prefixed pathname).
- Valid values depend on role: guests and `registered_user` → `overview`, `features`; `admin`, `agent`, `owner` → all four. Disallowed `?tab=` values are stripped from the URL.

# Props / Parameters

| Parameter | Type | Purpose |
| --- | --- | --- |
| `propertyId` | `string` | URL `[id]` segment passed from page |

# Actions / Inputs

| Return key | Purpose |
| --- | --- |
| `isLoading` | Fetch pending (property details or feature catalog) |
| `isError` | Mutation failed |
| `propertyDetails` | Data for `PropertyView` (`is_favourite` set from favourites lookup when signed in) |
| `isFavouriteLoading` | Passed to `PropertyView.isFavouriteLoading` while toggle is in flight |
| `locale` | Mapped app locale for library |
| `applicationKey` | `"abdoun_web"` |
| `featureCatalog` | Feature/amenity definitions for features tab |
| `tabs` | `{ tabOptions, activeTab, onTabChange }` |
| `toggleFavourite` | Guest → auth modal; signed-in → POST/DELETE favourite (`PropertyListing` or numeric id) |
| `openAgentEmail` | Opens upcoming modal (receives property numeric id) |
| `similarListings` | Similar items with favourite flags for `SimilarProperties.data` |
| `isSimilarLoading` | Similar fetch pending |
| `upcomingFeatureModal` | `{ open, onClose }` for `UpcomingFeatureModal` |

# UI Details

_N/A — hook only._

# Flow Description

1. On mount, fetch active feature catalog (`GET /features?is_active=true`).
2. `activeTab` is read from `?tab=` (defaults to `overview`).
3. On mount or `propertyId` change, fetch property details.
4. Similar listings and main details merge favourite state from `usePropertyFavouriteToggle`.
5. Tab change calls `router.replace` with updated `tab` param.
6. Screen passes values to `PropertyView` / `SimilarProperties`; upcoming modal only for agent email.

# Dependencies

- [../mutations/property.mutation.md](../mutations/property.mutation.md)
- [../services/property.service.md](../services/property.service.md)
- [../mappers/propertyFeatures.mapper.md](../mappers/propertyFeatures.mapper.md)
- [usePropertyFavouriteToggle.md](./usePropertyFavouriteToggle.md)
- [../screens/PropertyDetailsScreen.md](../screens/PropertyDetailsScreen.md)

# Notes

- Feature catalog is fetched once per screen mount; API `AMENITY` maps to library `AMENITIES` for `PropertyView.features`.
