# File Overview

Compatibility barrel: re-exports all auth types from [index.ts](./index.ts) so existing `import … from "../types/auth.types"` paths keep working.

**Source:** `src/features/auth/types/auth.types.ts`

# Responsibilities

- Re-export every type from split modules via `./index`.

# Imports

- `./index` (aggregates `signUp`, `signIn`, `signInOtp`, `forgotPassword`, `user`, `logout` modules)

# Exports

All types from:

- [signUp.types.md](./signUp.types.md)
- [signIn.types.md](./signIn.types.md)
- [signInOtp.types.md](./signInOtp.types.md)
- [forgotPassword.types.md](./forgotPassword.types.md)
- [user.types.md](./user.types.md)
- [logout.types.md](./logout.types.md)

# State Management

_N/A._

# API Usage

_N/A — definitions only._

# Navigation

_N/A._

# Props / Parameters

_N/A._

# Actions / Inputs

_N/A._

# UI Details

_N/A._

# Flow Description

Consumers import from this file or from `index.ts` / domain-specific `*.types.ts` files interchangeably.

# Dependencies

- [README.md](./README.md) — folder index

# Notes

- Prefer importing from the domain file (e.g. `user.types`) in new code for clearer dependencies.
