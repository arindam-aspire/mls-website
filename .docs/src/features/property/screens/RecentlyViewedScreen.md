# File Overview

Recently viewed screen: page header + `ComingSoonCard`. API is prefetched in the hook; list UI not wired yet.

**Source:** `src/features/property/screens/RecentlyViewedScreen.tsx`

# Responsibilities

- Page toolbar: localized `h1` title + muted subtitle.
- Render `ComingSoonCard` below the header.
- `useRecentlyViewedScreen` triggers `GET /users/recent-views` on mount (no list UI yet).

# Imports

- `ComingSoonCard` from `@/src/components/common/ComingSoonCard`
- `useRecentlyViewedScreen` from `../hooks/useRecentlyViewedScreen`
- Typography utilities (`headingPageClasses`, `bodyLargeTextClasses`)

# Exports

- `RecentlyViewedScreen`
- `default`

# State Management

- `useRecentlyViewedScreen` — labels + API prefetch.

# API Usage

- `GET /users/recent-views?page=1&pageSize=10` via hook (auth required).

# Navigation

- Mounted at `/en/recently-viewed` via `app/[locale]/(main)/recently-viewed/page.tsx` (`ProtectedLayout`, `useAuthorize("RECENTLY_VIEWED")`).

# UI Details

- Header stack: `gap-2 md:gap-4 lg:gap-6` (matches favourites / saved searches).
- **Theme:** semantic tokens (`text-text`, `text-muted`).

# Dependencies

- [useRecentlyViewedScreen.md](../hooks/useRecentlyViewedScreen.md)
- `app/[locale]/(main)/recently-viewed/page.tsx`
