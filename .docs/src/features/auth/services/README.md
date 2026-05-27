# Auth services (`src/features/auth/services/`)

Thin async functions that call the backend through `authClient`. No React dependencies.

## Files

| File | Functions |
| --- | --- |
| [auth.service.md](./auth.service.md) | `signInWithPassword`, `getLoggedInUser`, `logout`, `signInWithOtpRequest`, `signInWithOtpVerify`, `signUp`, `confirmSignUp`, `forgotPassword` |

## Client usage

- Most calls: `authClient.request` with default `auth: false`.
- Authenticated: `getLoggedInUser`, `logout` pass `auth: true` (Bearer token + refresh required by interceptor).

## Types

Request/response shapes: [types/auth.types.md](../types/auth.types.md).

## Endpoints

Mapped in `src/apis/endpoints/authEndpoints.ts` — e.g. `POST /auth/login/password`, `GET /auth/me`.
