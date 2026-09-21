# File Overview

Sign-up and confirm-sign-up API/form types.

**Source:** `src/features/auth/types/signUp.types.ts`

# Exports

- `SignUpFormValues` — form fields only (no `role`)
- `SignUpRequest` — `{ full_name, email, phone_number?, password, role }` for `POST /auth/signup`. Phone is E.164 when present.
- `SignUpResponse`, `ConfirmSignUpRequest`, `ConfirmSignUpResponse`
- `ResendConfirmationRequest`, `ResendConfirmationResponse` — `POST /auth/resend-confirmation`

# API Usage

| Type | Flow |
| --- | --- |
| `SignUpRequest` / `SignUpResponse` | `POST` signup (`role`: `registered_user` for user, `owner` for owner) |
| `ConfirmSignUpRequest` / `ConfirmSignUpResponse` | Confirm signup OTP |

# Dependencies

- [SignUpForm.md](../components/SignUpForm.md), [UserRegistrationScreen.md](../screens/UserRegistrationScreen.md), [auth.service.md](../services/auth.service.md)
