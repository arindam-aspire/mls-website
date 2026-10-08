# File Overview

Route-level screen component composing feature UI.

**Source:** `src/features/auth/screens/SocialSignInScreen.tsx` (Client Component)

# Responsibilities

- Route-level screen component composing feature UI.

# Imports

- `UpcomingFeatureModal` from `@/src/components/common/UpcomingFeatureModal`
- `usePathname`, `useRouter` from `@/src/i18n/navigation`
- `AuthModalHeader`, `SocialAuthForm`

# Exports

- `SocialSignInScreen`

# State Management

- **React state lives in `useSocialProviderAuth`.** Apple still opens `UpcomingFeatureModal`. Google and Facebook set `pendingProvider` and leave the page.

# Actions / Inputs

## Actions

- **Google / Facebook** — opens the Cognito hosted UI in a new window. The current page stays open. The User or Owner toggle is stored with the PKCE state and sent later to `POST /auth/login/social`.
- **Apple** — opens `UpcomingFeatureModal` (Apple sign-in is not wired).
- **Create account** footer link — navigates to matching social sign-up view.

## Show/Hide Controls

- `isUpcomingFeatureModalOpen` — toggles `UpcomingFeatureModal` above the auth modal.

## Validations

_No explicit validations detected._

## Show/Hide Controls

_No explicit show/hide controls detected._

# UI Details

- **Theme:** semantic tokens (`bg-page`, `bg-surface`, `text-text`, `text-muted`, `bg-primary`, `border-secondary/15`).
- **Light/dark:** via `ThemeProvider` / `html.light` | `html.dark`.
- **Radius:** `rounded-lg` controls; `rounded-xl` cards/modals/popovers; `rounded-full` avatars/pills.
- **Responsive:** mobile-first (`sm:`, `md:`, `lg:`).
- Uses **`Modal`** from UI kit (`rounded-xl`).

# Flow Description

See source in `src/features/auth/screens/SocialSignInScreen.tsx` for step-by-step behavior aligned with [application.md](../../application.md) (path relative may vary).

# Dependencies

- Parent feature or route that imports this file.
- See **Imports** for direct module dependencies.

# Notes

- Keep in sync when `src/features/auth/screens/SocialSignInScreen.tsx` changes.
