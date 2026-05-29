# Property feature (`src/features/property/`)

User property areas: listings, favourites, saved searches, recently viewed, inquiries. List/detail screens are stubs or placeholders.

## Architecture

```
property/
  screens/     *Screen.tsx — wired from app/[locale]/(property)/*
  mutations/   property.mutation.ts — React Query mutation hook
  services/    property.service.ts — GET /properties
  store/       property.store.ts — list params/response state
  components/  PropertyListFilters.tsx — property list filters UI
  hooks/       (reserved)
  types/       property.types.ts — list API shapes
```

## Routes (locale-prefixed)

| URL | Screen |
| --- | --- |
| `/en/listing` | `ListingPropertyScreen` |
| `/en/favourites` | `FavouritePropertyScreen` |
| `/en/saved-searches` | `SavedSearchesScreen` |
| `/en/recently-viewed` | `RecentlyViewedScreen` |
| `/en/inquiries` | `InquiriesScreen` |

Planned (folders exist, no `page.tsx` yet): property list, property details.

## Status

Most routed screens use [ComingSoonCard](../../components/common/ComingSoonCard.md). `PropertyListScreen` and `PropertyDetailsScreen` are stubs for future search/detail flows.

## API

| Constant | Path |
| --- | --- |
| `PROPERTY_LIST` | `/properties` |

Types: [types/README.md](./types/README.md). Service: [services/README.md](./services/README.md) (`getPropertyList` via `apiClient`).

## Subfolders

- [screens/README.md](./screens/README.md)
- [components/README.md](./components/README.md)
- [mutations/README.md](./mutations/README.md)
- [services/README.md](./services/README.md)
- [store/README.md](./store/README.md)
- [types/README.md](./types/README.md)

## Profile menu

Links defined in `ProfilePopover` → same paths as table above.
