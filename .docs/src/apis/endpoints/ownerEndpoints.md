# Owner endpoints

**Source:** `src/apis/endpoints/ownerEndpoints.ts`

URL builders for agency-scoped owner APIs.

## `ownerEndpoints.LIST`

`GET /agency/{agencyId}/owners?page=&pageSize=&search=&status=`

| Query | Required | Description |
| --- | --- | --- |
| `page` | yes | 1-based page index |
| `pageSize` | yes | Page size |
| `search` | no | Name/email filter |
| `status` | no | Uppercase status (`ACTIVE`, `SUSPENDED`) |

## Consumer

- `getOwnerList` in `src/features/user/services/owner.service.ts`
