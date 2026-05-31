# File Overview

Screen-level hook for the choose-account auth modal view. Owns local sign-in/sign-up mode state, derived title copy, and footer navigation to social sign-up.

**Source:** `src/features/auth/hooks/useAccountChooseScreen.ts` (Client hook)

# Responsibilities

- Manage `ChooseAccountMode` (`signin` | `signup`) local state for the account chooser screen.
- Derive modal title from current mode and auth translations.
- Navigate to another auth view via `router.replace` + `AUTH_QUERY_KEY`.
- Expose footer copy and create-account click handler for `AccountChooseScreen`.

# Imports

- `useTranslations` from `next-intl`
- `usePathname`, `useRouter` from `@/src/i18n/navigation`
- `AUTH_QUERY_KEY`, `AUTH_VIEW`, `AuthView` from `../authViews`
- `ChooseAccountMode` from `../types/chooseAccount.types`

# Exports

- `useAccountChooseScreen()` — returns screen copy, mode state, and footer handlers

# State Management

- **React** `useState<ChooseAccountMode>` — sign-in vs sign-up toggle (default `signin`)

# API Usage

_N/A._

# Navigation

- `openAuthView(view)` — `router.replace(\`${pathname}?${AUTH_QUERY_KEY}=${view}\`)`
- `onCreateAccountClick` — opens `AUTH_VIEW.userSocialSignUp`

# Props / Parameters

_No hook parameters._

# Actions / Inputs

## Inputs

- Sign In / Sign Up toggle — via returned `mode` and `onModeChange` (passed to `ChooseAccountForm`).

## Actions

- **Create account link** — `onCreateAccountClick` navigates to user social sign-up view.

# UI Details

_Return values only; no UI in hook._

# Flow Description

1. Screen mounts and calls `useAccountChooseScreen()`.
2. User toggles mode via `onModeChange` → title updates from memoized `title`.
3. User clicks footer “Create account” → `onCreateAccountClick` → `user-social-sign-up` auth view.
4. Account type cards are handled by `useChooseAccountForm` inside `ChooseAccountForm`.

# Dependencies

- [AccountChooseScreen.md](../screens/AccountChooseScreen.md)
- [ChooseAccountForm.md](../components/ChooseAccountForm.md)
- [chooseAccount.types.md](../types/chooseAccount.types.md)
- [authViews.md](../authViews.md)

# Notes

- Follows hooks architecture: router/navigation first, then translations, local state, memoized values, callbacks, return.
