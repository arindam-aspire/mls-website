# File Overview

Modal for changing phone number in two steps: request verification code, then confirm OTP.

**Source:** `src/features/profile/screens/EditPhoneModal.tsx`

# Responsibilities

- Render form step (`EditPhoneForm`) or OTP step (`ProfileOtpVerificationTitle` + `ProfileOtpVerificationForm`).
- Back button on OTP step returns to form (via [useEditPhoneModal.md](../hooks/useEditPhoneModal.md)).

# API Usage

| Step | Endpoint | Body |
| --- | --- | --- |
| Request / resend | `PATCH /auth/me/profile/request` | `{ phone_number }` (E.164 from the phone input) |
| Verify | `POST /auth/me/profile/verify` | `{ phone_number, phone_otp }` |

OTP fields on the request response are ignored and never shown. Resend uses the same request endpoint with the pending number. `is_phone_verified` becomes true only after verify refreshes `GET /auth/me`.

# Dependencies

- [useEditPhoneModal.md](../hooks/useEditPhoneModal.md)
- [EditPhoneForm.md](../components/EditPhoneForm.md)
