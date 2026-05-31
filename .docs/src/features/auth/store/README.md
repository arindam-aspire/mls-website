# Auth store (`src/features/auth/store/`)

Global client state via **Zustand**: logged-in session + auth modal (stack, transient flow data). Modal fields sync to **sessionStorage** (`auth_transient`).

## Files

| File | Export |
| --- | --- |
| [auth.store.md](./auth.store.md) | `useAuthStore` |
| [authModalStorage.md](./authModalStorage.md) | sessionStorage helpers |
| [auth.navigation.md](./auth.navigation.md) | `SCREEN_NAV_TYPE` — root / sibling / child |

## Session state

| Field | Purpose |
| --- | --- |
| `user` | `LoggedInUser` from `/auth/me` |
| `access_token`, `refresh_token` | In-memory mirror of cookies |
| `isLoadingUser` | Profile hydration loading |

## Modal state (persisted to sessionStorage)

| Field | Purpose |
| --- | --- |
| `isOpen`, `screenStack` | Modal visibility and navigation |
| `agentPortal`, `otpFlow` | Agent portal; OTP flow kind |
| `pendingEmail`, `pendingPhone`, `pendingPhoneCountry` | OTP contact |
| `otpSession`, `otpCode` | OTP handoff |
| `pendingSignUp`, `pendingAgencySignUp` | Registration confirm step |

## Actions

**Session:** `setAuth`, `setUser`, `clearAuth` (sync `tokenStore` cookies).

**Modal:** `openAuth`, `closeAuth`, `navigate`, `pop`, transient setters (`setPendingEmail`, `setOtpSession`, …).

## Consumers

- `AuthProvider` — hydrate user on mount
- `AuthModal` — render active screen
- Auth screen hooks — navigation and flow state
- Auth mutations — OTP session setters
- Headers — `openAuth(AUTH_VIEW.chooseAccount)`
- `ProfilePopover`, header — read `user`
