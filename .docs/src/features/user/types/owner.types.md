# Owner types

**Source:** `src/features/user/types/owner.types.ts`

TypeScript shapes for owner management APIs.

## `OwnerListItem`

Single row from `GET /agency/{agencyId}/owners` or platform list (`data.items[]`):

| Field | Type | Notes |
| --- | --- | --- |
| `owner_id` | `string` | Owner id |
| `full_name` | `string` | Display name |
| `email` | `string` | Contact email |
| `phone` | `string` | Contact phone |
| `status` | `string` | Optional API status enum |
| `property_owned` | `number` | Optional property count |
| `leads_count` / `linked_leads` | `number` | Optional leads count |
| `assigned_agencies` | array | Super Admin assignment chips |

## Mutations / detail

- `OwnerStatusUpdateRequest` / `OwnerStatusUpdateResult`
- `UpdateOwnerRequest` / `UpdateOwnerResult`
- `OwnerLinkedPropertyItem` / `OwnerLinkedLeadItem`
- `NormalizedOwnerLinkedListResponse<T>`

## Related

- [owner.service.md](../services/owner.service.md)
- [mapOwnerListItemToLibraryOwner.md](../mappers/mapOwnerListItemToLibraryOwner.md)
