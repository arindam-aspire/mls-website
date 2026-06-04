# File Overview

Axios request/response interceptors for authenticated clients: Bearer token, `withCredentials`, and 401 refresh retry aligned with `rememberMe` cookie rules.

**Source:** `src/apis/core/axios.interceptor.ts`

# Responsibilities

- Attach `Authorization` when `useAuth()` and session credentials exist.
- Set `withCredentials: true` on authenticated requests (supports remember-me refresh via cookies).
- On `401`, attempt `refreshToken()` once, then retry with the new access token.
- Redirect to `/` when credentials are missing or refresh cannot run.

# Session checks (`tokenStore`)

| `rememberMe` | `hasAuthCredentials()` (send API request) | `canRefreshSession()` (retry after 401) |
| --- | --- | --- |
| `true` | Requires `access_token` only | Requires `username` (refresh body `{ username }`) |
| `false` | Requires `access_token` + `refresh_token` | Requires `username` + `refresh_token` |

# Flow Description

1. **Request:** If `useAuth()` and `!hasAuthCredentials()` → `navigateTo('/')`, reject.
2. **Request:** Set Bearer access token and `withCredentials: true`.
3. **Response 401:** If `!canRefreshSession()` → redirect home, reject.
4. **Response 401:** Call `refreshToken()`; on success, update `Authorization` on `originalRequest` and retry once.
5. **Refresh failure:** `clearTokens()` (in refresh module) and `navigateTo('/')`.

# Exports

- `applyInterceptors`

# Dependencies

- [token.store.md](./token.store.md)
- [token.refresh.md](./token.refresh.md)
