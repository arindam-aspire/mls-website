# File Overview

Modal for changing email in two steps: request verification code, then confirm OTP.

**Source:** `src/features/profile/screens/EditEmailModal.tsx`

# Responsibilities

- Render form step (`EditEmailForm`) or OTP step (`ProfileOtpVerificationTitle` + `ProfileOtpVerificationForm`).
- Back button on OTP step returns to form (via [useEditEmailModal.md](../hooks/useEditEmailModal.md)).

# API Usage

| Step | Endpoint | Body |
| --- | --- | --- |
| Request / resend | `PATCH /auth/me/profile/request` | `{ email }` |
| Verify | `POST /auth/me/profile/verify` | `{ email, email_otp }` |

On verify success, `useVerifyProfileUpdate` refreshes the user via `GET /auth/me`, updates `auth.store`, and shows a toast.

# Dependencies

- [useEditEmailModal.md](../hooks/useEditEmailModal.md)
- [EditEmailForm.md](../components/EditEmailForm.md)
