# File Overview

Maps social login failures to `auth.socialOAuth` translation keys.

**Source:** `src/features/auth/utils/socialAuthError.ts`

# Responsibilities

- Read `detail.code` from a FastAPI error body, or `code` from the exchange route.
- Map known codes to localized copy.
- Treat HTTP 409 as an existing email account.
- Treat network and timeout errors as `network`.

# Imports

- `ApiError`

# Exports

- `readSocialErrorCode`
- `socialAuthMessageKey`
- `resolveSocialAuthErrorMessage`

# State Management

_N/A._

# API Usage

Used after `POST /auth/login/social` and when describing exchange failures that were turned into `ApiError`.

# Navigation

_N/A._

# Props / Parameters

`resolveSocialAuthErrorMessage(error, translate)` — `translate` is `useTranslations("auth.socialOAuth")`.

# Actions / Inputs

_N/A._

# UI Details

_N/A. Callers render the returned string in the callback page and the error toast._

# Flow Description

1. Prefer a known provider code such as `SOCIAL_ROLE_NOT_ALLOWED` or `SOCIAL_EMAIL_ALREADY_REGISTERED`.
2. Otherwise use the API message when it is non-empty.
3. Otherwise use `failedDescription`.

# Dependencies

- [error.normalizer](../../../apis/core/error.normalizer.md) when present
- `src/messages/{en,ar,es,fr}/auth.json` key `socialOAuth`

# Notes

- Provider tokens are never included in the message.
