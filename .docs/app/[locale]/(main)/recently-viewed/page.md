# File Overview

Next.js App Router page for route segment `[locale]/recently-viewed`. Client wrapper that enforces authorization before rendering the recently viewed screen.

**Source:** `app/[locale]/(main)/recently-viewed/page.tsx`

# Responsibilities

- Next.js App Router page under `(main)` → `ProtectedLayout`.
- Client wrapper that calls `useAuthorize("RECENTLY_VIEWED")` before rendering `RecentlyViewedScreen`.
- Shows `LoadingScreen` when auth finished loading and `user` is still absent (redirect pending).

# Imports

- `import RecentlyViewedScreen from "@/src/features/property/screens/RecentlyViewedScreen"`
- `import LoadingScreen from "@/src/features/loading/screens"`
- `import { useAuthorize } from "@/src/lib/auth/authorize"`

# Exports

- `RecentlyViewedPage`
- `default`

# State Management

Uses `useAuthorize("RECENTLY_VIEWED")` — reads `user` / `isLoadingUser` from `useAuthStore` and runs redirect side effects.

# Navigation

- Public URL: `/en/recently-viewed` (and other locales).
- Unauthenticated → `router.replace("/")`.
- Missing `RECENTLY_VIEWED` permission → `router.replace("/unauthorized")`.
- Allowed roles per `permissions.ts`: `owner`, `registered_user` (user).

# Flow Description

1. Next.js resolves locale-prefixed URL.
2. `(main)/layout.tsx` applies `ProtectedLayout`.
3. `proxy.ts` may redirect to `/` if `access_token` cookie is missing.
4. `useAuthorize("RECENTLY_VIEWED")` waits for `isLoadingUser`, then checks roles.
5. On success, `RecentlyViewedScreen` renders.

# Dependencies

- `src/lib/auth/authorize.ts`, `src/lib/auth/permissions.ts`
- `src/features/property/screens/RecentlyViewedScreen.tsx`
- `app/[locale]/(main)/layout.tsx` (`ProtectedLayout`)

# Notes

- Moved from `(property)` to `(main)` so the route uses protected chrome and role guard aligned with profile menu visibility.
