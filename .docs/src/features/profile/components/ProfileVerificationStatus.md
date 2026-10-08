# File Overview

Verification badge and optional verify action for the signed-in user's email or phone on My Profile.

**Source:** `src/features/profile/components/ProfileVerificationStatus.tsx`

# Responsibilities

- Show **Verified** with a success check, or **Not verified** with a danger mark.
- When the contact is not verified and the parent passes `verifyLabel` and `onVerify`, show an outline **Verify Email** or **Verify Phone** button beside the badge.
- Hide the button when `isVerified` is true.
- While `isVerifying` is true, the button shows the loading label and is disabled. `verifyDisabled` also disables it so the other channel cannot start a second OTP request.

# Imports

- `Button` from `@/src/components/ui`
- `CheckCircle` / `XCircle` from `lucide-react`

# Exports

- `ProfileVerificationStatus`
- `ProfileVerificationStatusProps`

# State Management

Presentational. Verification flags come from `GET /auth/me` via the parent.

# API Usage

None. The parent sends email OTP with `POST /auth/resend-confirmation` (`channel: "email"`) and phone OTP with `POST /auth/send-phone-otp`.

# Navigation

None.

# Props / Parameters

| Prop | Role |
| --- | --- |
| `isVerified` | Backend flag for this channel |
| `verifiedLabel` / `notVerifiedLabel` | Badge copy |
| `verifyLabel` / `verifyLoadingLabel` | Button copy |
| `onVerify` | Starts the OTP request for this channel |
| `isVerifying` | Spinner on this button |
| `verifyDisabled` | Disables the button while any channel is sending |

# Actions / Inputs

| Action | Result |
| --- | --- |
| Click verify | Calls `onVerify`. No email or phone is typed here. |

# UI Details

- Badge: `rounded-lg`, `bg-success/15 text-success` or `bg-danger/10 text-danger`.
- Button: outline primary, `rounded-lg`, `size="sm"`, `min-h-11` so the tap target stays at least 44px.
- Wrapper: `flex flex-wrap items-center gap-2` so the button moves to the next line on narrow screens.
- Light and dark use the same semantic tokens.

# Flow Description

1. Parent renders this under the masked email or phone.
2. Verified contacts show only the badge.
3. Unverified contacts show the badge and the verify button.
4. A click asks the parent hook to send an OTP to the account contact already stored from `/auth/me`.

# Dependencies

- [MyProfileCard.md](./MyProfileCard.md)
- [AgencyProfileCard.md](./AgencyProfileCard.md)
- [useVerifyContactModal.md](../hooks/useVerifyContactModal.md)

# Notes

The component does not decide which API to call. Email and phone stay independent because the parent passes a channel-specific `onVerify`.
