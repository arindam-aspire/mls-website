# Auth components (`src/features/auth/components/`)

Presentational and container components for the auth modal. Screens compose these forms; `AuthModal` switches screens by URL.

## Files

| Component | Role |
| --- | --- |
| [AuthModal.md](./AuthModal.md) | Modal shell; maps `auth` query → screen |
| [AuthModalHeader.md](./AuthModalHeader.md) | Title/back for modal views |
| [ChooseAccountForm.md](./ChooseAccountForm.md) | Account type selection |
| [AccountTypeCard.md](./AccountTypeCard.md) | Card for user/owner/agency |
| [SignInForm.md](./SignInForm.md) | Email/password sign-in |
| [SignUpForm.md](./SignUpForm.md) | Registration fields |
| [SignInWithOTPForm.md](./SignInWithOTPForm.md) | Request OTP |
| [OTPVerificationForm.md](./OTPVerificationForm.md) | Enter OTP code |
| [ForgotPasswordForm.md](./ForgotPasswordForm.md) | Forgot password |
| [ResetPasswordForm.md](./ResetPasswordForm.md) | New password |
| [SocialAuthForm.md](./SocialAuthForm.md) | Social provider buttons (UI) |
| [AgencyAuthForm.md](./AgencyAuthForm.md) | Agency sign-in options |
| [AgencySignUpForm.md](./AgencySignUpForm.md) | Agency registration |

## Conventions

- Client components (`"use client"`).
- Forms use `useForm` from `@/src/hooks/useForm` where applicable.
- Controls: `rounded-lg`; modal panel: `rounded-xl`; semantic theme tokens.
- i18n: `useTranslations("auth")`.

## Flow

`AuthModal` → Screen → Form → mutation hook → `auth.service` → close modal or navigate to next auth view.
