# mapOwnerListItemToLibraryOwner

**Source:** `src/features/user/mappers/mapOwnerListItemToLibraryOwner.ts`

Maps API `OwnerListItem` → library `Owner` plus app field `leadsLinked`.

## `OwnerListRow`

`Owner & { leadsLinked: number }`

| API | Library / row |
| --- | --- |
| `owner_id` | `id` |
| `full_name` | `name` |
| `email` / `phone` | optional |
| `property_owned` | `propertyOwned` (default `0`) |
| `leads_count` or `linked_leads` | `leadsLinked` (default `0`) |
| `status` | `mapOwnerApiStatus` (default `ACTIVE`) |
| `created_at` | `joinedAt` |

## Related

- [buildOwnerListTableColumns.md](../utils/buildOwnerListTableColumns.md)
