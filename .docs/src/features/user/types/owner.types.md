# Owner types

**Source:** `src/features/user/types/owner.types.ts`

TypeScript shapes for the agency owners list API.

## `OwnerListItem`

Single row from `GET /agency/{agencyId}/owners`:

| Field | Type | Notes |
| --- | --- | --- |
| `id` | `string` | Owner id |
| `name` | `string` | Display name |
| `email` | `string` | Contact email |
| `phone` | `string` | Contact phone |
| `propertyOwned` | `number` | Count of owned properties |
| `joinedAt` | `string` | ISO or formatted join date |
| `status` | `string` | API status enum string |

## `OwnerListResponse`

Standard API envelope: `{ success, message, data: { owners, pagination }, error, meta? }`.

## `NormalizedOwnerListResponse`

Service return type: `{ owners: OwnerListItem[], pagination: OwnerListPagination }`.

## Related

- [owner.service.md](../services/owner.service.md)
- [mapOwnerListItemToLibraryOwner.md](../mappers/mapOwnerListItemToLibraryOwner.md)
