# `useOwnersScreen`

**Source:** `src/features/user/hooks/useOwnersScreen.ts`

Screen logic for the admin **Owners** page: labels, filter state, React Query list fetch, table columns, and workflow placeholders.

## Data fetching

- Reads `agencyId` from `useAuthStore` → `user.agency.agency_id`
- `useQuery` key: `["owners", "list", agencyId, listRequestParams]`
- `queryFn`: `getOwnerList(agencyId, listRequestParams)` — disabled when `agencyId` is empty
- Maps API rows via `mapOwnerListItemsToLibraryOwners`
- List fetch errors toast `user.owners.list.fetchErrorTitle`

## Return values

| Key | Description |
| --- | --- |
| `pageTitle` / `pageSubtitle` | Header copy from `user.owners` |
| `listFilters` | Props for `OwnerListFilters` |
| `ownerList` | Props for `OwnerList` (`OwnerListView` data, pagination, loading) |

## Workflow actions

`view`, `activate`, `suspend`, and `delete` show coming-soon toasts until API mutations are wired.

## Related

- [owner.service.md](../services/owner.service.md)
- [OwnersScreen.md](../screens/OwnersScreen.md)
