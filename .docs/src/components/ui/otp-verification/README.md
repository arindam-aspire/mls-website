# OTP verification (`src/components/ui/otp-verification/`)

Shared 6-digit OTP UI for auth and profile flows.

## Exports

| Export | Role |
| --- | --- |
| `OtpVerificationForm` | Digit inputs, resend timer, submit |
| `OtpVerificationTitle` | Heading, subtitle, and masked contact line. Callers do not pass an API OTP. |
| `otpPolicy` | `OTP_LENGTH` (6), `OTP_RESEND_SECONDS` (60), completeness and resend guards |
| `useOtpVerificationFormLabels` | Resolves `auth` or `profile` i18n keys for the form |
| `useOtpVerificationTitleLabels` | Resolves title/subtitle/sent-code labels |

## Usage

Pass `labels` from hooks (no hardcoded copy in the UI module). Feature wrappers:

- `src/features/auth/components/OTPVerificationForm.tsx`
- `src/features/auth/components/OtpVerificationTitle.tsx`
- `src/features/profile/components/ProfileOtpVerificationForm.tsx`
- `src/features/profile/components/ProfileOtpVerificationTitle.tsx`

Contact masking stays in feature wrappers (`maskEmail` / `maskPhone`).
