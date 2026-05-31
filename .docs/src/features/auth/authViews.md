# File Overview

Auth modal **view identifiers** and **resolver helpers**. Constants in `AUTH_VIEW` are used as stack entries in `useAuthStore.screenStack`. This module no longer builds URLs or reads query params.

**Source:** `src/features/auth/authViews.ts`

# Responsibilities

- Define `AUTH_VIEW` string constants and `AuthView` type.
- Provide resolvers mapping account type / mode to the correct view (email, social, agency).
- Export `VALID_AUTH_VIEWS` set and `AuthOtpFlow` type.
- Helper functions for inferring context from stack or view (agency checks, sign-in after reset, etc.).

# Imports

- `SignInRole` from `./types/signIn.types`

# Exports

- `AUTH_VIEW`, `AuthView`, `VALID_AUTH_VIEWS`, `AuthOtpFlow`
- `resolveAccountTypeAuthView`, `resolveEmailSignInView`, `resolveEmailSignUpView`
- `resolveSignInRoleFromAuthContext`, `resolveSignInViewFromSignUpReturnView`
- `resolveSignInViewAfterPasswordReset`, `resolveAuthSignUpView`
- `resolveSocialSignInViewForAccountType`, `resolveSocialSignUpViewForAccountType`
- `isAuthView`, `isAgencyAuthView`, `EmailAccountType`

# State Management

_N/A — pure constants and functions._

# API Usage

_N/A._

# Navigation

Views are pushed onto `screenStack` via `useAuthStore.push(openAuth)`. No URL params.

# Props / Parameters

Resolver functions take account type, mode, or `AuthView` — see source.

# Actions / Inputs

_N/A._

# UI Details

_N/A._

# Flow Description

1. Screen hooks import `AUTH_VIEW` and resolvers.
2. User picks account type → `resolveAccountTypeAuthView(type, mode)` → `push(result)`.
3. After sign-up confirm → `resolveSignInViewFromSignUpReturnView(registrationView)` → `push(signInView)`.

# Dependencies

- All auth hooks and forms that navigate between views
- `authStack.utils.ts` for stack-based context

# Notes

- Removed: `buildAuthModalUrl`, all `AUTH_*_QUERY_KEY` constants, URL session readers.
- Agent portal is `useAuthStore.agentPortal`, not a query param.
