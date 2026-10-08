# File Overview

OTP modal for verifying the signed-in user's current email or phone on My Profile.

**Source:** `src/features/profile/screens/VerifyContactModal.tsx`

# Responsibilities

- Reuse `ProfileEditContactModal`, `ProfileOtpVerificationContact`, and `ProfileOtpVerificationForm`.
- Show a channel-specific title and the masked contact the OTP was sent to.
- Pass resend and confirm labels for the active channel.
- Remount the OTP inputs when a new session starts (`key` includes channel and `otpSessionKey`) so email and phone digits, errors, and the resend timer do not mix.

# Imports

- `ProfileEditContactModal`
- `ProfileOtpVerificationForm`
- `ContactVerificationChannel`

# Exports

- `VerifyContactModal`
- `VerifyContactModalProps`

# State Management

None. [useVerifyContactModal.md](../hooks/useVerifyContactModal.md) owns the session and passes props from `ProfileScreen`.

# API Usage

None in this file. Submit and resend callbacks belong to the hook.

# Navigation

Rendered on `/[locale]/my-profile` for the authenticated user only.

# Props / Parameters

| Prop | Role |
| --- | --- |
| `verificationType` | `"email"` or `"phone"` while the modal is open |
| `contactEmail` / `contactPhone` | Contact for the active channel only |
| `title` / `subtitle` | `Verify your email` or `Verify your phone number`, plus `Enter the OTP sent to` |
| `resendLabel` | `Resend Email OTP` or `Resend Phone OTP` |
| `confirmLabel` | `Verify` |
| `isLoading` / `isResending` | Disable confirm and resend while those requests run |

# Actions / Inputs

| Input | Validation |
| --- | --- |
| 6-digit OTP | Required before submit (`otpVerifyCodeRequired` from the shared form) |
| Verify | Calls `onSubmit` with the digits. The button is disabled and shows **Verifying…** while the confirm request runs |
| Resend | Calls `onResend` after the shared 60-second timer |

# UI Details

- Same modal shell, digit boxes (`rounded-lg`), and primary verify button as edit-email OTP.
- Title and masked contact are centered. Email masking uses two visible local characters, matching the profile card.
- Light/dark semantic tokens come from the shared OTP components.

# Flow Description

1. `ProfileScreen` renders this modal closed.
2. After a successful OTP request, `isOpen` becomes true and `verificationType` is set.
3. The user enters the code or resends.
4. Success closes the modal from the hook. The profile card then reads the refreshed user.

# Dependencies

- [useVerifyContactModal.md](../hooks/useVerifyContactModal.md)
- [ProfileScreen.md](./ProfileScreen.md)
- Shared OTP UI in `src/components/ui/otp-verification`

# Notes

Dev OTP values are not rendered. Signup and login OTP screens do not use this modal.
