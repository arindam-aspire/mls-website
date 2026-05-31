# File Overview

Types for the choose-account auth flow: sign-in/sign-up mode and account type identifiers.

**Source:** `src/features/auth/types/chooseAccount.types.ts`

# Responsibilities

- Define `ChooseAccountMode` union for toggle state.
- Export `CHOOSE_ACCOUNT_TYPES` constant array and `ChooseAccountType` derived type.

# Exports

- `ChooseAccountMode` — `"signin" | "signup"`
- `CHOOSE_ACCOUNT_TYPES` — `["agency", "owner", "user", "agent"]`
- `ChooseAccountType` — union of account type strings

# Dependencies

- [ChooseAccountForm.md](../components/ChooseAccountForm.md) — re-exports for backward compatibility
- [useAccountChooseScreen.md](../hooks/useAccountChooseScreen.md)
- [useChooseAccountForm.md](../hooks/useChooseAccountForm.md)

# Notes

- Barrel export via `types/index.ts`.
