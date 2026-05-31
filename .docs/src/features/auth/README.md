# Auth feature (`src/features/auth/`)

Sign-in, sign-up, OTP, forgot/reset password, and agency flows via a **Zustand-driven modal** on any page inside `PublicLayout` / `LandingLayout`. Modal state uses a **screen stack** and **sessionStorage** — no auth URL query params.

## Architecture

```
authViews.ts          View constants and resolver helpers (no URL builders)
maskContact.ts        Email/phone masking for OTP UI
hooks/                Feature hooks (screens, forms, portal, stack utils)
components/           Forms + AuthModal shell
screens/              One screen per auth view (UI-only; logic in hooks/)
mutations/            React Query hooks (login, logout, OTP, …)
services/             HTTP calls → authEndpoints
store/                Zustand session + modal stack + sessionStorage sync
types/                Request/response TypeScript shapes
```

## Flow (high level)

1. User opens modal via `useAuthStore.getState().openAuth(AUTH_VIEW.chooseAccount)` (header “Sign in”, etc.).
2. `AuthModal` reads `isOpen` and top of `screenStack`, renders matching screen.
3. Screen hooks call `push` / `pop` / `closeAuth`; transient data (email, OTP session, pending sign-up) lives in store + `sessionStorage`.
4. Forms call mutations → services → `authClient`.
5. Success: tokens in cookies (`tokenStore`) + user in `useAuthStore`; modal closes via `closeAuth()`.
6. `AuthProvider` hydrates user on load if access token exists.

## Auth views

| Constant (`AUTH_VIEW`) | Screen |
| --- | --- |
| `choose-account` | `AccountChooseScreen` |
| `user-sign-in` / `owner-sign-in` | `SignInScreen` |
| `user-social-sign-in` / `owner-social-sign-in` | `SocialSignInScreen` |
| `user-sign-up` / `owner-sign-up` | `UserRegistrationScreen` |
| `user-social-sign-up` / `owner-social-sign-up` | `SocialRegistrationScreen` |
| `agency-sign-in` | `AgencySignInScreen` |
| `agency-sign-up` | `AgencyRegistrationScreen` |
| `agency-email-sign-in` | `AgencyEmailSignInScreen` |
| `forgot-password` | `ForgotPasswordScreen` |
| `reset-password` | `ResetPasswordScreen` |
| `signin-otp` | `SignInWithOTPScreen` |
| `otp-verify` | `OTPVerificationScreen` |
| `confirm-sign-up` | `ConfirmSignUpScreen` |

Modal transient fields: `agentPortal`, `otpFlow`, `pendingEmail`, `otpSession`, `otpCode`, `pendingSignUp`, `pendingAgencySignUp` — see [store/auth.store.md](./store/auth.store.md).

## Subfolders

| Folder | README |
| --- | --- |
| [auth-screen-flow.md](./auth-screen-flow.md) | **How screens switch** (store stack + sessionStorage) |
| [hooks/](./hooks/) | Screen hooks (`useSignInScreen`, …), `useAuthPortal`, `authStack.utils` |
| [components/](./components/README.md) | Modal, forms, cards |
| [screens/](./screens/README.md) | Per-view screen wrappers |
| [mutations/](./mutations/README.md) | `useSignInWithPassword`, `useLogout`, … |
| [services/](./services/README.md) | API functions |
| [store/](./store/README.md) | `useAuthStore`, `authModalStorage` |
| [types/](./types/README.md) | DTOs and form types |

## API interaction

See [services/README.md](./services/README.md) and [mutations/README.md](./mutations/README.md).

## Related global docs

- [application.md](../../../application.md) — auth section, token lifecycle, logout
- [authViews.md](./authViews.md) — view constants and resolvers
