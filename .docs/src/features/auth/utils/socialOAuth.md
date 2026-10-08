# File Overview

Pure helpers for the Cognito hosted-UI authorization-code + PKCE redirect. Google and Facebook are selected with `identity_provider`. These helpers do not create the application session.

**Source:** `src/features/auth/utils/socialOAuth.ts`

# Responsibilities

- Build the Cognito authorize URL from public environment values. The same app client is used for Google and Facebook.
- Keep the selected role, PKCE verifier, and locale in `sessionStorage` for 15 minutes. The role is not put on the authorize URL and is not read from the provider.
- Parse the callback query and detect cancellation.
- The callback page posts the code to `POST /auth/login/social`. The API exchanges it.
- `exchangeSocialAuthorizationCode` remains for `POST /api/auth/social/exchange` and is not used by the callback.
- Remember a completed hosted-UI session so logout can call the Cognito logout endpoint when a sign-out URL is configured.

# Imports

- `SocialOAuthPublicConfig` from `environment.config.ts`
- `routing` / `AppLocale`
- `isSocialAccountRole`

# Exports

- `SOCIAL_OAUTH_CALLBACK_PATH`, `SOCIAL_OAUTH_EXCHANGE_PATH`
- `createSocialAuthorizeRequest`
- `resolveSocialRedirectUri`, `isAllowedSocialRedirectUri`
- `saveSocialOAuthPending`, `readSocialOAuthPending`, `consumeSocialOAuthPending`, `clearSocialOAuthPending`
- `parseSocialOAuthCallback`, `isSocialOAuthCancellation`
- `resolveCognitoEndpoint`, `resolveCognitoTokenEndpoint`, `buildCognitoLogoutUrl`
- `markCognitoHostedSession`, `takeCognitoHostedSession`
- `exchangeSocialAuthorizationCode`, `readEmailFromIdToken`
- `COGNITO_OIDC_SCOPES`

# State Management

`sessionStorage` key `mls_social_oauth_pending` is written on the provider window, not the page that opened it. `consumeSocialOAuthPending` deletes it so a second effect cannot repeat the login call. `localStorage` key `mls_social_oauth_result` tells the original page that the provider window succeeded, failed, or was cancelled. `localStorage` key `mls_cognito_hosted_session` records that logout should also end the Cognito hosted UI session. The provider window name is `mls-social-oauth`.

# API Usage

The live callback calls `POST /auth/login/social` with `code`, `code_verifier`, and `redirect_uri`. `exchangeSocialAuthorizationCode` still calls `POST /api/auth/social/exchange` and is not part of that path.

# Navigation

The authorize URL is `NEXT_PUBLIC_COGNITO_OAUTH_AUTHORIZE_URL`, or `https://{NEXT_PUBLIC_COGNITO_DOMAIN}/oauth2/authorize` when that override is empty. `identity_provider` is `NEXT_PUBLIC_COGNITO_GOOGLE_IDENTITY_PROVIDER` or `NEXT_PUBLIC_COGNITO_FACEBOOK_IDENTITY_PROVIDER`. The redirect URI is `{origin}/{locale}/auth/social/callback` unless `NEXT_PUBLIC_SOCIAL_OAUTH_REDIRECT_URI` is set.

# Props / Parameters

`createSocialAuthorizeRequest` requires a public config object, provider, redirect URI, locale, and `registered_user` or `owner`.

# Actions / Inputs

_No UI._

# UI Details

_N/A._

# Flow Description

1. Create a random `state` and PKCE verifier.
2. Put `code_challenge` on the authorize URL. Do not put the role or any secret on the URL.
3. Save the pending record.
4. After the redirect, consume that record only when `state` matches.
5. The callback sends the code to `POST /auth/login/social`. The API exchanges it at the Cognito token endpoint.

# Dependencies

- [environment.config.md](../../../configs/environment.config.md)
- [socialLogin.types.md](../types/socialLogin.types.md)

# Notes

- Covered by `socialOAuth.test.ts`.
- Relative imports avoid a path alias so the Node test runner can load the module.
