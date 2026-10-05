# File Overview

Sends and confirms the signup phone OTP using the existing authenticated profile APIs.

**Source:** `src/features/auth/hooks/useVerifyPhoneScreen.ts` (Client hook)

# Responsibilities

- Resolve the registered number from `GET /auth/me` `phone_number`, then the signup `pendingPhone`.
- Send one OTP when the screen opens.
- Block send and resend when the number is missing.
- Verify with `{ phone_number, phone_otp }`.
- Continue the sign-in redirect only when the refreshed user has `is_phone_verified === true`.
- Never store, log, or display the code.

# Imports

- `useRequestProfileUpdate`, `useVerifyProfileUpdate`
- `requestSignupPhoneOtp`, `createSmsRequestLock`
- `finishAuthenticatedSession`

# Exports

- `useVerifyPhoneScreen`

# State Management

Zustand `user` and `pendingPhone`. An in-memory lock prevents overlapping sends. The code itself is not stored.

# API Usage

| Action | Endpoint | Body | Auth |
| --- | --- | --- | --- |
| Send / resend | `PATCH /auth/me/profile/request` | `{ phone_number }` | yes |
| Verify | `POST /auth/me/profile/verify` | `{ phone_number, phone_otp }` | yes |
| Refresh | `GET /auth/me` | — | yes, inside verify |

# Navigation

On a verified refresh, `finishAuthenticatedSession` closes the modal and follows the same dashboard redirect as password sign-in. `rememberMe: true` from the confirm step is left unchanged.

# Props / Parameters

None.

# Actions / Inputs

- `onSubmit(code)` — missing phone shows `auth.api.missingPhoneTitle` / `missingPhoneDescription` and does not call verify. The Verify button is enabled as soon as 6 digits are entered. It shows the verifying state only while the verify request is in flight, not while the code is being sent.
- `onResend()` — same number, same lock. The form clears digits and starts the 60-second timer.
- Invalid, expired, used, or network errors stay on the screen. The mutation toast uses the API message, with provider and credential text replaced by `profile.verificationErrorDescription`.

# UI Details

N/A (hook).

# Flow Description

1. Screen mount sends the OTP once for the registered number.
2. A second send while one is in flight is ignored.
3. Submit posts the typed code with that same number.
4. Success writes the user from `GET /auth/me`. If `is_phone_verified` is not `true`, the modal stays open.
5. If it is `true`, the deferred sign-in redirect runs.

# Dependencies

- [VerifyPhoneScreen.md](../screens/VerifyPhoneScreen.md)
- [signupPhoneVerification.md](../utils/signupPhoneVerification.md)

# Notes

Email confirmation is a separate earlier step and is not changed by this verify call. The backend sets `is_phone_verified`.
