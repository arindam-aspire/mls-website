# File Overview

Pure helpers for verifying the signed-in user's current email or phone.

**Source:** `src/features/profile/utils/contactVerification.utils.ts`

# Responsibilities

- Build a request or confirm body that contains **only** the active channel.
- Detect an already-verified API error by code or message so the caller can refresh `GET /auth/me` instead of treating it as a failed OTP.

# Imports

Type-only imports from `profile.types`. Already-verified detection reads `code` and `message` on the normalized API error.

# Exports

| Function | Role |
| --- | --- |
| `isContactAlreadyVerifiedError` | True for `ALREADY_VERIFIED`, `EMAIL_ALREADY_VERIFIED`, `PHONE_ALREADY_VERIFIED`, `CONTACT_ALREADY_VERIFIED`, or an "already verified" message |
| `registeredContactChannel` | `"email"` when the request body has email and no phone |
| `buildRegisteredContactOtpRequest` | `{ channel: "email", email }` or `{ channel: "phone", phoneNumber }` |
| `buildRegisteredContactOtpConfirm` | `{ channel: "email", email, code }` or `{ channel: "phone", phoneNumber, phoneOtp }` |

# State Management

None.

# API Usage

Does not call the network. Email callers use `POST /auth/resend-confirmation` (`channel: "email"`) and `POST /auth/confirm-signup`. Phone callers use `POST /auth/send-phone-otp`, `POST /auth/resend-phone-otp`, and `POST /auth/verify-phone-otp`.

# Navigation

None.

# Props / Parameters

`channel` is `"email"` or `"phone"`. `contact` supplies the account email and phone. Confirm also takes the 6-digit code.

# Actions / Inputs

No UI.

# UI Details

Not a UI module.

# Flow Description

1. The verify hook chooses a channel.
2. The request builder returns one field so the other channel is not submitted.
3. Confirm uses the same channel and the OTP the user entered.
4. An already-verified error is recognized without matching invalid or expired OTP messages.

# Dependencies

- [useVerifyContactModal.md](../hooks/useVerifyContactModal.md)
- `contactVerification.utils.test.ts`

# Notes

Invalid OTP and expired OTP messages stay errors. They are not treated as already verified.
