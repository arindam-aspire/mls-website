# File Overview

Signup phone OTP screen. It shows the masked registered number and the shared 6-digit form. The number cannot be edited here.

**Source:** `src/features/auth/screens/VerifyPhoneScreen.tsx` (Client Component)

**Used by:** `AuthModal` when the stack top is `verify-phone`.

# Responsibilities

- Render the masked phone title and `OTPVerificationForm`.
- Hide the back button so the registered number cannot be changed on this step.
- Keep terms and privacy links in the footer.

# Imports

- `useVerifyPhoneScreen`
- `OtpVerificationTitle`, `OTPVerificationForm`, `AuthModalHeader`

# Exports

- `VerifyPhoneScreen`

# State Management

None. The hook owns the request, verify, and resend state.

# API Usage

None in this file. The hook calls the profile phone OTP endpoints.

# Navigation

Shown inside the auth modal. Locale routes do not change until verification succeeds.

# Props / Parameters

None.

# Actions / Inputs

- 6-digit code. Continue stays disabled until every digit is filled. An incomplete submit shows `auth.otpVerifyCodeRequired` (“Enter the 6-digit code”).
- Resend, disabled for 60 seconds and while a send is in flight.
- Modal close. Closing does not mark the phone verified.

# UI Details

- Same modal shell as confirm signup: `rounded-xl` panel, `rounded-lg` controls, semantic tokens, mobile-first padding.
- Title copy is `auth.verifyPhoneTitle`. Subtitle is the phone-only OTP subtitle.
- Light and dark use `bg-primary-light` / `dark:bg-page` on the footer.

# Flow Description

1. The screen mounts after email confirmation and password sign-in when a phone was stored and is not verified.
2. The hook sends the OTP to that registered number.
3. The user enters the code or resends it.
4. Success continues the sign-in redirect. Failure stays on this screen.

# Dependencies

- [useVerifyPhoneScreen.md](../hooks/useVerifyPhoneScreen.md)
- Shared OTP form in `src/components/ui/otp-verification`

# Notes

There is no unauthenticated phone OTP endpoint. This screen runs only after the account is signed in.
