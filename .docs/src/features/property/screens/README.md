# Property screens (`src/features/property/screens/`)

Screens mounted by `app/[locale]/(main)/*/page.tsx` or `app/[locale]/(property)/*/page.tsx`.

| Screen | Route | Route group | Status |
| --- | --- | --- | --- |
| [ManageListingsScreen.md](./ManageListingsScreen.md) | `/en/manage-listings` | `(main)` | Coming Soon |
| [ListingPropertyScreen.md](./ListingPropertyScreen.md) | `/en/listing` | `(main)` | Coming Soon |
| [FavouritePropertyScreen.md](./FavouritePropertyScreen.md) | `/en/favourites` | `(main)` | Favourites list (`PropertyCardList`) |
| [RecentlyViewedScreen.md](./RecentlyViewedScreen.md) | `/en/recently-viewed` | `(main)` | Recent views `PropertyCardList` |
| [InquiriesScreen.md](./InquiriesScreen.md) | `/en/inquiries` | `(property)` | Coming Soon |
| [PropertyListScreen.md](./PropertyListScreen.md) | `/en/property-list` | `(property)` | `PropertyCardList` |
| [PropertyDetailsScreen.md](./PropertyDetailsScreen.md) | `/en/propert-details/:id` | `(property)` | `PropertyView` |

## Conventions

- Default export or named export consumed by thin `page.tsx` files.
- Use `ComingSoonCard` with custom title/description until APIs exist.
