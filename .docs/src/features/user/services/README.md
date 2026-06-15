# User services (`src/features/user/services/`)

HTTP layer for `/users/*` endpoints.

## Files

| File | Role |
| --- | --- |
| [user.service.md](./user.service.md) | `assignUserAgency`, `assignUserAgencyAndRefreshUser` |
| [index.md](./index.md) | Barrel re-export |

## Consumers

- `src/features/profile/hooks/useSelectAgencyModal.ts`
- `src/features/profile/services/profile.service.ts` (re-export only)
