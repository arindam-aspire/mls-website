# File Overview

Next.js App Router page for route segment `[locale]/draft-listings`. Client wrapper that enforces authorization before rendering the draft listings screen.

**Source:** `app/[locale]/(main)/(listings)/draft-listings/page.tsx`

# Responsibilities

- Next.js App Router page for route segment `[locale]/draft-listings`.
- Sets document title via `usePageTitle("draftListings")`.
- Guards access with `useAuthorize("DRAFT_LISTINGS")` — allowed roles: `owner`, `agent`.
- Shows `LoadingScreen` while auth hydrates; renders `DraftListingsScreen` when authorized.

# Imports

- `DraftListingsScreen` from `@/src/features/property/screens/DraftListingsScreen`
- `usePageTitle`, `useAuthorize`, `LoadingScreen`

# Exports

- Default page component `DraftListingsPage`

# Navigation

- Public URL: `/en/draft-listings` (and other locales).
- Linked from protected sidebar (agent), protected profile popover (owner), public/landing profile popovers (owner + agent), and mobile drawers.

# Dependencies

- `proxy.ts` requires an `access_token` cookie for `/draft-listings`.
- Sidebar link: `protectedSidebarNav.config.ts` → `draftListings` → `/draft-listings` (`DRAFT_LISTINGS_SIDEBAR`, agent only).
