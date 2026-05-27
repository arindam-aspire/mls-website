# File Overview

React context provider.

**Source:** `src/providers/AuthProvider.tsx` (Client Component)

# Responsibilities

- React context provider.

# Imports

- `import { tokenStore } from "@/src/apis/core/token.store"`
- `import { useAuthStore } from "@/src/features/auth/store/auth.store"`
- `import { getLoggedInUser } from "@/src/features/auth/services/auth.service"`

# Exports

- `AuthProvider`

# State Management

- **Zustand** `useAuthStore`
- **Cookies** via `tokenStore`

# API Usage

_N/A unless extended._

# Navigation

_No direct navigation._

# Props / Parameters

- See component/handler props in source (TypeScript interfaces).

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

- **Theme:** semantic tokens (`bg-page`, `bg-surface`, `text-text`, `text-muted`, `bg-primary`, `border-secondary/15`).
- **Light/dark:** via `ThemeProvider` / `html.light` | `html.dark`.
- **Radius:** `rounded-lg` controls; `rounded-xl` cards/modals/popovers; `rounded-full` avatars/pills.
- **Responsive:** mobile-first (`sm:`, `md:`, `lg:`).

# Flow Description

1. On mount, if cookie access token exists and no user, set loading.
2. `GET /auth/me` hydrates user into Zustand.
3. On failure, `clearAuth()`.

# Dependencies

- Parent feature or route that imports this file.
- See **Imports** for direct module dependencies.

# Notes

- Keep in sync when `src/providers/AuthProvider.tsx` changes.
