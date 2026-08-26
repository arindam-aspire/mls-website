# File Overview

React context provider.

**Source:** `src/providers/AuthProvider.tsx` (Client Component)

# Responsibilities

- React context provider.

# Imports

- `import { tokenStore } from "@/src/apis/core/token.store"`
- `import { useAuthStore } from "@/src/features/auth/store/auth.store"`
- `import { getLoggedInUser } from "@/src/features/auth/services/auth.service"`
- `import { getAccessTokenRoleName } from "@/src/features/auth/utils/getAccessTokenRoleName"`

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

1. On mount (`useLayoutEffect`, before child effects), read `access_token` cookie.
2. No token → `setLoggedInUserRole(null)`, `setIsLoadingUser(false)`.
3. Token present → decode JWT payload (`role.role_name`) via `getAccessTokenRoleName` → `setLoggedInUserRole` (enables role-based UI such as protected sidebar before `/auth/me`).
4. If no `user` yet, set `isLoadingUser` true and `GET /auth/me` hydrates profile into Zustand (`getLoggedInUser` maps `profile_picture_url` to a loadable src; `setUser` also syncs `loggedInUserRole`).
5. On failure, `clearNotificationQueryCache(queryClient)` then `clearAuth()`.
6. Guards like `useAuthorize` must not redirect while step 3–4 is in progress or while `hasAuthCredentials()` is true without a user.

**Note:** Edge `proxy.ts` only checks cookie presence; it cannot update Zustand. Role hydration is client-only here.

# Dependencies

- Parent feature or route that imports this file.
- See **Imports** for direct module dependencies.

# Notes

- Keep in sync when `src/providers/AuthProvider.tsx` changes.
