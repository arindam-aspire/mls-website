# Property hooks (`src/features/property/hooks/`)

Custom hooks that own property feature logic: fetching, store sync, handlers, and derived list data.

## Files

| File | Purpose |
| --- | --- |
| [usePropertyList.md](./usePropertyList.md) | Property list screen logic (URL params, fetch, toolbar, pagination) |
| [useFavouritePropertyList.md](./useFavouritePropertyList.md) | Favourites screen logic (`GET /favorites`, pagination, `PropertyCardList`) |
| [useRecentlyViewedScreen.md](./useRecentlyViewedScreen.md) | Recently viewed labels + `GET /users/recent-views` prefetch |
| [useSavedSearchesScreen.md](./useSavedSearchesScreen.md) | Property saved-searches stub screen labels (`propertyList.savedSearches`) |
| [usePropertySearchFilters.md](./usePropertySearchFilters.md) | Reusable filter state/handlers for `PropertyListFilters` |
| [usePropertyDetails.md](./usePropertyDetails.md) | Property details screen logic (fetch by id, tabs, handlers) |
| [usePropertyFavouriteToggle.md](./usePropertyFavouriteToggle.md) | Shared favourite load/toggle logic (list + details) |

## Conventions

- Follow [components-hooks-architecture](../../../../.cursor/rules/components-hooks-architecture.mdc): hooks = logic, screens = UI.
- One hook per screen or cohesive flow (`use*.ts`, camelCase).
- Screens import hooks; hooks import services, store, and mutations — not presentational components.

## Related

- [../screens/PropertyListScreen.md](../screens/PropertyListScreen.md)
- [../screens/PropertyDetailsScreen.md](../screens/PropertyDetailsScreen.md)
- [../store/property.store.md](../store/property.store.md)
- [../mutations/property.mutation.md](../mutations/property.mutation.md)
