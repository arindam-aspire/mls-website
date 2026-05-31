# File Overview

Forgot-password form, request, and response types.

**Source:** `src/features/auth/types/forgotPassword.types.ts`

# Exports

- `ForgotPasswordFormValues`, `ForgotPasswordRequest`, `ForgotPasswordResponse`, `ResetPasswordRequest`, `ResetPasswordResponse`

# API Usage

| Type | Flow |
| --- | --- |
| `ForgotPasswordRequest` / `ForgotPasswordResponse` | `POST /auth/forgot-password/request` |
| `ResetPasswordRequest` / `ResetPasswordResponse` | `POST /auth/forgot-password/confirm` — `{ email, code, new_password }` |

# Dependencies

- [ForgotPasswordForm.md](../components/ForgotPasswordForm.md), [ForgotPasswordScreen.md](../screens/ForgotPasswordScreen.md), [ResetPasswordScreen.md](../screens/ResetPasswordScreen.md)
