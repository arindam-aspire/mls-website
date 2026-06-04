# File Overview

Public header module for the default app shell.

**Source:** `src/layouts/public-layout/PublicHeader.tsx`

# Responsibilities

- Sticky header with logo, desktop nav/actions, mobile sign-in or notifications + hamburger.
- Render [PublicMobileMenu.md](./PublicMobileMenu.md) outside `<header>` (drawer portaled, no blur trap).
- Upcoming-feature modal for mobile notifications bell.

# State Management

- Local: `mobileMenuOpen`, `isUpcomingFeatureModalOpen`
- Global: `useAuthStore` — `user`, `isLoadingUser`, `openAuth`

# Navigation

- Mobile drawer: `onNavigate` → `router.push`
- Locale: `router.replace(pathname, { locale })`

# Actions / Inputs

| Area | Items | Action |
| --- | --- | --- |
| Mobile (guest) | Sign-in + menu | Auth modal, open drawer |
| Mobile (logged in) | Notifications + menu | Upcoming modal, open drawer |
| Desktop | `DesktopNav`, `DesktopActions` | Unchanged |

# UI Details

- Mobile: logo left; notifications (signed in) or sign-in + `IconButton` menu (`inherit`/`outline`, `publicMobileHeaderIconButtonClass`) — aligned with protected mobile header controls (`gap-2 sm:gap-3`).
- `md+`: `grid-cols-[1fr_auto_1fr]` like landing header (without hero/overHero styling).
- Shared sizing: `publicMobileHeaderStyles.ts`.

# Dependencies

- `DesktopNav`, `DesktopActions`, `PublicMobileMenu`, `PublicNotificationsButton`

# Notes

- Hero/scroll styling remains landing-only (`LandingHeader`).
