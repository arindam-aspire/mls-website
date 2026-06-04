# File Overview

Password sign-in form, request, token, and response types.

**Source:** `src/features/auth/types/signIn.types.ts`

# Exports

- `SignInFormValues`, `SignInRequest`, `SignInTokens`, `SignInResponse`
- `SignInRole`, `SignInAccountType`, `resolveSignInRole(accountType)`

# API Usage

| Type | Flow |
| --- | --- |
| `SignInRequest` / `SignInResponse` | `POST` login with password |

## `SignInTokens`

| Field | When remember me checked (API) |
| --- | --- |
| `remember_me_cookie: true` | `refresh_token` is `null`; client stores access + `rememberMe` + `username`; refresh POST `{ username }` + credentials |
| `remember_me_cookie: false` | `refresh_token` string; client cookies + refresh POST `{ username, refresh_token }`; refresh response may return `refresh_token: null` (keep existing client token) |

## `SignInRequest.role`

Password sign-in sends a `role` field derived from account type via `resolveSignInRole`:

| Account type | `role` value |
| --- | --- |
| `agency` | `admin` |
| `owner` | `owner` |
| `user` | `registered_user` |
| `agent` | `agent` |

# Dependencies

- [SignInForm.md](../components/SignInForm.md), [SignInScreen.md](../screens/SignInScreen.md)
- [signInOtp.types.md](./signInOtp.types.md) imports `SignInTokens` for OTP verify response
