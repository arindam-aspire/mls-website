# Owner service

**Source:** `src/features/user/services/owner.service.ts`

Authenticated API helper for the agency-scoped owners list.

## `getOwnerList`

`GET /agency/{agencyId}/owners` with auth. Returns `{ owners, pagination }`.

Default query: `page=1`, `pageSize=10`.

Optional query params when provided on `OwnerListParams`:

| Param | Description |
| --- | --- |
| `search` | Name/email search string |
| `status` | Uppercase owner status (`ACTIVE`, `SUSPENDED`) |

Pagination is read from `response.data.pagination` with fallback to `response.meta.pagination`.

## Consumers

- `useOwnersScreen` — paginated owners table for the admin Owners page

## Related

- Endpoint: `src/apis/endpoints/ownerEndpoints.ts` (`LIST`)
- Constants: `src/features/user/constants/ownerList.constants.ts`
- Types: `src/features/user/types/owner.types.ts`
- Mapper: `src/features/user/mappers/mapOwnerListItemToLibraryOwner.ts`
