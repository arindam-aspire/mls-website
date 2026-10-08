# File Overview

Starts Google or Facebook through the Cognito hosted UI from the existing social sign-in and sign-up screens. Apple still opens the upcoming-feature modal.

**Source:** `src/features/auth/hooks/useSocialProviderAuth.ts`

**Used by:** `useSocialSignInScreen`, `useSocialRegistrationScreen`

# Responsibilities

- Map the selected account type to `registered_user` or `owner` with `resolveSignInRole`.
- Save that role in the provider window’s `sessionStorage` before that window leaves for Cognito. The current page stays open.
- Ignore repeated clicks while a redirect is starting.
- Refuse to start when the public OAuth settings are missing.

# Imports

- `readSocialOAuthPublicConfig`, `getPublicAppOrigin`
- `resolveSignInRole`, `isSocialAccountRole`
- `createSocialAuthorizeRequest`, `saveSocialOAuthPending`
- `useAuthStore`, `useToast`

# Exports

- `useSocialProviderAuth`

# State Management

- `pendingProvider` disables the social buttons and shows a loading label on the clicked provider.
- A ref blocks a second click before React re-renders.

# API Usage

_No API call. The callback page calls the APIs after the provider returns._

# Navigation

- `window.open` opens a blank window during the click, then that window navigates to the Cognito authorize URL.
- The original page stays in place. When the provider window finishes, this page stores the session and continues to the same post-login route as password sign-in.
- A blocked pop-up shows `auth.socialOAuth.popupBlocked`.

# Props / Parameters

| Param | Type | Purpose |
| --- | --- | --- |
| `accountType` | `"user"` \| `"owner"` | Becomes `registered_user` or `owner` |

# Actions / Inputs

## Inputs

_None._

## Actions

- **Google / Facebook** — start OAuth for the current role.
- **Apple** — open the upcoming-feature modal.

## Validations

- Role must be `registered_user` or `owner`. Anything else shows `auth.socialOAuth.roleNotAllowed` and does not redirect.
- Missing Cognito client id, identity provider name, authorize URL, or redirect URI shows `auth.socialOAuth.notConfigured`.

## Show/Hide Controls

- Upcoming-feature modal for Apple only.

# UI Details

_No JSX. Loading state is returned to `SocialAuthForm`._

# Flow Description

1. The social screen already shows the User/Owner toggle.
2. A provider click reads that toggle through `resolveSignInRole`.
3. PKCE verifier, state, and role are stored together.
4. A new window navigates to the Cognito hosted UI with `identity_provider` set to Google or Facebook. This page does not navigate away.
5. The callback page inside that window reads the same record and will not substitute another role.
6. The provider window closes. This page applies the session.

# Dependencies

- [socialOAuth.md](../utils/socialOAuth.md)
- [SocialAuthForm.md](../components/SocialAuthForm.md)

# Notes

- The role is not placed in the authorize URL.
