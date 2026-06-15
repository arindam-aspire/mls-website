# Property screens (`src/features/property/screens/`)

Screens mounted by `app/[locale]/(main)/*/page.tsx` or `app/[locale]/(property)/*/page.tsx`.

| Screen | Route | Route group | Status |
| --- | --- | --- | --- |
| [ManageListingsScreen.md](./ManageListingsScreen.md) | `/en/manage-listings` | `(main)` | Manage Listings table (`ListTableView`) |
| [ListingPropertyScreen.md](./ListingPropertyScreen.md) | `/en/my-listings` | `(main)/(listings)` | My Listings |
| [PropertyCreateScreen.md](./PropertyCreateScreen.md) | `/en/property-create` | `(main)/(listings)` | Coming Soon |
| [PropertyUpdateScreen.md](./PropertyUpdateScreen.md) | `/en/property-update` | `(main)/(listings)` | Coming Soon |
| [FavouritePropertyScreen.md](./FavouritePropertyScreen.md) | `/en/favourites` | `(main)` | Favourites list (`PropertyCardList`) |
| [RecentlyViewedScreen.md](./RecentlyViewedScreen.md) | `/en/recently-viewed` | `(main)` | Recent views `PropertyCardList` |
| [InquiriesScreen.md](./InquiriesScreen.md) | `/en/inquiries` | `(property)` | Coming Soon |
| [PropertyListScreen.md](./PropertyListScreen.md) | `/en/property-list` | `(property)` | `PropertyCardList` |
| [PropertyDetailsScreen.md](./PropertyDetailsScreen.md) | `/en/propert-details/:id` | `(property)` | `PropertyView` |

## Conventions

- Default export or named export consumed by thin `page.tsx` files.
- Use `ComingSoonCard` with custom title/description until APIs exist.
