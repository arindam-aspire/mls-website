# owner.service

**Source:** `src/features/user/services/owner.service.ts`

Authenticated API helpers for owner management (list, assign, detail, edit, status, linked resources).

## Functions

| Function | Endpoint | Returns |
| --- | --- | --- |
| `getOwnerList(agencyId, params)` | `GET /agency/{agencyId}/owners` | `{ owners, pagination }` |
| `getPlatformOwnerList(params)` | `GET /agency/owners` | `{ owners, pagination }` |
| `assignOwnerAgency(ownerId, agencyId)` | `POST /agency/owners/{ownerId}/agency` | assign response |
| `getOwnerDetail(ownerId)` | `GET /agency/owners/{ownerId}` | `OwnerListItem` |
| `updateOwner(ownerId, body)` | `PATCH /agency/owners/{ownerId}` | `{ message, owner }` |
| `updateOwnerStatus(ownerId, body)` | `PATCH /agency/owners/{ownerId}/status` | `{ message, owner }` |
| `getOwnerLinkedProperties(ownerId, params)` | `GET /agency/owners/{ownerId}/properties` | `{ items, pagination }` |
| `getOwnerLinkedLeads(ownerId, params)` | `GET /agency/owners/{ownerId}/leads` | `{ items, pagination }` |

## List query params

| Param | Notes |
| --- | --- |
| `page` / `pageSize` | Pagination (defaults from `ownerList.constants`) |
| `search` | Name/email search |
| `status` | Uppercase owner status (`ACTIVE`, `SUSPENDED`) |
| `agencyId` | Optional platform-list filter |

## Status body

`OwnerStatusUpdateRequest`: `{ status: "ACTIVE" \| "SUSPENDED" \| …, reason? }`

Activate → `ACTIVE`. Deactivate → `SUSPENDED`.

## Consumers

- `useOwnersScreen` — list + assignment
- `useOwnerViewModal` — detail
- `useUpdateOwner` / `useUpdateOwnerStatus` — mutations
- `useOwnerLinkedResourcesModal` — linked tables

## Related

- [ownerEndpoints.md](../../../apis/endpoints/ownerEndpoints.md)
- [owner.mutation.md](../mutations/owner.mutation.md)
- [owner.types.md](../types/owner.types.md)
