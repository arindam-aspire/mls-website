# File Overview

Next.js App Router page for route segment `[locale]/dashboard`. Client wrapper that enforces authorization before rendering the dashboard screen.

**Source:** `app/[locale]/(main)/dashboard/page.tsx`

# Responsibilities

- Next.js App Router page for route segment `[locale]/dashboard`.
- Client wrapper that calls `useAuthorize("DASHBOARD")` before rendering `DashboardScreen`.
- Shows `LoadingScreen` while `isLoadingUser` is true or `user` is absent so dashboard queries do not run before auth hydration (and so a missing-token interceptor cannot bounce the user back to `/`).

# Imports

- `import LoadingScreen from "@/src/features/loading/screens"`
- `import DashboardScreen from "@/src/features/dashboard/screens"`
- `import { useAuthorize } from "@/src/lib/auth/authorize"`
- `import { usePageTitle } from "@/src/hooks/usePageTitle"`

# Exports

- `DashboardPage`
- `default`

# State Management

Uses `useAuthorize("DASHBOARD")` — reads `user` / `isLoadingUser` from `useAuthStore` and runs redirect side effects.

# API Usage

The page itself performs no request. `DashboardScreen` delegates authenticated summary, Agency Admin agent-summary, and remaining role queries to `useDashboardScreen`.

# Navigation

- Public URL: `/en/dashboard` (and other locales).
- Unauthenticated → `router.replace("/")` (home; auth modal on landing).
- Missing `DASHBOARD` permission → `router.replace("/unauthorized")`.
- Allowed roles per `permissions.ts`: agency, agent, owner (not `registered_user`).

# Props / Parameters

- No props.

# Actions / Inputs

## Inputs

Authorization key: `"DASHBOARD"` (`PermissionKey`).

## Actions

- Redirect side effects inside `useAuthorize` (no page-level handlers).

## Validations

_No form validations._

## Show/Hide Controls

- Page returns `LoadingScreen` until `user` is available and `isLoadingUser` is false.

# UI Details

- Renders the responsive `DashboardScreen` inside `ProtectedLayout` when authorized.
- Super administrators receive KPI, growth, lead-source, activity, and health-alert widgets from `GET /dashboard/summary`.
- Loading uses a layout-matched skeleton; errors use existing API normalization/toasts and an inline localized state.
- **Theme:** semantic tokens via child screen and layout.

# Flow Description

1. Next.js resolves locale-prefixed URL.
2. `(main)/layout.tsx` applies `ProtectedLayout`.
3. `proxy.ts` may redirect to `/` if `access_token` cookie is missing.
4. `useAuthorize("DASHBOARD")` waits for `isLoadingUser`, then checks roles against `PERMISSIONS.DASHBOARD`.
5. On failure, locale-aware redirect to `/` or `/unauthorized`.
6. While `isLoadingUser || !user`, render `LoadingScreen`. On success, render `DashboardScreen`.

# Dependencies

- `src/lib/auth/authorize.ts`, `src/lib/auth/permissions.ts`
- `src/features/dashboard/screens/index.tsx`
- `app/[locale]/(main)/layout.tsx` (`ProtectedLayout`)

# Notes

- Client-only page (`"use client"`).
