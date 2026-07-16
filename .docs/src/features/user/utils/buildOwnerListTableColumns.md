# buildOwnerListTableColumns

**Source:** `src/features/user/utils/buildOwnerListTableColumns.tsx`

Builds localized `TableColumn<OwnerListRow>[]` for the owners list (app-owned columns; not the library default set).

## Columns

| Id | Content |
| --- | --- |
| `name` | Owner name (click → view) |
| `phone` | Phone |
| `email` | Email |
| `propertyOwned` | Linked properties count (click → modal when &gt; 0) |
| `leadsLinked` | Linked leads count (click → modal when &gt; 0) |
| `status` | `OwnerStatusBadge` |
| `actions` | `AgentRowActions`: View, Edit, Activate/Deactivate by status |

## Helpers

- `buildOwnerListGridHiddenColumnIds`
- `resolveOwnerListPinnedColumns`

## Related

- [ownerListTableColumns.constants.md](../constants/ownerListTableColumns.constants.md)
- [mapOwnerListItemToLibraryOwner.md](../mappers/mapOwnerListItemToLibraryOwner.md)
