# File Overview

Logic for the signup confirmation OTP screen.

**Source:** `src/features/auth/hooks/useConfirmSignUpScreen.ts` (Client hook)

# Responsibilities

- Resolve contact email from `pendingEmail`, `pendingSignUp`, or `pendingAgencySignUp`.
- Verify via `POST /auth/confirm-signup`.
- Resend via `POST /auth/resend-confirmation` (not a second signup).
- On success, auto-login with the pending password when present; otherwise open the matching sign-in view.

# Imports

- `useConfirmSignUp`, `useResendConfirmation`, `useSignInWithPassword`
- `useAuthStore`, `useToast`, `useTranslations`

# Exports

- `useConfirmSignUpScreen`

# State Management

Zustand modal stack + pending registration.

# API Usage

| Action | Endpoint |
| --- | --- |
| Verify | `POST /auth/confirm-signup` `{ email, code }` |
| Resend | `POST /auth/resend-confirmation` `{ email }` |
| Auto-login | `POST /auth/login/password` |

# Navigation

Modal `navigate` / `pop`. Auto-login uses `completeSignInFlow` inside `useSignInWithPassword`.

# Props / Parameters

None.

# Actions / Inputs

- `onSubmit(code)`
- `onResend()`
- `onBack()` / `onSignInClick()`

# UI Details

N/A (hook).

# Flow Description

1. Missing email → info toast, stay on screen.
2. Invalid/expired code → error toast from mutation, stay on screen.
3. Success → clear pending signup, then password login or email sign-in view.

# Dependencies

- `ConfirmSignUpScreen`

# Notes

Agency and user/owner share this confirm endpoint.
