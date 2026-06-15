# Property components (`src/features/property/components/`)

UI building blocks for property feature screens.

## Files

| File | Role |
| --- | --- |
| [PropertyListFilters.md](./PropertyListFilters.md) | Buy/Rent, category, type filter bar |
| [PropertyDraftList.md](./PropertyDraftList.md) | Draft list with per-row Resume/Delete from API flags |
| [MyListingFilters.md](./MyListingFilters.md) | My Listings screen filter placeholder |

## Notes

- Components in this folder should stay presentational and emit changes via callbacks.
- Keep filter/query state ownership in route-level screens or stores.
