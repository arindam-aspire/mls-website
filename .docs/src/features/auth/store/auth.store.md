# File Overview

Zustand client store.

**Source:** `src/features/auth/store/auth.store.ts`

# Responsibilities

- Zustand client store.

# Imports

- `import { tokenStore } from "@/src/apis/core/token.store"`
- `import { LoggedInUser, SignInWithOtpResponseData, SignUpFormValues } from "../types/auth.types"`

# Exports

- `useAuthStore`

# State Management

- **Zustand** `useAuthStore`
- **Cookies** via `tokenStore`

# API Usage

_N/A unless extended._

# Navigation

_No direct navigation._

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

See source in `src/features/auth/store/auth.store.ts` for step-by-step behavior aligned with [application.md](../../application.md) (path relative may vary).

# Dependencies

- Parent feature or route that imports this file.
- See **Imports** for direct module dependencies.

# Notes

- Keep in sync when `src/features/auth/store/auth.store.ts` changes.
