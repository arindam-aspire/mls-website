# `mapOwnerListItemToLibraryOwner`

**Source:** `src/features/user/mappers/mapOwnerListItemToLibraryOwner.ts`

Maps MLS `OwnerListItem` API rows to `@abdoun/abdoun-library` `Owner` for `OwnerListView`.

## Exports

| Function | Description |
| --- | --- |
| `mapOwnerListItemToLibraryOwner` | Map one API row |
| `mapOwnerListItemsToLibraryOwners` | Map an array |

## Mapping

| API field | Library `Owner` field |
| --- | --- |
| `owner_id` | `id` |
| `full_name` | `name` |
| `email` / `phone` | `email` / `phone` (empty → `undefined`) |
| `property_owned` | `propertyOwned` (defaults to `0`) |
| `created_at` | `joinedAt` |
| `status` | `status` via `mapOwnerApiStatus` (defaults to `ACTIVE` when absent) |

## Consumer

- `useOwnersScreen`
