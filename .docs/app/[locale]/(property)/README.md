# Route group `(property)` — `app/[locale]/(property)/`

Authenticated user property management routes. Uses same `PublicLayout` as `(main)`.

## Layout

[layout.md](./layout.md) → `PublicLayout`.

## Pages

| File | URL | Screen |
| --- | --- | --- |
| [listing/page.md](./listing/page.md) | `/en/listing` | `ListingPropertyScreen` |
| [property-list/page.md](./property-list/page.md) | `/en/property-list` | `PropertyListScreen` |
| [favourites/page.md](./favourites/page.md) | `/en/favourites` | `FavouritePropertyScreen` |
| [saved-searches/page.md](./saved-searches/page.md) | `/en/saved-searches` | `SavedSearchesScreen` |
| [recently-viewed/page.md](./recently-viewed/page.md) | `/en/recently-viewed` | `RecentlyViewedScreen` |
| [inquiries/page.md](./inquiries/page.md) | `/en/inquiries` | `InquiriesScreen` |

## Profile menu

All paths linked from `ProfilePopover` (`common` i18n keys).

## Reserved folders (no page yet)

`propert-details/` — future property detail route.
