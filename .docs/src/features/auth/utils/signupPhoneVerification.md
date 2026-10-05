# File Overview

Pure rules for when signup should open phone verification and how a phone OTP request is guarded.

**Source:** `src/features/auth/utils/signupPhoneVerification.ts`

# Responsibilities

- Keep email confirmation first. A stored phone does not skip `POST /auth/confirm-signup`.
- Open phone verification only after email confirmation when a number exists and `is_phone_verified` is not boolean `true`.
- Treat `false`, `null`, missing, and non-boolean values as unverified.
- Prefer the account `phone_number`, then the signup number.
- Refuse the send when the number is blank, and refuse a second send while one is in flight.

# Imports

None. The verified check matches `isRegisteredMobileVerified` and is asserted in the unit test.

# Exports

- `hasSignupPhoneNumber`
- `resolveSignupVerificationStep`
- `shouldOpenSignupPhoneVerification`
- `resolveRegisteredPhoneForVerification`
- `canFinishAfterPhoneVerification`
- `requestSignupPhoneOtp`

# State Management

None.

# API Usage

None. Callers pass the existing profile request function into `requestSignupPhoneOtp`.

# Navigation

`email-confirmation`, `phone-verification`, or `complete`.

# Props / Parameters

See the function arguments in the source. Phone values are strings already formatted by the signup phone input.

# Actions / Inputs

None.

# UI Details

N/A.

# Flow Description

1. Signup success still opens email confirmation.
2. After that confirmation, a non-empty phone that is not explicitly verified selects phone verification.
3. No phone selects the existing sign-in completion.

# Dependencies

- `useConfirmSignUpScreen` sets the pending flag.
- `useVerifyPhoneScreen` sends through `requestSignupPhoneOtp`.

# Notes

Tests live in `signupPhoneVerification.test.ts`.
