# File Overview

sessionStorage helpers for auth modal transient state. Single key `auth_transient` holds a JSON snapshot of modal fields (stack, OTP context, pending sign-up, etc.).

**Source:** `src/features/auth/store/authModalStorage.ts`

# Responsibilities

- Define `AuthModalPersistedState` shape and defaults.
- `readAuthModalSession()` — parse sessionStorage (SSR-safe).
- `writeAuthModalSession(partial)` — merge and persist.
- `clearAuthModalSession()` — remove key on modal close.

# Imports

- `AuthOtpFlow`, `AuthView` from `../authViews`
- `AgencySignUpSubmitValues`, `SignUpFormValues` from `../types/auth.types`

# Exports

- `AUTH_MODAL_SESSION_KEY` — `"auth_transient"`
- `AuthModalPersistedState`, `defaultAuthModalPersistedState`
- `readAuthModalSession`, `writeAuthModalSession`, `clearAuthModalSession`

# State Management

Persists modal slice consumed by `useAuthStore`. Not used for access/refresh tokens or user profile.

# API Usage

_N/A._

# Navigation

_N/A._

# Props / Parameters

_N/A — utility module._

# Actions / Inputs

## Functions

| Function | When called |
| --- | --- |
| `readAuthModalSession` | Store init, `AuthModal` mount hydration |
| `writeAuthModalSession` | Inside `auth.store.ts` setters only |
| `clearAuthModalSession` | Inside `closeAuth()` only |

# UI Details

_N/A._

# Flow Description

1. User navigates auth flow → store setters update Zustand + call `writeAuthModalSession`.
2. Page refresh → `readAuthModalSession` restores `isOpen`, `screenStack`, and transient fields.
3. Modal close → `clearAuthModalSession` wipes key.

# Dependencies

- `auth.store.ts` — sole writer/reader in app code
- `AuthModal.tsx` — mount-time re-hydration

# Notes

- Never store passwords, tokens, or full user objects.
- `typeof window === "undefined"` guards for SSR.
