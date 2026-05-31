# File Overview

Form-level hook for the choose-account card list and mode toggle data. Resolves auth views per account type and navigates with optional `portal=agent` for agent sign-in.

**Source:** `src/features/auth/hooks/useChooseAccountForm.ts` (Client hook)

# Responsibilities

- Build memoized account type cards (icon, title, description) from auth translations.
- Build sign-in / sign-up toggle items for `ToggleButton`.
- On account type select: resolve target auth view, build modal URL with `returnView` and optional portal, `router.replace`.
- Invoke optional `onAccountTypeSelect` callback after navigation.

# Imports

- Lucide icons (`Building2`, `Headphones`, `KeyRound`, `User`)
- `useCallback`, `useMemo` from `react`
- `useTranslations` from `next-intl`
- `usePathname`, `useRouter` from `@/src/i18n/navigation`
- `AUTH_VIEW`, `buildAuthModalUrl`, `resolveAccountTypeAuthView` from `../authViews`
- `ChooseAccountMode`, `ChooseAccountType` from `../types/chooseAccount.types`

# Exports

- `useChooseAccountForm({ mode, onAccountTypeSelect? })`

# State Management

_Controlled mode from parent; no local state._

# API Usage

_N/A._

# Navigation

- Account type click → `buildAuthModalUrl(pathname, view, { returnView: choose-account, portal?: agent })`
- Agent + sign-in → `portal=agent` on agency sign-in flow

# Props / Parameters

| Param | Type | Purpose |
| --- | --- | --- |
| `mode` | `ChooseAccountMode` | Current sign-in vs sign-up mode |
| `onAccountTypeSelect?` | `(type: ChooseAccountType) => void` | Optional side effect after navigation |

# Actions / Inputs

## Actions

- **Account type card click** — `onAccountTypeSelect(type)` navigates to resolved auth view when not null.

# UI Details

_Return values only; icons passed to `AccountTypeCard` as components._

# Flow Description

1. `ChooseAccountForm` calls hook with `mode` from screen.
2. User picks account type → `resolveAccountTypeAuthView(type, mode)`.
3. If view exists, replace URL with auth modal query (+ portal for agent sign-in).
4. Optional parent callback runs.

# Dependencies

- [ChooseAccountForm.md](../components/ChooseAccountForm.md)
- [chooseAccount.types.md](../types/chooseAccount.types.md)
- [authViews.md](../authViews.md)
- [useAuthPortal.md](./useAuthPortal.md) — reads `portal` on agency flows

# Notes

- Agent card disabled state (`mode === "signup"`) remains in `ChooseAccountForm` UI (presentation rule from mode prop).
