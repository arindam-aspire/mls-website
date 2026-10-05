# signInOtpUsername

### File Overview

Builds the `username` sent to `POST /auth/login/otp/request` and `POST /auth/login/otp/verify`. Email stays as typed. A phone sign-in becomes an E.164 value from the selected country dial code and national number.

### Responsibilities

- Format a phone sign-in contact without hardcoding a number or dial code.
- Prefer a stored phone over email when both could be present, so verify and resend use the same destination as Send OTP.

### Imports

- `getPhoneInputCountryByCode` from the shared phone input country list
- `formatPhoneNumberE164` from profile phone formatting

### Exports

- `toSignInOtpPhoneUsername`
- `resolveSignInOtpUsername`

### State Management

None.

### API Usage

Callers pass the returned string as `username`. This file does not call the API.

### Navigation

None.

### Props / Parameters

`resolveSignInOtpUsername({ email, phoneNationalNumber, phoneCountryCode })`.

### Actions / Inputs

Used when the sign-in OTP form submits the Phone Number tab, and when the OTP screen verifies or resends.

### UI Details

None.

### Flow Description

1. Phone tab: country ISO plus national digits become `+<dialCode><digits>`.
2. Email tab: trimmed email is returned when no phone is stored.
3. Verify and resend read the same store fields and call this helper again.

### Dependencies

- `useSignInWithOTPScreen`
- `useOTPVerificationScreen`

### Notes

The backend login OTP contract accepts one `username` string. SMS delivery stays on the backend.
