# Auth types (`src/features/auth/types/`)

TypeScript definitions for auth API payloads, responses, and form values. Split by flow; re-exported from `index.ts` and `auth.types.ts`.

## Files

| File | Contents |
| --- | --- |
| [chooseAccount.types.md](./chooseAccount.types.md) | Choose-account mode and account type unions |
| [signUp.types.md](./signUp.types.md) | Sign-up and confirm-sign-up |
| [signIn.types.md](./signIn.types.md) | Password sign-in, `SignInTokens` |
| [signInOtp.types.md](./signInOtp.types.md) | OTP request/verify |
| [forgotPassword.types.md](./forgotPassword.types.md) | Forgot-password flow |
| [changePassword.types.md](./changePassword.types.md) | Authenticated change-password payload/response |
| [user.types.md](./user.types.md) | `LoggedInUser`, `Role`, `Permission` |
| [logout.types.md](./logout.types.md) | Logout response |
| [index.md](./index.md) | Barrel re-exports |
| [auth.types.md](./auth.types.md) | Compatibility barrel (`export * from "./index"`) |

## Usage

```ts
// Specific module (preferred for new code)
import type { LoggedInUser } from "@/src/features/auth/types/user.types";

// Barrel (existing imports)
import type { SignInResponse } from "@/src/features/auth/types/auth.types";
import type { SignInResponse } from "@/src/features/auth/types";
```

- Imported by `auth.service.ts`, `auth.store.ts`, forms, and mutations.
- API responses follow `{ success, message, data, error, meta }` wrapper pattern.

## Notes

- `LoggedInUser` includes `roles` and `permissions` for future RBAC UI.
- Form types may include UI-only fields (e.g. `rememberMe`) mapped in services.
- `SignInOtp` types depend on `SignInTokens` from `signIn.types.ts`.
