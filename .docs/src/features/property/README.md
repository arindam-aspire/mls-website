# Property feature (`src/features/property/`)

User property areas: listings, favourites, saved searches, recently viewed, inquiries. List/detail screens are stubs or placeholders.

## Architecture

```
property/
  screens/     *Screen.tsx — wired from app/[locale]/(property)/*
  components/  (reserved)
  hooks/       (reserved)
  store/       (reserved)
  types/       (reserved)
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

`propertyEndpoints` is currently empty. Future services will use `apiClient` with `auth: true`.

## Subfolders

- [screens/README.md](./screens/README.md)

## Profile menu

Links defined in `ProfilePopover` → same paths as table above.
