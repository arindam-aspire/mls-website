# File Overview

Fixed bottom tab navigation for protected routes on viewports below `md`. Always **five** icon tabs when signed in: Home, Listings, Search, Favourites, Enquiry (Search is the middle item).

**Source:** `src/layouts/protected-layout/ProtectedBottomTabBar.tsx`

# Responsibilities

- Render all five configured tabs for authenticated users.
- Highlight active tab from current pathname.
- Hide when user is not loaded.

# Imports

- `useProtectedBottomTabBar`
- `Link` from `@/src/i18n/navigation`

# Navigation

| Tab | Path | Notes |
| --- | --- | --- |
| Home | `/dashboard` | `/my-profile` if user lacks `DASHBOARD` |
| Listings | `/listing` | |
| Search | `/property-list` | Center of five tabs |
| Favourites | `/favourites` | |
| Enquiry | `/inquiries` | |

# UI Details

- `fixed bottom-0`, `bg-surface/95`, `md:hidden`.
- All tabs share the same layout: icon + label, `text-primary` when active, `text-muted` otherwise.
- Safe-area padding on bottom inset.

# Dependencies

- [protectedBottomTab.config.md](./protectedBottomTab.config.md)
- [hooks/useProtectedBottomTabBar.md](./hooks/useProtectedBottomTabBar.md)
- [index.md](./index.md)
