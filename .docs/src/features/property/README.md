# Property feature (`src/features/property/`)

User property areas: listings, favourites, saved searches, recently viewed, inquiries. List/detail screens are stubs or placeholders.

## Architecture

```
property/
  screens/     *Screen.tsx — wired from app/[locale]/(property)/*
  hooks/       usePropertyList.ts, usePropertyDetails.ts — list/detail logic
  mutations/   property.mutation.ts — React Query mutation hooks
  services/    property.service.ts — GET /properties, GET /properties/:id, GET /properties/:id/similar
  store/       property.store.ts — list params/response state
  mappers/     propertyList.mapper.ts, propertyFeatures.mapper.ts — API → view models
  components/  PropertyListFilters.tsx — list filter bar (status, category, type)
  types/       property.types.ts — list API shapes
```

## Routes (locale-prefixed)

| URL | Screen |
| --- | --- |
| `/en/listing` | `ListingPropertyScreen` |
| `/en/favourites` | `FavouritePropertyScreen` — route under `(main)` |
| `/en/recently-viewed` | `RecentlyViewedScreen` — route under `(main)` |
| `/en/inquiries` | `InquiriesScreen` |

Dynamic detail route: `/en/propert-details/:id` → `PropertyDetailsScreen`.

## Status

Most routed screens use [ComingSoonCard](../../components/common/ComingSoonCard.md). `PropertyListScreen` and `PropertyDetailsScreen` use `@abdoun/abdoun-library` list/detail components.

## API

| Constant | Path |
| --- | --- |
| `PROPERTY_LIST` | `/properties` |
| `PROPERTY_DETAILS` | `/properties/:id` |
| `PROPERTY_SIMILAR` | `/properties/:id/similar` |
| `FEATURE_CATALOG` | `/features?is_active=true` |

Types: [types/README.md](./types/README.md). Service: [services/README.md](./services/README.md) (`getPropertyList` via `apiClient`).

## Subfolders

- [screens/README.md](./screens/README.md)
- [components/README.md](./components/README.md)
- [hooks/README.md](./hooks/README.md)
- [mutations/README.md](./mutations/README.md)
- [mappers/README.md](./mappers/README.md)
- [services/README.md](./services/README.md)
- [store/README.md](./store/README.md)
- [types/README.md](./types/README.md)

## Profile menu

Links defined in `ProfilePopover` → same paths as table above.
