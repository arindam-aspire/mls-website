# Property hooks (`src/features/property/hooks/`)

Custom hooks that own property feature logic: fetching, store sync, handlers, and derived list data.

## Files

| File | Purpose |
| --- | --- |
| [useListingPropertyScreen.md](./useListingPropertyScreen.md) | My Listings screen (`useAgentListingsTable` + `myListings` namespace) |
| [useManageListingsScreen.md](./useManageListingsScreen.md) | Manage Listings — agent: `useAgentListingsTable`; admin: `useAdminPropertySubmissionsTable` |
| [useAdminPropertySubmissionsTable.md](./useAdminPropertySubmissionsTable.md) | Admin submissions table (`GET /admin/property-submissions`) |
| [useAgentListingsTable.md](./useAgentListingsTable.md) | Shared agent listings table logic (internal; used by the two screen hooks above) |
| [useAddPropertyEntry.md](./useAddPropertyEntry.md) | My Listings / Draft Listings Add Property → `/property-create` |
| [useFavouritePropertyList.md](./useFavouritePropertyList.md) | Favourites screen logic (`GET /favorites`, pagination, `PropertyCardList`) |
| [useRecentlyViewedScreen.md](./useRecentlyViewedScreen.md) | Recently viewed list, pagination, favourites, clear-all |
| [useSavedSearchesScreen.md](./useSavedSearchesScreen.md) | Property saved-searches stub screen labels (`propertyList.savedSearches`) |
| [usePropertyCreateScreen.md](./usePropertyCreateScreen.md) | Add Property 8-step host hook (`PropertyForm` 0.1.91) |
| [usePropertyLocationDls.md](./usePropertyLocationDls.md) | Location-step DLS cascading selects (`GET /dls-locations`) |
| [usePropertyLocationMap.md](./usePropertyLocationMap.md) | Google Map slot: pin coordinates, zoom, Map/Satellite, script load |
| [usePropertyOwnerSearch.md](./usePropertyOwnerSearch.md) | Step 4 owner search (`onSearchOwners`) |
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
