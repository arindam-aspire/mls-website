# ownerEndpoints

**Source:** `src/apis/endpoints/ownerEndpoints.ts`

Builds authenticated owner-management API paths under `/agency/...`.

## Endpoints

| Key | Method (consumer) | Path |
| --- | --- | --- |
| `LIST` | GET | `/agency/{agencyId}/owners?page=&pageSize=&search=&status=` |
| `PLATFORM_LIST` | GET | `/agency/owners?page=&pageSize=&search=&status=&agencyId=` |
| `ASSIGN_AGENCY` | POST | `/agency/owners/{ownerId}/agency` |
| `DETAIL` | GET | `/agency/owners/{ownerId}` |
| `UPDATE` | PATCH | `/agency/owners/{ownerId}` |
| `UPDATE_STATUS` | PATCH | `/agency/owners/{ownerId}/status` |
| `LINKED_PROPERTIES` | GET | `/agency/owners/{ownerId}/properties?page=&pageSize=` |
| `LINKED_LEADS` | GET | `/agency/owners/{ownerId}/leads?page=&pageSize=` |

## Query helpers

- `OwnerListQueryParams` — list pagination, search, status, optional `agencyId`
- `OwnerLinkedListQueryParams` — linked properties/leads pagination

## Related

- [owner.service.md](../../features/user/services/owner.service.md)
- [owner.types.md](../../features/user/types/owner.types.md)
