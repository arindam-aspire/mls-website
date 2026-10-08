# File Overview

Sends and confirms an OTP for the signed-in user's **current** email or phone, without the edit-contact form.

**Source:** `src/features/profile/hooks/useVerifyContactModal.ts`

# Responsibilities

- Keep `verificationType` as `"email"` or `"phone"` for the open OTP session.
- Read the contact from the auth-store user (`email`, `phone_number` from `GET /auth/me`). The UI never submits a typed address for this flow.
- Call the existing profile OTP request, then open the OTP modal only after the request succeeds.
- Confirm with the matching verify body, then replace the auth user with a fresh `GET /auth/me`.
- Leave the other channel's verified flag untouched. The client does not set `is_email_verified` or `is_phone_verified` itself.

# Imports

- `useRequestRegisteredContactOtp` / `useConfirmRegisteredContactOtp`
- `refreshAuthenticatedProfile`
- `buildRegisteredContactOtpRequest` / `buildRegisteredContactOtpConfirm`
- `parseStoredPhoneNumber` for the masked phone line

# Exports

- `useVerifyContactModal`

# State Management

| State | Purpose |
| --- | --- |
| Auth store `user` | Source of the registered email and phone |
| `session` | Channel plus the contact the OTP was sent to |
| `isOpen` | OTP modal visibility |
| `sendingType` | Which verify button is loading |
| `sendLock` ref | Ignores a second click before React re-renders |

# API Usage

| Step | Endpoint | Body |
| --- | --- | --- |
| Send / resend email | `POST /auth/resend-confirmation` | `{ email, channel: "email" }` — email only |
| Send phone | `POST /auth/send-phone-otp` | `{ phone_number }` from the account — SMS only |
| Resend phone | `POST /auth/resend-phone-otp` | same registered number |
| Confirm email | `POST /auth/confirm-signup` | `{ email, code }` |
| Confirm phone | `POST /auth/verify-phone-otp` | `{ phone_number, phone_otp }` |
| Refresh | `GET /auth/me` | After confirm, and when the backend says the contact is already verified |

Auth: Bearer token. Signup, login, and forgot-password endpoints are not used here.

# Navigation

Stays on `/[locale]/my-profile`. The page is already behind `useAuthorize("PROFILE")`.

# Props / Parameters

No arguments. The hook reads the signed-in user.

# Actions / Inputs

| Action | Behavior |
| --- | --- |
| `startEmail` / `startPhone` | Sends OTP. Button stays loading until the request finishes. Failure does not open the modal. |
| OTP submit | Confirms that channel only. Invalid or expired codes stay on the modal; the badge stays **Not verified**. |
| Resend | Same request API, existing 60-second timer inside `OtpVerificationForm`. Disabled while a request or confirm is in flight. |
| Close | Hides the modal. Verification flags stay as last returned by `/auth/me`. |

# UI Details

Copy comes from `profile.contactVerification` (all locales). The modal reuses the shared OTP inputs.

# Flow Description

1. User clicks **Verify Email** or **Verify Phone**.
2. Email uses `POST /auth/resend-confirmation` with `channel: "email"`, which emails the code and does not text it. Phone uses `POST /auth/send-phone-otp`, which texts the registered number and does not email it.
3. On success, the OTP modal opens for that channel only.
4. If the backend says the contact is already verified, the hook refreshes `/auth/me` and does not open the modal.
5. A valid OTP calls `POST /auth/me/profile/verify`, then `GET /auth/me`, then `setUser`. The badge follows the refreshed flag.
6. A failed OTP shows the sanitized API message in a toast and leaves the badge unverified.

# Dependencies

- [VerifyContactModal.md](../screens/VerifyContactModal.md)
- [profile.mutation.md](../mutations/profile.mutation.md) — request and confirm hooks live in `profile.mutation.ts`
- [contactVerification.utils.md](../utils/contactVerification.utils.md)

# Notes

Edit email and edit phone still use `useRequestProfileUpdate` and `useVerifyProfileUpdate`. This hook does not change those mutations, so signup phone verification and contact-change OTP keep their existing toasts.
