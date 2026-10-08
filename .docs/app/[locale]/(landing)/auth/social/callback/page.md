# File Overview

Public return page for the Cognito hosted UI after Google or Facebook sign-in. It does not render the auth modal flow. The landing layout stays around it so the page is reachable without a session cookie.

**Source:** `app/[locale]/(landing)/auth/social/callback/page.tsx`

**Route:** `/{locale}/auth/social/callback` (for example `/en/auth/social/callback`)

# Responsibilities

- Render `SocialOAuthCallbackScreen`.
- Stay outside protected routes so the OAuth provider can return before tokens exist.

# Imports

- `SocialOAuthCallbackScreen`

# Exports

- Default page component

# State Management

_None in the page. Session completion lives in `useSocialOAuthCallback`._

# API Usage

_None in the page. The screen hook calls `POST /auth/login/social` with the Cognito authorization code._

# Navigation

- Cognito redirects the provider window here with `?code=` and `?state=`, or `?error=access_denied` when the user cancels. The page that opened the window does not navigate.
- After a successful session, User and Owner accounts continue to `/{locale}` unless the access token role is a dashboard role.
- The home button uses locale-aware `router.replace("/")`.

# Props / Parameters

Query string from the provider: `code`, `state`, `error` or `error_reason`. The code is removed from the address bar before the backend call.

# Actions / Inputs

## Inputs

_No form fields._

## Actions

- **Back to home** after a failed or cancelled provider return.

## Validations

- State must match the User/Owner role saved before the redirect.
- A missing or mismatched state does not call the login API.

## Show/Hide Controls

- Loading skeleton while the code is exchanged.
- Home button after an error or cancellation.

# UI Details

- `rounded-xl` surface card, semantic `bg-surface` / `text-text` / `text-muted`.
- Mobile-first padding (`px-4 sm:px-6`).
- Home control uses the shared button (`rounded-lg`, at least 44px tall).

# Flow Description

1. Google or Facebook redirects to this locale URL.
2. The screen reads the query once, checks the saved role, and exchanges the code.
3. Success stores the application session and leaves this page.
4. Cancel, expiry, or API failure stays on this page with a translated message.

# Dependencies

- [SocialOAuthCallbackScreen.md](../../../../../../src/features/auth/screens/SocialOAuthCallbackScreen.md)
- Landing layout

# Notes

- Register every locale callback, or set `NEXT_PUBLIC_SOCIAL_OAUTH_REDIRECT_URI` to one exact URI.
- The authorization code is not written to logs.
