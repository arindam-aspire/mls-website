# File Overview

Finishes Google or Facebook sign-in after Cognito redirects the provider window back. One in-flight task is shared if React runs the effect twice, so the login API is not called twice for the same code. The original page stays open and applies the session when this window reports the result.

**Source:** `src/features/auth/hooks/useSocialOAuthCallback.ts`

**Used by:** `SocialOAuthCallbackScreen`

# Responsibilities

- Read `code`, `state`, and cancellation errors from the query string.
- Require the saved User/Owner pending record to match `state`.
- Call `useSignInWithSocial` with the authorization code so the API exchanges it.
- Show a translated error when the provider or API rejects the attempt.

# Imports

- `useSignInWithSocial`
- `consumeSocialOAuthPending`, `resolveSocialAuthErrorMessage`

# Exports

- `useSocialOAuthCallback`

# State Management

- Local `status`, `title`, and `description`.
- Pending OAuth data is removed as soon as `state` matches, before the network calls.

# API Usage

1. `POST /auth/login/social` through `signInWithSocial`, sending the Cognito authorization code, PKCE verifier, redirect URI, provider, and saved role
2. `GET /auth/me` inside the shared sign-in completion used by password login

# Navigation

- Success uses the same redirect as password sign-in. User and Owner return to `/{locale}` when the token has no dashboard role.
- **Back to home** uses `router.replace("/")`.

# Props / Parameters

_None._

# Actions / Inputs

## Inputs

Provider query: `code`, `state`, `error`, `error_reason`.

## Actions

- Automatic completion on mount.
- Home button after failure.

## Validations

| Case | Message key |
| --- | --- |
| `access_denied`, `user_denied`, `user_cancelled` | `cancelledDescription` |
| Missing code, bad state, expired pending record | `invalidSession` |
| Provider not configured | `notConfigured` |
| Expired or invalid code | `tokenExpired` / `tokenInvalid` |
| Email already registered | `emailAlreadyRegistered` |
| Wrong role for an existing account | `roleNotAllowed` |
| Network failure | `network` |

## Show/Hide Controls

- `status === "loading"` keeps the skeleton visible.

# UI Details

_Presentational output is rendered by the screen._

# Flow Description

1. Parse the query before any request.
2. Cancelled OAuth clears the pending role and stops.
3. A matching state is consumed once.
4. The code is stripped from the URL.
5. `POST /auth/login/social` sends the authorization code, the saved provider, and the saved User or Owner role. The API exchanges the code with Cognito and is the source of truth for the application user and role.
7. Tokens are stored with the existing cookie session. The profile email is saved as the refresh username.

# Dependencies

- [useSignInWithSocial in auth.mutation.md](../mutations/auth.mutation.md)
- [socialOAuth.md](../utils/socialOAuth.md)
- [socialAuthError.md](../utils/socialAuthError.md)

# Notes

- Provider tokens are not logged.
- A direct visit to the callback without a matching pending record does not call the API.
