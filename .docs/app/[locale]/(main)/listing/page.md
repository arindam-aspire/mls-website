# File Overview

Next.js App Router page for route segment `[locale]/listing`. Client wrapper that enforces authorization before rendering the my-listings screen.

**Source:** `app/[locale]/(main)/listing/page.tsx`

# Responsibilities

- Next.js App Router page for route segment `[locale]/listing`.
- Client wrapper that calls `useAuthorize("MY_LISTINGS")` before rendering `ListingPropertyScreen`.
- Shows `LoadingScreen` when auth finished loading and `user` is still absent (redirect pending).

# Imports

- `import ListingPropertyScreen from "@/src/features/property/screens/ListingPropertyScreen"`
- `import LoadingScreen from "@/src/features/loading/screens"`
- `import { useAuthorize } from "@/src/lib/auth/authorize"`

# Exports

- `ListingPage`
- `default`

# State Management

Uses `useAuthorize("MY_LISTINGS")` — reads `user` / `isLoadingUser` from `useAuthStore` and runs redirect side effects.

# Navigation

- Public URL: `/en/listing` (and other locales).
- Unauthenticated → `router.replace("/")`.
- Missing `MY_LISTINGS` permission → `router.replace("/unauthorized")`.
- Allowed roles per `permissions.ts`: owner only.

# Flow Description

1. Next.js resolves locale-prefixed URL.
2. `(main)/layout.tsx` applies `ProtectedLayout`.
3. `useAuthorize("MY_LISTINGS")` waits for `isLoadingUser`, then checks roles.
4. On success, `ListingPropertyScreen` renders (Coming Soon placeholder).

# Dependencies

- `src/lib/auth/authorize.ts`, `src/lib/auth/permissions.ts`
- `src/features/property/screens/ListingPropertyScreen.tsx`
- `app/[locale]/(main)/layout.tsx` (`ProtectedLayout`)

# Notes

- Keep in sync when `app/[locale]/(main)/listing/page.tsx` changes.
- `proxy.ts` requires an `access_token` cookie for `/listing`.
