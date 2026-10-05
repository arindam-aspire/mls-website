# File Overview

Shared OTP length and resend rules used by `OtpVerificationForm`.

**Source:** `src/components/ui/otp-verification/otpPolicy.ts`

# Responsibilities

- Require 6 numeric digits.
- Keep the resend cooldown at 60 seconds.
- Block resend while the cooldown is running or a resend request is in flight.

# Imports

None.

# Exports

- `OTP_LENGTH`
- `OTP_RESEND_SECONDS`
- `isCompleteOtpCode`
- `canRequestOtpResend`

# State Management

None.

# API Usage

None.

# Navigation

None.

# Props / Parameters

`isCompleteOtpCode(code)` and `canRequestOtpResend({ secondsRemaining, isResending })`.

# Actions / Inputs

None.

# UI Details

N/A. The form applies these rules to the digit inputs and resend control.

# Flow Description

The form disables Continue until `isCompleteOtpCode` is true. Resend calls `onResend` only when `canRequestOtpResend` is true, then restarts the 60-second timer and clears the digits.

# Dependencies

- `OtpVerificationForm`

# Notes

Auth phone verification and profile contact verification both use this form.
