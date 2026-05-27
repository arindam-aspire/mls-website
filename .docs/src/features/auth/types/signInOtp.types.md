# File Overview

Sign-in with OTP request, session data, verify request/response types.

**Source:** `src/features/auth/types/signInOtp.types.ts`

# Imports

- `SignInTokens` from `./signIn.types`

# Exports

- `SignInWithOtpRequest`, `SignInWithOtpResponseData`, `SignInWithOtpResponse`
- `SignInWithOtpVerifyRequest`, `SignInWithOtpVerifyResponse`

# API Usage

| Type | Flow |
| --- | --- |
| `SignInWithOtpRequest` / `SignInWithOtpResponse` | Request login OTP |
| `SignInWithOtpVerifyRequest` / `SignInWithOtpVerifyResponse` | Verify OTP (returns `SignInTokens`) |

# Dependencies

- [auth.mutation.md](../mutations/auth.mutation.md), [auth.store.md](../store/auth.store.md)
