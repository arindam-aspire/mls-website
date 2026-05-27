# File Overview

Password sign-in form, request, token, and response types.

**Source:** `src/features/auth/types/signIn.types.ts`

# Exports

- `SignInFormValues`, `SignInRequest`, `SignInTokens`, `SignInResponse`

# API Usage

| Type | Flow |
| --- | --- |
| `SignInRequest` / `SignInResponse` | `POST` login with password |

# Dependencies

- [SignInForm.md](../components/SignInForm.md), [SignInScreen.md](../screens/SignInScreen.md)
- [signInOtp.types.md](./signInOtp.types.md) imports `SignInTokens` for OTP verify response
