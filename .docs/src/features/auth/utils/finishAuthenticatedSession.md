# File Overview

Closes the auth modal and runs the post-sign-in redirect after phone verification succeeds.

**Source:** `src/features/auth/utils/finishAuthenticatedSession.ts`

# Responsibilities

- Clear `signupPhoneVerificationPending` and `pendingPhone`.
- Close the modal.
- Redirect with the same dashboard helpers used by password sign-in.
- Leave access and refresh tokens, including remember-me, as the sign-in step stored them.

# Imports

- `useAuthStore`
- `resolveImmediateDashboardPath`, `getPostSignInRedirectPath`
- `navigateTo`

# Exports

- `finishAuthenticatedSession(locale)`

# State Management

Reads the current user and access token from Zustand, then clears only the phone-verification modal fields via `closeAuth`.

# API Usage

None.

# Navigation

Locale-prefixed dashboard path when the role requires it. Otherwise the modal closes on the current page.

# Props / Parameters

- `locale` — active next-intl locale.

# Actions / Inputs

None.

# UI Details

N/A.

# Flow Description

Called from `useVerifyPhoneScreen` only after `GET /auth/me` reports `is_phone_verified === true`.

# Dependencies

- [useVerifyPhoneScreen.md](../hooks/useVerifyPhoneScreen.md)

# Notes

This does not store a password or an OTP.
