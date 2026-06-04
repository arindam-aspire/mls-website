# File Overview

Cookie read/write for access and refresh tokens plus auth preferences (`rememberMe`, `username`).

**Source:** `src/apis/core/token.store.ts`

# Cookie keys

| Key | Purpose |
| --- | --- |
| `access_token` | Bearer access token (1 day) |
| `refresh_token` | Client-held refresh token (session cookie) when API `remember_me_cookie` is false; cleared when true |
| `rememberMe` | Mirrors API `remember_me_cookie`: `"true"` = server HttpOnly refresh, `"false"` = client refresh body |
| `username` | Sign-in username; sent in refresh body when `rememberMe` is false |

# Exports

- `tokenStore`

# Methods

- `setSessionTokens({ accessToken, refreshToken, rememberMeCookie, username })` — login/refresh: stores access; drops or sets client `refresh_token` per `rememberMeCookie`
- `setAuthPreferences(rememberMe, username)` — set on sign-in success (password or OTP)
- `getRememberMe()` / `getUsername()` — read for refresh body
- `hasAuthCredentials()` — gate authenticated axios requests (see [axios.interceptor.md](./axios.interceptor.md))
- `canRefreshSession()` — gate 401 refresh retry
- `clearTokens()` — removes all four cookies (logout / refresh failure)

# Dependencies

- [token.refresh.md](./token.refresh.md)
- [auth.store.md](../../features/auth/store/auth.store.md)
