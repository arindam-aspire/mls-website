# File Overview

Heading for auth OTP screens. It tells the user the same code was sent to the registered email and mobile, and shows those contacts masked. It does not request, generate, or validate the code.

**Source:** `src/features/auth/components/OtpVerificationTitle.tsx` (Client Component)

**Used by:** `OTPVerificationScreen` (login OTP and forgot-password) and `ConfirmSignUpScreen`.

# Responsibilities

- Choose the subtitle from which contacts are known:
  - Email and phone: `otpVerifySubtitleBoth`
  - Email only (login OTP and forgot-password, where the client does not have the registered mobile): `otpVerifySubtitleEmail` — copy says the code went to the registered email and mobile
  - Phone only: `otpVerifySubtitlePhone`
  - Signup confirm with no contacts resolved: `otpVerifySubtitleEmail`
- Mask the email with `maskEmail`.
- Mask a stored E.164 phone (`+…`) with `maskStoredPhoneNumber`. Mask a national number with `maskPhone` and `contactPhoneCountry`.
- Default country comes from `DEFAULT_PHONE_INPUT_COUNTRY_CODE` in the phone-input country list. Do not hardcode a dial code here.
- Auth and profile screens do not pass `displayOtp`. API OTP fields are not shown. SMS delivery stays on the backend.

# Imports

- `OtpVerificationTitle` and `useOtpVerificationTitleLabels` from `@/src/components/ui/otp-verification`
- `DEFAULT_PHONE_INPUT_COUNTRY_CODE` from `@/src/components/ui/phone-input/countries`
- `maskEmail`, `maskPhone`, `maskStoredPhoneNumber` from `../maskContact`

# Exports

- `OtpVerificationTitle`

# State Management

None. Presentational.

# API Usage

None.

# Navigation

None.

# Props / Parameters

| Prop | Purpose |
| --- | --- |
| `contactEmail` | Address to mask. Login OTP and forgot-password pass the email the user typed. |
| `contactPhone` | National digits, or E.164 from signup (`pendingSignUp.phone_number` / `pendingAgencySignUp.phone`). |
| `contactPhoneCountry` | ISO country for a national number. Defaults to `DEFAULT_PHONE_INPUT_COUNTRY_CODE`. |
| `displayOtp` | Optional code line. Auth flows leave this unset. |
| `titleKey` | `otpVerifyTitle` or `confirmSignUpTitle`. |

# Actions / Inputs

No inputs. The code fields live in `OTPVerificationForm`.

# UI Details

- Semantic text tokens via the shared OTP title (`text-text`, `text-muted`, `text-primary` only if a code line is rendered).
- Horizontal padding `px-4 sm:px-6`.
- Contact line joins masked email and mobile with ` | `.

# Flow Description

1. Parent screen passes the contacts it already stored for the flow.
2. This component masks them and picks the subtitle key.
3. The user reads where the code was sent, then enters it in `OTPVerificationForm`.

# Dependencies

- `OTPVerificationScreen`, `ConfirmSignUpScreen`
- Shared UI `src/components/ui/otp-verification/OtpVerificationTitle.tsx`

# Notes

Profile email/phone change uses `ProfileOtpVerificationTitle` and profile copy. That flow verifies the new contact and is separate from this dual-channel auth OTP.
