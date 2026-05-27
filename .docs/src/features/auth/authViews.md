# File Overview

Project source module.

**Source:** `src/features/auth/authViews.ts`

# Responsibilities

- Project source module.

# Imports

_No notable imports._

# Exports

- `buildAuthModalUrl`
- `resolveAccountTypeAuthView`
- `resolveEmailSignInView`
- `resolveEmailSignUpView`
- `isAgencyAuthView`
- `resolveAuthSignUpView`
- `isAuthView`
- `AUTH_QUERY_KEY`
- `AUTH_RETURN_VIEW_QUERY_KEY`
- `AUTH_OTP_FLOW_QUERY_KEY`
- `AUTH_OTP_EMAIL_QUERY_KEY`
- `AUTH_OTP_PHONE_QUERY_KEY`
- `AUTH_OTP_PHONE_COUNTRY_QUERY_KEY`
- `CHOOSE_ACCOUNT_QUERY_KEY`
- `AUTH_VIEW`
- `VALID_AUTH_VIEWS`
- `AuthOtpFlow`
- `AuthModalUrlOptions`
- `AuthView`
- `EmailAccountType`

# State Management

_N/A — no local/global state in this module._

# API Usage

_N/A unless extended._

# Navigation

- Auth modal: query `?auth=<view>` on current pathname (see `authViews.ts`).

# Props / Parameters

_N/A — non-component module._

# Actions / Inputs

## Inputs

_No explicit inputs detected._

## Actions

_No explicit actions detected._

## Validations

_No explicit validations detected._

## Show/Hide Controls

_No explicit show/hide controls detected._

# UI Details

_N/A._

# Flow Description

See source in `src/features/auth/authViews.ts` for step-by-step behavior aligned with [application.md](../../application.md) (path relative may vary).

# Dependencies

- Parent feature or route that imports this file.
- See **Imports** for direct module dependencies.

# Notes

- Keep in sync when `src/features/auth/authViews.ts` changes.
