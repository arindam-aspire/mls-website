# File Overview

Next.js App Router page for route segment `[locale]/manage-listings`. Client wrapper that enforces authorization before rendering the manage listings screen.

**Source:** `app/[locale]/(main)/manage-listings/page.tsx`

# Responsibilities

- Next.js App Router page for route segment `[locale]/manage-listings`.
- Client wrapper that calls `useAuthorize("MANAGE_LISTINGS")` before rendering `ManageListingsScreen`.
- Shows `LoadingScreen` when auth finished loading and `user` is still absent (redirect pending).

# Imports

- `import ManageListingsScreen from "@/src/features/property/screens/ManageListingsScreen"`
- `import LoadingScreen from "@/src/features/loading/screens"`
- `import { useAuthorize } from "@/src/lib/auth/authorize"`

# Exports

- `ManageListingsPage`
- `default`

# State Management

Uses `useAuthorize("MANAGE_LISTINGS")` — reads `user` / `isLoadingUser` from `useAuthStore` and runs redirect side effects.

# Navigation

- Public URL: `/en/manage-listings` (and other locales).
- Unauthenticated → `router.replace("/")`.
- Missing `MANAGE_LISTINGS` permission → `router.replace("/unauthorized")`.
- Allowed roles per `permissions.ts`: agency, agent (`admin` API role; legacy `agency` name handled in menu helpers).

# Flow Description

1. Next.js resolves locale-prefixed URL.
2. `(main)/layout.tsx` applies `ProtectedLayout`.
3. `useAuthorize("MANAGE_LISTINGS")` waits for `isLoadingUser`, then checks roles.
4. On success, `ManageListingsScreen` renders (Coming Soon placeholder).

# Dependencies

- `src/lib/auth/authorize.ts`, `src/lib/auth/permissions.ts`
- `src/features/property/screens/ManageListingsScreen.tsx`
- `app/[locale]/(main)/layout.tsx` (`ProtectedLayout`)

# Notes

- Keep in sync when `app/[locale]/(main)/manage-listings/page.tsx` changes.
- `proxy.ts` requires an `access_token` cookie for `/manage-listings`.
- Sidebar link: `protectedSidebarNav.config.ts` → `manageListings` → `/manage-listings`.
