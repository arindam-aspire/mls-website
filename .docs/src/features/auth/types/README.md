# Auth types (`src/features/auth/types/`)

TypeScript definitions for auth API payloads, responses, and form values.

## Files

| File | Contents |
| --- | --- |
| [auth.types.md](./auth.types.md) | `SignUpFormValues`, `SignInRequest`, `SignInResponse`, OTP types, `LoggedInUser`, `LogoutResponse`, etc. |

## Usage

- Imported by `auth.service.ts`, `auth.store.ts`, forms, and mutations.
- API responses follow `{ success, message, data, error, meta }` wrapper pattern.

## Notes

- `LoggedInUser` includes `roles` and `permissions` for future RBAC UI.
- Form types may include UI-only fields (e.g. `rememberMe`) mapped in services.
