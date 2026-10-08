# File Overview

Server-only exchange of a Cognito authorization code for Google or Facebook hosted UI. The browser never receives the app client secret. The route returns only the Cognito ID token that `POST /auth/login/social` verifies.

**Source:** `app/api/auth/social/exchange/route.ts`

# Responsibilities

- Accept `provider`, `code`, `codeVerifier`, and `redirectUri`.
- Reject redirect URIs that are not this site's `/{locale}/auth/social/callback` path.
- Exchange the code at the Cognito token URL. Google and Facebook use the same endpoint and app client.
- Return the Cognito `id_token`.
- Return an error `code` only. Do not return provider error text or secrets.

# Imports

- `APP_URL`, `readSocialOAuthPublicConfig`
- `isAllowedSocialRedirectUri`, `isSocialOAuthProvider`

# Exports

- `POST`
- `dynamic = "force-dynamic"`

# State Management

_None._

# API Usage

- `POST` Cognito `/oauth2/token` from `COGNITO_OAUTH_TOKEN_URL`, or derived from `COGNITO_DOMAIN` / `NEXT_PUBLIC_COGNITO_DOMAIN`.
- Sends `COGNITO_APP_CLIENT_SECRET` when the app client has a secret, plus the PKCE verifier.
- Does not call the MLS API. The browser does that with `signInWithSocial`.

# Navigation

_None._

# Props / Parameters

JSON body:

| Field | Rule |
| --- | --- |
| `provider` | `google` or `facebook` |
| `code` | Authorization code, max 2048 characters |
| `codeVerifier` | PKCE verifier, max 128 characters |
| `redirectUri` | Must match the URI used to start OAuth |

# Actions / Inputs

## Inputs

_HTTP POST only._

## Actions

_None._

## Validations

- Missing fields → `400` `SOCIAL_TOKEN_MISSING`
- Redirect URI outside the app → `400` `SOCIAL_TOKEN_INVALID`
- Missing client id or token URL → `503` `SOCIAL_PROVIDER_NOT_CONFIGURED`
- Cognito `invalid_client` → `503` `SOCIAL_PROVIDER_NOT_CONFIGURED`
- Provider network failure → `503` `SOCIAL_PROVIDER_UNAVAILABLE`
- `invalid_grant` → `401` `SOCIAL_TOKEN_EXPIRED`
- Other provider rejection → `401` `SOCIAL_TOKEN_INVALID`

## Show/Hide Controls

_N/A._

# UI Details

_N/A._

# Flow Description

1. The callback page posts the code and PKCE verifier.
2. This route checks the redirect URI against `NEXT_PUBLIC_APP_URL` or the current request origin.
3. It exchanges the code with the provider.
4. The Cognito `id_token` is returned. The social callback does not call this route. It posts `code`, `code_verifier`, and `redirect_uri` to `POST /auth/login/social`, and the API performs the exchange.

# Dependencies

- [socialOAuth.md](../../../../../src/features/auth/utils/socialOAuth.md)
- [environment.config.md](../../../../../src/configs/environment.config.md)

# Notes

- Middleware skips `/api`, so this route is not locale-prefixed and does not require an access-token cookie.
- Client secrets must stay server-only. Do not prefix them with `NEXT_PUBLIC_`.
