# OwnerList

**Source:** `src/features/user/components/OwnerList.tsx`

Thin wrapper: `OwnerListFilters` + library `OwnerListView`.

## Responsibilities

- Render filters toolbar (search, status, column picker)
- Pass paginated `OwnerListRow` data and custom columns into `OwnerListView`
- Loading uses `isLoading || isFetching` so pagination refreshes show the table skeleton

## Columns (built upstream)

Owner name, phone, email, linked properties, linked leads, status, actions.

## Related

- [OwnerListFilters.md](./OwnerListFilters.md)
- [useOwnersScreen.md](../hooks/useOwnersScreen.md)
- [buildOwnerListTableColumns.md](../utils/buildOwnerListTableColumns.md)
