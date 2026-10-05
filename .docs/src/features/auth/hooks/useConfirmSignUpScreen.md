# File Overview

Logic for the signup confirmation OTP screen.

**Source:** `src/features/auth/hooks/useConfirmSignUpScreen.ts` (Client hook)

# Responsibilities

- Resolve contact email from `pendingEmail`, `pendingSignUp`, or `pendingAgencySignUp`.
- Resolve contact phone from `pendingSignUp.phone_number` or `pendingAgencySignUp.phone` (E.164 from the registration forms) so the existing OTP title can mask both destinations. SMS delivery stays on the backend.
- Verify via `POST /auth/confirm-signup`.
- Resend via `POST /auth/resend-confirmation` (not a second signup).
- On success, auto-login with the pending password when present (`rememberMe: true`). The password is not kept after that call starts.
- If that signup stored a phone number, set `signupPhoneVerificationPending` and `pendingPhone`, then let sign-in open `verify-phone` when `is_phone_verified` is not `true`.
- If no phone was stored, follow the previous sign-in close/redirect.

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
3. Success with a stored phone and a password → password sign-in, then the phone OTP screen when the account phone is not verified.
4. Success without a phone → clear pending signup, then password login or the email sign-in view.

# Dependencies

- `ConfirmSignUpScreen`

# Notes

Agency and user/owner share this confirm endpoint.
