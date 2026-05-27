# Auth screens (`src/features/auth/screens/`)

One screen component per **auth view** (`AUTH_VIEW` in `authViews.ts`). Rendered inside `AuthModal` based on the `auth` query parameter.

## Screen map

| Screen | `AUTH_VIEW` value(s) |
| --- | --- |
| [AccountChooseScreen.md](./AccountChooseScreen.md) | `choose-account` |
| [SocialSignInScreen.md](./SocialSignInScreen.md) | `user-social-sign-in`, `owner-social-sign-in` |
| [SocialRegistrationScreen.md](./SocialRegistrationScreen.md) | `user-social-sign-up`, `owner-social-sign-up` |
| [SignInScreen.md](./SignInScreen.md) | `user-sign-in`, `owner-sign-in` |
| [UserRegistrationScreen.md](./UserRegistrationScreen.md) | `user-sign-up`, `owner-sign-up` |
| [AgencySignInScreen.md](./AgencySignInScreen.md) | `agency-sign-in` |
| [AgencyRegistrationScreen.md](./AgencyRegistrationScreen.md) | `agency-sign-up` |
| [AgencyEmailSignInScreen.md](./AgencyEmailSignInScreen.md) | `agency-email-sign-in` |
| [ForgotPasswordScreen.md](./ForgotPasswordScreen.md) | `forgot-password` |
| [ResetPasswordScreen.md](./ResetPasswordScreen.md) | `reset-password` |
| [SignInWithOTPScreen.md](./SignInWithOTPScreen.md) | `signin-otp` |
| [OTPVerificationScreen.md](./OTPVerificationScreen.md) | `otp-verify` |
| [ConfirmSignUpScreen.md](./ConfirmSignUpScreen.md) | `confirm-sign-up` |

## Responsibilities

- Layout auth sub-flow UI and wire forms to mutations.
- Navigate between views using `buildAuthModalUrl` / router query updates.
- Pass account type (`user` | `owner` | `agency`) where needed.

## Not routed directly

These are **not** App Router pages. They only appear inside the modal on existing routes (e.g. `/en/`).
