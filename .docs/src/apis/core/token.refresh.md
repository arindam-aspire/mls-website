# File Overview

POST `/auth/refresh` with deduplicated in-flight refresh. Request body depends on `rememberMe` cookie (API `remember_me_cookie`).

**Source:** `src/apis/core/token.refresh.ts`

# Request body

| `rememberMe` cookie | Body |
| --- | --- |
| `"true"` | `{ username }` (+ `withCredentials` for server refresh cookie) |
| `"false"` | `{ username, refresh_token }` (both required) |

# Flow

1. `canRefreshSession()` — requires `username`; when `rememberMe` is false, client `refresh_token` is also required.
2. Build body via `buildRefreshTokenBody`.
3. POST with `withCredentials: true`.
4. On success, `parseRefreshPayload` reads wrapped `data` or flat body; `setSessionTokens` updates access and optional client `refresh_token` per `remember_me_cookie`.
5. On failure, `tokenStore.clearTokens()` and return `false`.

# Exports

- `refreshToken`

# Dependencies

- [token.store.md](./token.store.md)
