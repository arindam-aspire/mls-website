# File Overview

Signup email OTP confirmation screen inside `AuthModal`.

**Source:** `src/features/auth/screens/ConfirmSignUpScreen.tsx` (Client Component)

# Responsibilities

- Render the 6-digit verification UI after user, owner, or agency registration.
- Show the masked contact email (and phone when present). Never display an OTP from the API.

# Imports

- UI: `ModalPanel`, `ModalContent`, `ModalFooter`, `Link`
- `AuthModalHeader`, `OtpVerificationTitle`, `OTPVerificationForm`
- `useConfirmSignUpScreen`

# Exports

- `ConfirmSignUpScreen`

# State Management

Logic lives in `useConfirmSignUpScreen` (Zustand `useAuthStore`).

# API Usage

See `useConfirmSignUpScreen`.

# Navigation

Modal-only. After success, auto-login when a pending password exists; otherwise navigate to the matching email sign-in view.

# Props / Parameters

None.

# Actions / Inputs

## Inputs

- 6-digit OTP fields

## Actions

- Verify
- Resend (60s cooldown)
- Sign in link
- Back

# UI Details

- Semantic tokens; `rounded-xl` modal; `rounded-lg` OTP digits and button
- Light/dark via `ThemeProvider`
- Mobile-first OTP digit sizes (`size-12 sm:size-14`)

# Flow Description

1. Registration success navigates here with `pendingEmail` set.
2. User enters the email OTP and submits.
3. Wrong/expired codes stay on this screen (toast from `useConfirmSignUp`).
4. Resend calls `POST /auth/resend-confirmation`.

# Dependencies

- `useConfirmSignUpScreen`
- `OtpVerificationTitle` / `OTPVerificationForm`

# Notes

Production never renders `data.otp` / `data.dev_email_otp`.
