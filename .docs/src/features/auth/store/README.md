# Auth store (`src/features/auth/store/`)

Global client session state via **Zustand**, synchronized with **js-cookie** token storage.

## Files

| File | Export |
| --- | --- |
| [auth.store.md](./auth.store.md) | `useAuthStore` |

## State

| Field | Purpose |
| --- | --- |
| `user` | `LoggedInUser` from `/auth/me` |
| `access_token`, `refresh_token` | In-memory mirror of cookies |
| `isLoadingUser` | Profile hydration loading |
| `pendingSignUp` | Multi-step sign-up |
| `pendingOtpSession` | OTP session from login OTP request |
| `forgotPasswordOtp` | Forgot-password flow |

## Actions

`setAuth`, `setUser`, `clearAuth`, `setPendingOtpSession`, `clearPendingOtpSession`, `setPendingSignUp`, `clearPendingSignUp`, `setForgotPasswordOtp`, `clearForgotPasswordOtp`.

`setAuth` / `clearAuth` sync `tokenStore` cookies.

## Consumers

- `AuthProvider` — hydrate user on mount
- Auth mutations — login/logout
- `ProfilePopover`, header — read `user`
