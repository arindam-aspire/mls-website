# File Overview

Presentational form for choosing account type and sign-in vs sign-up mode in the auth modal. Logic lives in `useChooseAccountForm`.

**Source:** `src/features/auth/components/ChooseAccountForm.tsx` (Client Component)

# Responsibilities

- Render mode toggle (`ToggleButton`) and account type cards (`AccountTypeCard`).
- Show social sign-in info note.
- Re-export choose-account types from `types/chooseAccount.types` for backward compatibility.

# Imports

- `ToggleButton` from `@/src/components/ui`
- `useChooseAccountForm` from `../hooks/useChooseAccountForm`
- `AccountTypeCard`
- Types from `../types/chooseAccount.types`

# Exports

- `ChooseAccountForm`
- Re-exports: `ChooseAccountMode`, `ChooseAccountType`, `CHOOSE_ACCOUNT_TYPES`

# State Management

_Controlled `mode` from parent; navigation in hook._

# API Usage

_N/A._

# Navigation

- Account type selection via `useChooseAccountForm` → `buildAuthModalUrl`.

# Props / Parameters

| Prop | Type | Purpose |
| --- | --- | --- |
| `mode` | `ChooseAccountMode` | Current toggle value |
| `onModeChange` | `(mode) => void` | Toggle change handler |
| `onAccountTypeSelect?` | `(type) => void` | Optional callback after select |
| `className?` | `string` | Root wrapper classes |

# Actions / Inputs

## Inputs

- **Sign In / Sign Up toggle** — controlled by `mode` / `onModeChange`.

## Actions

- **Account type card click** — `onAccountTypeSelect` from hook.

## Show/Hide Controls

- **Agent card** — `disabled` when `mode === "signup"`.
- **Agent sign-in** — navigates with `portal=agent` (hook).

# UI Details

- Info note: `rounded-xl`, `border-secondary/15`, `bg-primary-light`.
- Toggle: full width, primary ghost, rounded pill items.

# Flow Description

1. Hook returns account types, toggle items, labels, and select handler.
2. User changes mode → parent updates via `onModeChange`.
3. User clicks card → hook resolves view and replaces URL.

# Dependencies

- [useChooseAccountForm.md](../hooks/useChooseAccountForm.md)
- [chooseAccount.types.md](../types/chooseAccount.types.md)
- [AccountTypeCard.md](./AccountTypeCard.md)

# Notes

- Types moved to `chooseAccount.types.ts`; component re-exports preserve existing import paths.
