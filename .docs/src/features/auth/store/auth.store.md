# File Overview

Zustand client store for **logged-in session** and **auth modal** state (screen stack, transient flow data). Modal fields sync to `sessionStorage` via `authModalStorage.ts`.

**Source:** `src/features/auth/store/auth.store.ts`

# Responsibilities

- Hold authenticated user profile and token mirrors (`user`, `access_token`, `refresh_token`).
- Own auth modal visibility (`isOpen`), navigation (`screenStack`), and flow context (`agentPortal`, `otpFlow`).
- Persist modal transient data to `sessionStorage` on every setter (`pendingEmail`, `otpSession`, pending sign-up payloads, etc.).
- Coordinate with `tokenStore` for cookie-backed tokens on login/logout.

# Imports

- `tokenStore` from `@/src/apis/core/token.store`
- `AuthOtpFlow`, `AuthView` from `../authViews`
- `AgencySignUpSubmitValues`, `LoggedInUser`, `SignUpFormValues` from `../types/auth.types`
- `readAuthModalSession`, `writeAuthModalSession`, `clearAuthModalSession`, `defaultAuthModalPersistedState` from `./authModalStorage`

# Exports

- `useAuthStore`

# State Management

- **Zustand** `useAuthStore`
- **sessionStorage** key `auth_transient` (modal fields only)
- **Cookies** via `tokenStore` (access/refresh tokens)

## Modal state (persisted)

| Field | Type | Purpose |
| --- | --- | --- |
| `isOpen` | `boolean` | Modal visible |
| `screenStack` | `AuthView[]` | Navigation history |
| `agentPortal` | `boolean` | Agent portal on agency sign-in |
| `otpFlow` | `AuthOtpFlow \| null` | `signin` \| `forgot` \| `signup` |
| `pendingEmail` | `string \| null` | OTP / forgot contact |
| `pendingPhone` | `string \| null` | OTP phone |
| `pendingPhoneCountry` | `string \| null` | Phone country code |
| `otpSession` | `string \| null` | OTP session id |
| `otpCode` | `string \| null` | Verified OTP code (reset password) |
| `pendingSignUp` | `SignUpFormValues \| null` | User/owner registration draft |
| `pendingAgencySignUp` | `AgencySignUpSubmitValues \| null` | Agency registration draft |

## Session state (not in sessionStorage)

| Field | Purpose |
| --- | --- |
| `user` | Logged-in profile |
| `access_token`, `refresh_token` | In-memory token mirror |
| `isLoadingUser` | `/auth/me` loading |

# API Usage

_N/A — store only; mutations update store via setters._

# Navigation

| Action | Method | Behavior |
| --- | --- | --- |
| Open modal | `openAuth(screen)` | Fresh stack `[screen]`, writes session |
| Close modal | `closeAuth()` | Clears sessionStorage + modal state |
| Back | `pop()` | Pops stack if length > 1, persists |

## Modal navigation

- `openAuth(screen: AuthView)`
- `closeAuth()`
- `navigate(screen: AuthView)` — uses `SCREEN_NAV_TYPE` from `auth.navigation.ts`
- `pop()`

## Transient setters (each writes sessionStorage)

- `setAgentPortal`, `setOtpFlow`
- `setPendingEmail`, `setPendingPhone`, `setPendingPhoneCountry`
- `setOtpSession`, `setOtpCode`, `clearOtpSession`
- `setPendingSignUp`, `setPendingAgencySignUp`
- `clearPendingSignUp`, `clearPendingAgencySignUp`

## Session lifecycle

- `setAuth(access, refresh)` — tokens to cookies + store
- `setUser`, `setIsLoadingUser`
- `clearAuth()` — logout; clears user/tokens only (not modal)

# UI Details

_N/A._

# Flow Description

1. Module init: modal fields use `defaultAuthModalPersistedState` (closed) so SSR and first client paint match.
2. `AuthModal` mount `useEffect` restores from `sessionStorage` when `isOpen` was persisted (refresh mid-flow).
3. `openAuth` resets modal session and sets `isOpen: true`.
3. Screen hooks call `navigate`/`pop`; flow-owned data is cleared when `navigate` detects a flow change.
4. `closeAuth` clears storage — used on modal dismiss and sign-in success.
5. `clearAuth` is separate — used on logout; does not touch modal stack.

# Dependencies

- `authModalStorage.ts` — read/write/clear sessionStorage
- Screen hooks, `AuthModal`, header triggers, mutations (`setOtpSession`, etc.)

# Notes

- Do not call `writeAuthModalSession` from components/hooks — use store setters only.
- Never persist passwords or tokens in `auth_transient`.
- Distinguish `closeAuth()` (modal) from `clearAuth()` (logged-in session).
