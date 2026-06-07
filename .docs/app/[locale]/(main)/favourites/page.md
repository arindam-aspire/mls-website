# File Overview

Next.js App Router page for route segment `[locale]/favourites`. Client wrapper that enforces authorization before rendering the favourites screen.

**Source:** `app/[locale]/(main)/favourites/page.tsx`

# Responsibilities

- Next.js App Router page for route segment `[locale]/favourites`.
- Client wrapper that calls `useAuthorize("PROFILE")` before rendering `FavouritePropertyScreen`.
- Shows `LoadingScreen` when auth finished loading and `user` is still absent (redirect pending).

# Imports

- `import FavouritePropertyScreen from "@/src/features/property/screens/FavouritePropertyScreen"`
- `import LoadingScreen from "@/src/features/loading/screens"`
- `import { useAuthorize } from "@/src/lib/auth/authorize"`

# Exports

- `FavouritesPage`
- `default`

# State Management

Uses `useAuthorize("PROFILE")` — reads `user` / `isLoadingUser` from `useAuthStore` and runs redirect side effects.

# Navigation

- Public URL: `/en/favourites` (and other locales).
- Unauthenticated → `router.replace("/")`.
- Missing `PROFILE` permission → `router.replace("/unauthorized")`.
- Allowed roles per `permissions.ts`: agency, agent, owner, user (`registered_user`).

# Flow Description

1. Next.js resolves locale-prefixed URL.
2. `(main)/layout.tsx` applies `ProtectedLayout`.
3. `useAuthorize("PROFILE")` waits for `isLoadingUser`, then checks roles.
4. On success, `FavouritePropertyScreen` renders (Coming Soon placeholder).

# Dependencies

- `src/lib/auth/authorize.ts`, `src/lib/auth/permissions.ts`
- `src/features/property/screens/FavouritePropertyScreen.tsx`
- `app/[locale]/(main)/layout.tsx` (`ProtectedLayout`)
