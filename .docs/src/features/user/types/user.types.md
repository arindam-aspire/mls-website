# File Overview

Types for user API endpoints.

**Source:** `src/features/user/types/user.types.ts`

# Exports

## `AssignUserAgencyRequest`

```ts
{ agencyId: string }
```

Body for `PATCH /users/agency`.

## `AssignUserAgencyResponse`

Standard API envelope:

| Field | Type |
| --- | --- |
| `success` | `boolean` |
| `message` | `string \| null` |
| `data` | `unknown` |
| `error` | `unknown` |
| `meta` | `Record<string, unknown>` |

# Dependencies

- [user.service.md](../services/user.service.md)
- `userEndpoints.AGENCY`
