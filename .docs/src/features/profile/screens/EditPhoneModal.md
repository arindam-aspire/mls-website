# File Overview

Modal for changing phone number in two steps: request verification code, then confirm OTP.

**Source:** `src/features/profile/screens/EditPhoneModal.tsx`

# Responsibilities

- Render form step (`EditPhoneForm`) or OTP step (`ProfileOtpVerificationTitle` + `ProfileOtpVerificationForm`).
- Back button on OTP step returns to form (via [useEditPhoneModal.md](../hooks/useEditPhoneModal.md)).

# API Usage

| Step | Endpoint | Body |
| --- | --- | --- |
| Request / resend | `PATCH /auth/me/profile/request` | `{ phone_number }` (E.164, e.g. `+962779875677`) |
| Verify | `POST /auth/me/profile/verify` | `{ phone_number, phone_otp }` |

Request response may include `data.otp`, `dev_phone_otp` for dev display. Resend uses the same request endpoint with the pending number.

# Dependencies

- [useEditPhoneModal.md](../hooks/useEditPhoneModal.md)
- [EditPhoneForm.md](../components/EditPhoneForm.md)
