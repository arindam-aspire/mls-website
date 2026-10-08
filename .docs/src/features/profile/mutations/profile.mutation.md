# File Overview

React Query mutations for profile writes, including verify-current-contact OTP.

**Source:** `src/features/profile/mutations/profile.mutation.ts`

# Responsibilities

- Update profile, avatar, agency, and contact-change OTP.
- `useRequestProfileUpdate` and `useVerifyProfileUpdate` stay on the edit-email, edit-phone, and signup-phone flows.
- `useRequestRegisteredContactOtp` and `useConfirmRegisteredContactOtp` send and confirm an OTP for the account's current email or phone, then store the user from `GET /auth/me`.

# Imports

- Profile service functions, including `refreshAuthenticatedProfile` and `verifyProfileUpdateAndRefreshUser`
- `isContactAlreadyVerifiedError` / `registeredContactChannel`
- `useAuthStore`, `useToast`

# Exports

| Hook | Role |
| --- | --- |
| `useRequestProfileUpdate` | Edit-contact and signup phone OTP request |
| `useVerifyProfileUpdate` | Edit-contact and signup phone OTP confirm |
| `useRequestRegisteredContactOtp` | Verify-current-contact OTP request |
| `useConfirmRegisteredContactOtp` | Verify-current-contact OTP confirm and profile refresh |
| `useUpdateProfile` / picture / agency hooks | Unchanged profile writes |

# State Management

Success paths call `setUser` with the `/auth/me` payload. Failures toast a sanitized message and do not change verification flags.

# API Usage

| Hook | Endpoint |
| --- | --- |
| Email request | `POST /auth/resend-confirmation` with `{ email, channel: "email" }` |
| Phone request | `POST /auth/send-phone-otp` or `POST /auth/resend-phone-otp` |
| Email confirm | `POST /auth/confirm-signup` with `{ email, code }`, then `GET /auth/me` |
| Phone confirm | `POST /auth/verify-phone-otp`, then `GET /auth/me` |
| Already verified | `GET /auth/me` via `refreshAuthenticatedProfile` |

# Navigation

None.

# Props / Parameters

Request and confirm hooks take the existing profile OTP body types. The channel is inferred from which fields are present.

# Actions / Inputs

No direct UI. Toasts:

- Send failure: `contactVerification.sendErrorTitle` plus the API message, or the generic send fallback.
- Confirm failure: channel error title plus the API message (invalid OTP, expired OTP, or other backend text).
- Success: email verified or phone verified.
- Already verified: refresh the user and show the already-verified toast.

# UI Details

Toasts use the shared `useToast` helper. Infrastructure and raw OTP digits are stripped by `sanitizeSmsErrorMessage`.

# Flow Description

1. The verify hook calls the registered-contact request mutation.
2. A normal success returns the response so the modal can open.
3. An already-verified error refreshes the user and is returned as success so the modal stays closed.
4. Confirm writes the refreshed user into the auth store. The other channel is whatever `/auth/me` returned.

# Dependencies

- [profile.service.md](../services/profile.service.md)
- [useVerifyContactModal.md](../hooks/useVerifyContactModal.md)

# Notes

Signup phone verification still uses `useRequestProfileUpdate` and `useVerifyProfileUpdate`.
