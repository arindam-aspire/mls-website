# File Overview

Route-level screen component composing feature UI.

**Source:** `src/features/auth/screens/SocialRegistrationScreen.tsx` (Client Component)

# Responsibilities

- Route-level screen component composing feature UI.

# Imports

- `UpcomingFeatureModal` from `@/src/components/common/UpcomingFeatureModal`
- `usePathname`, `useRouter` from `@/src/i18n/navigation`
- `AuthModalHeader`, `SocialAuthForm`

# Exports

- `SocialRegistrationScreen`

# State Management

- **React** `useState` — `isUpcomingFeatureModalOpen` toggles the coming-soon overlay when a social provider button is clicked.

# API Usage

_N/A unless extended._

# Navigation

- Use **`Link`**, **`useRouter`**, **`redirect`** from `@/src/i18n/navigation` for locale-prefixed paths (e.g. `/en/listing`).
- Auth modal: query `?auth=<view>` on current pathname (see `authViews.ts`).

# Props / Parameters

- `type: SocialAccountType` — `"user"` | `"owner"` from parent auth routing.

# Actions / Inputs

## Actions

- **Google / Facebook / Apple** — opens `UpcomingFeatureModal` (social sign-up not yet available).
- **Log in** footer link — navigates to the matching social sign-in auth view.
- **Upcoming feature modal dismiss** — closes the overlay (`Got it` or close button).

## Show/Hide Controls

- `isUpcomingFeatureModalOpen` — shows/hides `UpcomingFeatureModal` above the auth modal.

# UI Details

- **Theme:** semantic tokens (`bg-page`, `bg-surface`, `text-text`, `text-muted`, `bg-primary`, `border-secondary/15`).
- **Light/dark:** via `ThemeProvider` / `html.light` | `html.dark`.
- **Radius:** `rounded-lg` controls; `rounded-xl` cards/modals/popovers; `rounded-full` avatars/pills.
- **Responsive:** mobile-first (`sm:`, `md:`, `lg:`).
- Renders auth **`ModalPanel`** plus **`UpcomingFeatureModal`** (portaled at `z-[100]`) for social provider actions.

# Flow Description

1. User lands on social registration (`userSocialSignUp` / `ownerSocialSignUp` auth view).
2. Title/subtitle render; `SocialAuthForm` receives `onSocialProviderClick` to open the coming-soon modal.
3. Tapping Google, Facebook, or Apple shows `UpcomingFeatureModal` with default copy.
4. Email sign-up and account-type toggle continue via `SocialAuthForm` as before.

# Dependencies

- Parent feature or route that imports this file.
- See **Imports** for direct module dependencies.

# Notes

- Keep in sync when `src/features/auth/screens/SocialRegistrationScreen.tsx` changes.
