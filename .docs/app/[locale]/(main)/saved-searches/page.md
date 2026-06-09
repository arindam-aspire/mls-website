# File Overview

Next.js App Router page for route segment `[locale]/saved-searches`. Client wrapper that enforces authorization before rendering the saved searches screen.

**Source:** `app/[locale]/(main)/saved-searches/page.tsx`

# Responsibilities

- Next.js App Router page for route segment `[locale]/saved-searches`.
- Client wrapper that calls `useAuthorize("SAVED_SEARCHES")` before rendering `SavedSearchScreen`.
- Shows `LoadingScreen` when auth finished loading and `user` is still absent (redirect pending).

# Imports

- `import SavedSearchScreen from "@/src/features/saved-searches/screens/SavedSearchScreen"`
- `import LoadingScreen from "@/src/features/loading/screens"`
- `import { useAuthorize } from "@/src/lib/auth/authorize"`

# Exports

- `SavedSearchesPage`
- `default`

# State Management

Uses `useAuthorize("SAVED_SEARCHES")` — reads `user` / `isLoadingUser` from `useAuthStore` and runs redirect side effects.

# Navigation

- Public URL: `/en/saved-searches` (and other locales).
- Unauthenticated → `router.replace("/")`.
- Missing `SAVED_SEARCHES` permission → `router.replace("/unauthorized")`.
- Allowed roles per `permissions.ts`: agency, agent, owner, user (`registered_user`).

# Flow Description

1. Next.js resolves locale-prefixed URL.
2. `(main)/layout.tsx` applies `ProtectedLayout`.
3. `proxy.ts` may redirect to `/` if `access_token` cookie is missing.
4. `useAuthorize("SAVED_SEARCHES")` waits for `isLoadingUser`, then checks roles.
5. On success, `SavedSearchScreen` renders the saved search list and modals.

# Dependencies

- `src/lib/auth/authorize.ts`, `src/lib/auth/permissions.ts`
- `src/features/saved-searches/screens/SavedSearchScreen.tsx`
- `app/[locale]/(main)/layout.tsx` (`ProtectedLayout`)
