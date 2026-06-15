# File Overview

User-domain API services for `/users/*` routes.

**Source:** `src/features/user/services/user.service.ts`

Used when the app must mutate or read the authenticated user resource outside profile-specific flows (e.g. linking an agency before property create).

# Responsibilities

- `assignUserAgency` — `PATCH /users/agency` with `{ agencyId }`.
- `assignUserAgencyAndRefreshUser` — assign then `GET /auth/me` to return updated `LoggedInUser`.

# Imports

- `apiClient` from `@/src/apis/clients/api.client`
- `userEndpoints` from `@/src/apis/endpoints/userEndpoints`
- `getLoggedInUser` from `@/src/features/auth/services/auth.service`
- `AssignUserAgencyResponse` from `../types/user.types`

# Exports

| Function | Returns | Description |
| --- | --- | --- |
| `assignUserAgency(agencyId)` | `AssignUserAgencyResponse` | PATCH agency link |
| `assignUserAgencyAndRefreshUser(agencyId)` | `LoggedInUser` | PATCH + refresh session user |

# API Usage

| Method | Endpoint | Auth | Body |
| --- | --- | --- | --- |
| PATCH | `/users/agency` | yes | `{ agencyId: string }` |
| GET | `/auth/me` | yes | — (after successful PATCH) |

# Flow Description

1. Caller passes `agencyId` (e.g. from `SelectAgencyModal`).
2. `assignUserAgency` sends PATCH; throws if `success` is false in `assignUserAgencyAndRefreshUser`.
3. `getLoggedInUser` returns fresh user with `has_agency` / `agency` populated.
4. Caller updates auth store (`setUser`) and navigates (e.g. property create).

# Dependencies

- [user.types.md](../types/user.types.md)
- [useSelectAgencyModal.md](../../profile/hooks/useSelectAgencyModal.md)
- `userEndpoints.ts` — `AGENCY: "/users/agency"`

# Notes

- `profile.service.ts` re-exports both functions so existing profile imports keep working; prefer importing from this module in new code.
