# Auth feature (`src/features/auth/`)

Sign-in, sign-up, OTP, forgot/reset password, and agency flows via a **URL-driven modal** on any page inside `PublicLayout`.

## Architecture

```
authViews.ts          View constants, URL builders, resolvers
maskContact.ts        Email/phone masking for OTP UI
hooks/                Feature hooks (screens, forms, portal, shared utils)
components/           Forms + AuthModal shell
screens/              One screen per auth view (UI-only; logic in hooks/)
mutations/            React Query hooks (login, logout, OTP, …)
services/             HTTP calls → authEndpoints
store/                Zustand session + flow state
types/                Request/response TypeScript shapes
```

## Flow (high level)

1. User opens modal via `?auth=<view>` (e.g. `/en/?auth=choose-account`) or header “Sign in”.
2. `AuthModal` reads `auth` from `useSearchParams`, renders matching screen.
3. Forms call mutations → services → `authClient`.
4. Success: tokens in cookies (`tokenStore`) + user in `useAuthStore`; modal closes.
5. `AuthProvider` hydrates user on load if access token exists.

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

Query keys: `auth`, `from`, `otp-flow`, `otp-email`, `otp-phone`, `otp-phone-country` — see [authViews.md](./authViews.md).

## Subfolders

| Folder | README |
| --- | --- |
| [hooks/](./hooks/) | Screen hooks (`useSignInScreen`, …), `useChooseAccountForm`, `useAuthPortal`, `authScreen.utils` |
| [components/](./components/README.md) | Modal, forms, cards |
| [screens/](./screens/README.md) | Per-view screen wrappers |
| [mutations/](./mutations/README.md) | `useSignInWithPassword`, `useLogout`, … |
| [services/](./services/README.md) | API functions |
| [store/](./store/README.md) | `useAuthStore` |
| [types/](./types/README.md) | DTOs and form types |

## API interaction

All auth HTTP paths are in `src/apis/endpoints/authEndpoints.ts`. Services use `authClient` with `auth: true` only for `/auth/me` and `/auth/logout`.

## Navigation

- Open modal: `buildAuthModalUrl(pathname, view)` or `router.push({ pathname, query: { auth } })`.
- Close: remove `auth` query via locale-aware router.
- Logout: `useLogout` → `navigateTo(\`/${locale}\`)`.

## Dependencies

- `PublicLayout` mounts `AuthModal` inside `Suspense`.
- `AuthProvider` (root) + `tokenStore` + interceptors.
