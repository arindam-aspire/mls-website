# File Overview

Maps each `AUTH_VIEW` screen to a navigation type used by `useAuthStore.navigate()`.

**Source:** `src/features/auth/store/auth.navigation.ts`

# Responsibilities

- Define `NavType`: `root` | `sibling` | `child`
- Export `SCREEN_NAV_TYPE` — per-screen navigation classification
- Export `resolveScreenNavType(screen)` — lookup with `child` fallback

# Navigation types

| Type | Stack behavior |
| --- | --- |
| `root` | Reset stack to `[screen]` |
| `sibling` | Replace top entry (same hierarchy level); append if top is `choose-account` |
| `child` | Push forward; if screen already in stack, slice back to it (no duplicate) |

# Screen map

| Type | Screens |
| --- | --- |
| `root` | `choose-account` |
| `sibling` | user/owner social sign-in & sign-up, agency sign-in & sign-up |
| `child` | email sign-in/sign-up, agency email, OTP, forgot/reset, confirm sign-up |

# Dependencies

- `auth.store.ts` — `navigate()` reads `SCREEN_NAV_TYPE`
- All hooks/forms that call `navigate(AUTH_VIEW.*)`

# Notes

- Do not call `push()` — removed; use `navigate()` only.
- `pop()` unchanged — back button only; no flow cleanup (stays in same flow).
- `navigate()` clears flow-owned transient data when leaving a flow (see `FLOW_OWNED_DATA`).
- `otp-verify` and `confirm-sign-up` are flow-neutral — they inherit the active flow from the stack.
