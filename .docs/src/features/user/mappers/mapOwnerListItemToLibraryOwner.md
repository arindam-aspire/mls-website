# `mapOwnerListItemToLibraryOwner`

**Source:** `src/features/user/mappers/mapOwnerListItemToLibraryOwner.ts`

Maps MLS `OwnerListItem` API rows to `@abdoun/abdoun-library` `Owner` for `OwnerListView`.

## Exports

| Function | Description |
| --- | --- |
| `mapOwnerListItemToLibraryOwner` | Map one API row |
| `mapOwnerListItemsToLibraryOwners` | Map an array |

## Mapping

- `name` from `name` or `fullName`
- `propertyOwned` from `propertyOwned` or `property_owned`
- `joinedAt` from `joinedAt` or `joined_at`
- `status` via library `mapOwnerApiStatus`
- Empty `email` / `phone` become `undefined`

## Consumer

- `useOwnersScreen`
