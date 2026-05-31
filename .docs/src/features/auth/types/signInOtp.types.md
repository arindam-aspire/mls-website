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
| `SignInWithOtpRequest` / `SignInWithOtpResponse` | Request login OTP (`username`, `role`) |
| `SignInWithOtpVerifyRequest` / `SignInWithOtpVerifyResponse` | Verify OTP (`username`, `code`, `session`, `role`; returns `SignInTokens`) |

## Session handoff

1. OTP request stores `response.data` in `auth.store` → `pendingOtpSession`.
2. Navigation to OTP verify includes `otp-session` and `otp-code` query params (survives page refresh).
3. OTP verification reads session via `resolveSignInOtpSession(searchParams, pendingOtpSession)` — URL first, then store.
4. Verify POST sends `{ username, code, session, role }` (`username` from `otp-email` query param).

## `role` values

Same mapping as password sign-in via `resolveSignInRoleFromAuthContext(returnView, portal)`:

| Context | `role` |
| --- | --- |
| User sign-in | `registered_user` |
| Owner sign-in | `owner` |
| Agency sign-in | `admin` |
| Agent sign-in (`portal=agent`) | `agent` |

# Dependencies

- [auth.mutation.md](../mutations/auth.mutation.md), [auth.store.md](../store/auth.store.md)
