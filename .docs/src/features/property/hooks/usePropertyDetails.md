# File Overview

Custom hook for the property details flow. Fetches a single property by id, exposes `PropertyView` props, tab state, and upcoming-feature modal handlers.

**Source:** `src/features/property/hooks/usePropertyDetails.ts`

# Responsibilities

- Fetch `GET /properties/:id` when `propertyId` changes.
- Fetch `GET /properties/:id/similar` when `propertyId` changes (separate `isSimilarLoading`; does not block `PropertyView`).
- Map app locale (`es` → `esp`) for `@abdoun/abdoun-library` `PropertyView`.
- Manage detail tabs synced to URL `tab`. **Overview** and **Features** remain available to every viewer. Existing privileged roles retain **Location** and **Documents**; when API `show_location === true`, **Location** is additionally available to guests, owners, and registered users while **Documents** remains role-restricted.
- Expose favourite and contact handlers (favourite → add/remove APIs via `usePropertyFavouriteToggle`; agent/owner email, phone, WhatsApp → `propertyContactActions.utils` using API contact fields).
- After details load, signed-in **registered_user** / **owner** POST `addRecentView` once per `propertyId` (silent; no UI).

# Imports

- `useLocale` from `next-intl`
- `usePathname`, `useRouter` from `@/src/i18n/navigation`
- `useSearchParams` from `next/navigation`
- `useAddRecentView`, `useGetPropertyDetails`, `useGetPropertyFeatureCatalog`, `useGetSimilarProperties` from `../mutations/property.mutation`
- `canTrackRecentPropertyView` from `@/src/features/auth/utils/profileMenuRoleAccess`
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
- Valid values depend on the primary authenticated role from `user.roles[0]`, with `loggedInUserRole` as the pre-hydration fallback and API `show_location`: privileged roles retain all four tabs; guests, `registered_user`, and `owner` receive `overview` and `features`, plus `locations` only when `show_location === true`. A hidden tab supplied through `?tab=` resolves to `overview`, so its content cannot be opened through the details UI.

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
| `canViewRestrictedTabs` | Existing agency / agent / owner permission result used to gate the workflow panel; owner tab filtering is applied separately so workflow behavior is preserved |
| `showOwnerDetails` | `true` only for agent, agency/admin (including legacy `agency`), and super-admin roles; passed to `PropertyView.showOwner` |
| `propertyViewOwners` | Normalized owners for the details view (from API `owners[]` or library `owner`) |
| `propertyViewOwnerLabels` | Localized labels for `PropertyDetailsOwnersSection` |
| `toggleFavourite` | Guest → auth modal; signed-in → POST/DELETE favourite (`PropertyListing` or numeric id) |
| `openAgentEmail` | Opens `mailto:` for `propertyDetails.agent.email` when present; guests with `contact_actions.*.enabled === false` → auth modal |
| `openAgentPhone` | Opens `tel:` for `propertyDetails.agent.phone` when present; guests with disabled action → auth modal |
| `openAgentWhatsApp` | Opens WhatsApp for `agent.whatsapp` or `agent.phone` when present; guests with disabled action → auth modal |
| `openOwnerEmail` | Opens `mailto:` for resolved owner email (`ownerId` when multiple) |
| `openOwnerPhone` | Opens `tel:` for resolved owner phone |
| `openOwnerWhatsApp` | Opens WhatsApp for resolved owner phone |
| `similarListings` | Similar items with favourite flags for `SimilarProperties.data` |
| `isSimilarLoading` | Similar fetch pending |
| `upcomingFeatureModal` | `{ open, onClose }` for `UpcomingFeatureModal` |

# UI Details

_N/A — hook only._

# Flow Description

1. On mount, fetch active feature catalog (`GET /features?is_active=true`).
2. Role-filtered tab options are built; privileged roles keep Location and Documents. Other roles gain Location only when the loaded property explicitly sets `show_location: true`.
3. `activeTab` is read from `?tab=` and accepted only when present in those role-filtered options (otherwise defaults to `overview`).
4. On mount or `propertyId` change, fetch property details.
5. Similar listings and main details merge favourite state from `usePropertyFavouriteToggle`.
6. Tab change calls `router.replace` with updated `tab` param.
7. Screen passes values to `PropertyView` / `SimilarProperties`; contact actions use native `mailto:`, `tel:`, and WhatsApp links (no-op when contact field missing).

# Dependencies

- [../mutations/property.mutation.md](../mutations/property.mutation.md)
- [../services/property.service.md](../services/property.service.md)
- [../mappers/propertyFeatures.mapper.md](../mappers/propertyFeatures.mapper.md)
- [../utils/propertyContactActions.utils.md](../utils/propertyContactActions.utils.md)
- [usePropertyFavouriteToggle.md](./usePropertyFavouriteToggle.md)
- [../screens/PropertyDetailsScreen.md](../screens/PropertyDetailsScreen.md)

# Notes

- Feature catalog is fetched once per screen mount; API `AMENITY` maps to library `AMENITIES` for `PropertyView.features`.
