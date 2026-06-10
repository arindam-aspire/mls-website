# File Overview

Screen hook for `PropertyCreateScreen`: page copy, breadcrumb, and create-form catalog data (taxonomies + features).

**Source:** `src/features/property/hooks/usePropertyCreateScreen.ts`

# Responsibilities

- Resolve `propertyList.propertyCreate` strings (title, subtitle, coming soon).
- Build breadcrumb trail: Home → My Listings / Manage Listings (via `resolveListingsMenuPath`) → Create.
- On mount, fetch in parallel:
  - `GET /property-taxonomy`
  - `GET /location-taxonomy`
  - `GET /features?is_active=true`
- Map feature catalog via `mapFeatureCatalogItems`.
- Expose derived `propertyCategories` and `locationCities` helpers.

# API Usage

| Method | Endpoint | Service / mutation |
| --- | --- | --- |
| GET | `/property-taxonomy` | `getPropertyTaxonomy` / `useGetPropertyTaxonomy` |
| GET | `/location-taxonomy` | `getLocationTaxonomy` / `useGetLocationTaxonomy` |
| GET | `/features?is_active=true` | `getPropertyFeatureCatalog` / `useGetPropertyFeatureCatalog` |

# State Management

- Reads `user` from `useAuthStore` for breadcrumb path.
- Local state: `propertyTaxonomy`, `locationTaxonomy`, `featureCatalog`, `isCatalogLoading`.
- `useGetPropertyTaxonomy` / `useGetLocationTaxonomy` also update `property.store` on success.

# Exports

- `usePropertyCreateScreen()` — page copy, breadcrumb, catalog data, `isCatalogLoading`, `reloadCreateCatalog`

# Dependencies

- `resolveListingsMenuPath` from `profileMenuRoleAccess.ts`
- [locationTaxonomy.types.md](../../landing/types/locationTaxonomy.types.md)
- [propertyTaxonomy.types.md](../../landing/types/propertyTaxonomy.types.md)
- [propertyFeatures.mapper.md](../mappers/propertyFeatures.mapper.md)
