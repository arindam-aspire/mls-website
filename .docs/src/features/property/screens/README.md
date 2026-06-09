# Property screens (`src/features/property/screens/`)

Screens mounted by App Router pages under `(property)` or `(main)` as noted per screen.

| Screen | Route | Status |
| --- | --- | --- |
| [ListingPropertyScreen.md](./ListingPropertyScreen.md) | `/en/listing` | Coming Soon |
| [FavouritePropertyScreen.md](./FavouritePropertyScreen.md) | `/en/favourites` | Favourites list (`PropertyCardList`) |
| [RecentlyViewedScreen.md](./RecentlyViewedScreen.md) | `/en/recently-viewed` | Coming Soon |
| [InquiriesScreen.md](./InquiriesScreen.md) | `/en/inquiries` | Coming Soon |
| [PropertyListScreen.md](./PropertyListScreen.md) | `/en/property-list` | `PropertyCardList` |
| [PropertyDetailsScreen.md](./PropertyDetailsScreen.md) | `/en/propert-details/:id` | `PropertyView` |

## Conventions

- Default export or named export consumed by thin `page.tsx` files.
- Use `ComingSoonCard` with custom title/description until APIs exist.
