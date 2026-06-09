# File Overview

Decodes the access JWT payload (no signature verification) and returns the embedded API role name.

**Source:** `src/features/auth/utils/getAccessTokenRoleName.ts`

# Responsibilities

- Parse JWT segment 1 (payload) from the `access_token` cookie value.
- Read `role.role_name` from the JSON payload.
- Return `null` on malformed tokens or missing role.

# Exports

- `getAccessTokenRoleName(accessToken: string): string | null`

# State Management

Pure function — no store access.

# Usage

| Consumer | When |
| --- | --- |
| `AuthProvider` | On mount — `setLoggedInUserRole` before `GET /auth/me` |
| `auth.store` `setAuth` / `setAccessToken` | After login or token refresh |
| `postSignInRedirect.ts` | Immediate dashboard redirect after sign-in |

# Dependencies

- Browser/Edge `atob` for base64url decode.

# Notes

- Does not validate JWT signature; used only for UX hints (sidebar, redirect). Authorization remains server-side.
- OTP verify responses may omit embedded role — fall back to `/auth/me` or sign-in role hints.
