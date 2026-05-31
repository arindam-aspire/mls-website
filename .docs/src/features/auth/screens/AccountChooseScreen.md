# File Overview

Route-level screen for the choose-account auth modal view. UI-only shell: modal layout, header, form, and footer links.

**Source:** `src/features/auth/screens/AccountChooseScreen.tsx` (Client Component)

# Responsibilities

- Render auth modal panel for account type selection (choose-account view).
- Compose `AuthModalHeader`, `ChooseAccountForm`, and footer legal/create-account links.
- Delegate all logic to `useAccountChooseScreen`.

# Imports

- Modal UI from `@/src/components/ui`
- Typography helpers from `@/src/lib/typography`
- `AuthModalHeader`, `ChooseAccountForm`
- `useAccountChooseScreen` from `../hooks/useAccountChooseScreen`

# Exports

- `AccountChooseScreen`

# State Management

_None in component — see `useAccountChooseScreen`._

# API Usage

_N/A._

# Navigation

- Footer create-account link via `onCreateAccountClick` from hook.
- Account type navigation handled in `useChooseAccountForm`.

# Props / Parameters

_No props._

# Actions / Inputs

## Inputs

- Sign In / Sign Up toggle — via `ChooseAccountForm` (`mode` / `onModeChange` from hook).

## Actions

- **Create account** — footer link calls `onCreateAccountClick`.
- **Account type cards** — handled by `ChooseAccountForm` + `useChooseAccountForm`.

## Show/Hide Controls

- **Agent card** — disabled when `mode === "signup"` (in `ChooseAccountForm`).

# UI Details

- **Theme:** semantic tokens; footer `bg-primary-light` / `dark:bg-page`.
- **Radius:** modal `rounded-xl`; controls `rounded-lg`.
- **Responsive:** mobile-first padding on header, form, footer.

# Flow Description

1. `useAccountChooseScreen()` provides copy, mode, and handlers.
2. User toggles sign-in/sign-up → title updates.
3. User selects account type → form hook navigates to target auth view.
4. User may click footer create-account → social sign-up view.

# Dependencies

- [useAccountChooseScreen.md](../hooks/useAccountChooseScreen.md)
- [ChooseAccountForm.md](../components/ChooseAccountForm.md)
- [AuthModal](../components/AuthModal.tsx) — mounts this screen for `choose-account` view

# Notes

- Follows components-hooks architecture: single custom hook at top, JSX last.
