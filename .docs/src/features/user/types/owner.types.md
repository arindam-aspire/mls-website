# Owner types

**Source:** `src/features/user/types/owner.types.ts`

TypeScript shapes for the agency owners list API.

## `OwnerListItem`

Single row from `GET /agency/{agencyId}/owners` (`data.items[]`):

| Field | Type | Notes |
| --- | --- | --- |
| `owner_id` | `string` | Owner id |
| `full_name` | `string` | Display name |
| `email` | `string` | Contact email |
| `phone` | `string` | Contact phone |
| `nationality` | `string \| null` | Nationality |
| `ssi` | `string \| null` | SSI |
| `address` | `string \| null` | Address |
| `documents` | `unknown[]` | Document payloads |
| `created_at` | `string` | ISO join/created timestamp |
| `updated_at` | `string` | ISO updated timestamp |
| `status` | `string` | Optional API status enum |
| `property_owned` | `number` | Optional property count |

## `OwnerListResponse`

API envelope:

```json
{
  "data": {
    "items": [],
    "total": 0,
    "page": 1,
    "pageSize": 10,
    "totalPages": 0,
    "hasNext": false,
    "hasPrevious": false
  },
  "meta": { "pagination": { ... } }
}
```

Pagination is read from `meta.pagination` first, then flat fields on `data`.

## `NormalizedOwnerListResponse`

Service return type: `{ owners: OwnerListItem[], pagination: OwnerListPagination }` (`owners` mirrors `data.items`).

## Related

- [owner.service.md](../services/owner.service.md)
- [mapOwnerListItemToLibraryOwner.md](../mappers/mapOwnerListItemToLibraryOwner.md)
