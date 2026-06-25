# File Overview

Next.js App Router page for route segment `[locale]/my-profile`. Client wrapper that enforces authorization before rendering the profile screen.

**Source:** `app/[locale]/(main)/(profile)/my-profile/page.tsx`

# Responsibilities

- Next.js App Router page for route segment `[locale]/my-profile`.
- Client wrapper that calls `useAuthorize("PROFILE")` before rendering `ProfileScreen`.
- Renders `ProfileScreen` while `isLoadingUser` so the profile skeleton can show during hydration.
- Returns `null` only when loading finished and `user` is still absent (redirect pending).

# Imports

- `import ProfileScreen from "@/src/features/profile/screens/ProfileScreen"`
- `import { useAuthorize } from "@/src/lib/auth/authorize"`

# Exports

- `MyProfilePage`
- `default`

# State Management

Uses `useAuthorize("PROFILE")` — reads `user` / `isLoadingUser` from `useAuthStore` and runs redirect side effects.

# API Usage

_N/A unless extended._

# Navigation

- Public URL: `/en/my-profile` (and other locales).
- Unauthenticated → `router.replace("/")`.
- Missing `PROFILE` permission → `router.replace("/unauthorized")`.
- Allowed roles per `permissions.ts`: agency, agent, owner, user (`registered_user`).

# Props / Parameters

- No props.

# Actions / Inputs

## Inputs

Authorization key: `"PROFILE"` (`PermissionKey`).

## Actions

- Redirect side effects inside `useAuthorize`.

## Validations

_No form validations._

## Show/Hide Controls

- Page renders `ProfileScreen` during `isLoadingUser`; screen shows skeleton until `user` is set.
- Page returns `null` when `!isLoadingUser && !user`.

# UI Details

- Renders `ProfileScreen` (toolbar with change password / edit) inside `ProtectedLayout` when authorized.

# Flow Description

1. Next.js resolves locale-prefixed URL.
2. `(main)/layout.tsx` applies `ProtectedLayout`.
3. `proxy.ts` may redirect to `/` if `access_token` cookie is missing.
4. `useAuthorize("PROFILE")` waits for `isLoadingUser`, then checks roles against `PERMISSIONS.PROFILE`.
5. On failure, locale-aware redirect to `/` or `/unauthorized`.
6. While `isLoadingUser`, render `ProfileScreen` (skeleton inside screen).
7. On success with `user`, `ProfileScreen` shows toolbar and card.

# Dependencies

- `src/lib/auth/authorize.ts`, `src/lib/auth/permissions.ts`
- `src/features/profile/screens/ProfileScreen.tsx`
- `app/[locale]/(main)/layout.tsx` (`ProtectedLayout`)

# Notes

- Client-only page (`"use client"`).
- Lives under route group `(profile)`; URL path is unchanged (`/my-profile`).
