# registeredMobileSms.utils

### File Overview

Pure helpers that decide whether the signed-in user may request an SMS, and that perform that request only after a fresh profile load. Used by `useAddLeadMessage` before `POST /leads/{id}/messages` with `channel: "SMS"`.

The frontend check is a UX safeguard. The backend still decides whether to deliver the SMS.

### Responsibilities

- Treat `is_phone_verified === true` as the only verified status.
- Treat a missing, blank, null, or non-boolean verification value as unverified.
- Require a non-empty `phone_number` from `GET /auth/me`. Do not treat the presence of a number as verification.
- Call `send` only when both conditions pass.
- Hold a lock so a second click does not start another send.
- Never retry an SMS request, including `MOBILE_NOT_VERIFIED` and `PHONE_NOT_VERIFIED`.
- Strip OTP fields from payloads before they can be returned to the UI.
- Replace AWS, SNS, credential, and stack-trace text with a generic message.

### Imports

None. The helper stays free of the HTTP client so tests can run it directly.

### Exports

| Export | Purpose |
| --- | --- |
| `resolveRegisteredMobileSmsEligibility` | `allowed` or `unauthenticated` / `missing_phone` / `unverified` |
| `requestRegisteredMobileSms` | Load user, stop when blocked, otherwise call `send` once |
| `createSmsRequestLock` | In-flight lock |
| `isMobileNotVerifiedApiError` | Detects `MOBILE_NOT_VERIFIED` on the error or nested `detail` |
| `shouldRetrySmsSend` | Always `false` |
| `sanitizeSmsErrorMessage` | Hides infrastructure text and redacts OTP digits |
| `stripSensitiveSmsFields` | Removes `otp`, `dev_email_otp`, `dev_phone_otp`, `phone_otp`, `email_otp` |
| `createSmsApiFailure` | Builds `SmsApiFailureError` without those OTP fields |

### State Management

No store. Callers pass `loadUser` and update auth state themselves.

### API Usage

No HTTP calls. `loadUser` is supplied by the caller (`getLoggedInUser` → `GET /auth/me`). `send` is `addLeadMessage` → `POST /leads/{id}/messages`. The body stays `{ message, channel: "SMS", recipient_user_id }`. The phone number is not sent.

### Navigation

None.

### Props / Parameters

`requestRegisteredMobileSms({ loadUser, send, lock })`.

### Actions / Inputs

Not a UI module. The lead reply modal uses the eligibility result to disable **Send SMS** and to show the verify or add-mobile action.

### UI Details

None.

### Flow Description

1. `tryEnter` fails → `{ status: "busy" }` and `send` is not called.
2. `loadUser` throws → `{ status: "load_failed" }` and `send` is not called.
3. No user, no phone, or `is_phone_verified` is not `true` → `{ status: "blocked" }` and `send` is not called.
4. Otherwise `send` runs once → `{ status: "sent" }`.
5. The lock is released after the attempt.

### Dependencies

- `src/features/leads/mutations/lead.mutation.ts`
- `src/features/leads/hooks/useLeadDetailsScreen.ts`
- `src/features/profile/utils/registeredMobileSms.utils.test.ts`

### Notes

Signup, login OTP, forgot password, and profile phone-change OTP stay on their existing endpoints. Those flows send a verification code through the backend; they are not this registered-mobile SMS action. Profile phone verification already refreshes `GET /auth/me` and writes the user into the auth store, so `is_phone_verified: true` updates the SMS button without a browser reload.
