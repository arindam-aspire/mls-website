# File Overview

Request and response types for `POST /auth/login/social`.

**Source:** `src/features/auth/types/socialLogin.types.ts`

# Responsibilities

- Name the providers and the only roles social sign-in may send: `registered_user` and `owner`.
- Reuse the password-login token response shape.

# Imports

- `SignInResponse` from `signIn.types.ts`

# Exports

- `SocialLoginProvider`
- `SocialAccountRole`
- `SocialLoginRequest`
- `SocialLoginResponse`
- `isSocialAccountRole`

# State Management

_N/A._

# API Usage

`SocialLoginRequest` is the body of `POST /auth/login/social`. Google and Facebook send the Cognito authorization `code`, `code_verifier`, and `redirect_uri`. The API exchanges that code. `role` is the User or Owner choice saved before the redirect. The API uses it when creating an account and keeps the database role for an existing account.

# Navigation

_N/A._

# Props / Parameters

| Field | Values |
| --- | --- |
| `provider` | `google`, `facebook`, `apple` (Apple is not started by the UI) |
| `role` | `registered_user`, `owner` |
| `code` | Cognito authorization code from the callback |
| `code_verifier` | PKCE verifier saved before the redirect |
| `redirect_uri` | The same callback URI used to start Cognito |
| `id_token` | Optional Cognito ID token. This web flow sends `code` instead |
| `access_token` | Optional field on the API contract. This web flow does not send it |

# Actions / Inputs

_N/A._

# UI Details

_N/A._

# Flow Description

`resolveSignInRole("user" | "owner")` produces the role. `isSocialAccountRole` rejects `admin`, `agent`, and `super_admin` before any redirect.

# Dependencies

- [signIn.types.md](./signIn.types.md)
- [auth.service.md](../services/auth.service.md)

# Notes

- Re-exported from `types/index.ts`, so `auth.types.ts` includes these types.
