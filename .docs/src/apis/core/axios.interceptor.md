# File Overview

Axios infrastructure (tokens, interceptors, errors).

**Source:** `src/apis/core/axios.interceptor.ts`

# Responsibilities

- Axios infrastructure (tokens, interceptors, errors).

# Imports

- `import { tokenStore } from './token.store'`
- `import { refreshToken } from './token.refresh'`
- `import { navigateTo } from '@/src/utils/navigation.utils'`

# Exports

- `applyInterceptors`

# State Management

- **Cookies** via `tokenStore`

# API Usage

- Axios interceptors / refresh against backend auth endpoints.
- On failure may call `navigateTo('/')`.

# Navigation

- Imperative **`navigateTo`** from `navigation.utils` (non-locale paths; used after logout).

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

See source in `src/apis/core/axios.interceptor.ts` for step-by-step behavior aligned with [application.md](../../application.md) (path relative may vary).

# Dependencies

- Parent feature or route that imports this file.
- See **Imports** for direct module dependencies.

# Notes

- Keep in sync when `src/apis/core/axios.interceptor.ts` changes.
