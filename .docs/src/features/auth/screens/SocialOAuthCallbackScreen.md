# File Overview

Presentational result of the Google/Facebook OAuth return. Loading, cancel, and failure copy come from `useSocialOAuthCallback`.

**Source:** `src/features/auth/screens/SocialOAuthCallbackScreen.tsx`

**Used by:** `app/[locale]/(landing)/auth/social/callback/page.tsx`

# Responsibilities

- Show the callback title and description.
- Show a skeleton while the code exchange and login API are in progress.
- Show a home button when sign-in does not complete.

# Imports

- `Button`, `Skeleton`
- `useSocialOAuthCallback`

# Exports

- `SocialOAuthCallbackScreen`

# State Management

_Owned by the hook._

# API Usage

_Owned by the hook._

# Navigation

- Home button calls `onHome`, which replaces the locale home route.

# Props / Parameters

_None._

# Actions / Inputs

## Inputs

_None._

## Actions

- **Back to home** (`auth.socialOAuth.backHome`)

## Validations

_None in the screen._

## Show/Hide Controls

- Skeleton while `status === "loading"`.
- Home button after an error or cancellation.

# UI Details

- Card: `rounded-xl`, `border-secondary/15`, `bg-surface`.
- Text: `text-text`, `text-muted`.
- Button: shared primary button, `min-h-11`, `rounded-lg` from the button component.
- Works in light and dark themes. Width is fluid (`max-w-xl`, `px-4 sm:px-6`).

# Flow Description

1. The page mounts this screen.
2. The hook completes or fails the social session.
3. On failure the translated message and home button replace the skeleton.

# Dependencies

- [useSocialOAuthCallback.md](../hooks/useSocialOAuthCallback.md)

# Notes

- `aria-busy` is set while the exchange is running.
