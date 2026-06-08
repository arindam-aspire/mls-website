# File Overview

Landing header module for the landing layout shell.

**Source:** `src/layouts/landing-layout/LandingHeader.tsx`

# Responsibilities

- Render the full landing header shell (logo, nav, actions, mobile menu trigger).
- Use landing-scoped subcomponents for nav/actions/theme/profile.
- Host mobile drawer via [LandingMobileMenu.md](./LandingMobileMenu.md) (`open` / `onClose` from header state).

# Imports

- `LandingDesktopNav` from `src/layouts/landing-layout/LandingDesktopNav`
- `LandingDesktopActions` from `src/layouts/landing-layout/LandingDesktopActions`
- `LandingMobileMenu` from `src/layouts/landing-layout/LandingMobileMenu`
- `useAuthStore`, `AUTH_VIEW` for sign-in and user state

# Exports

- `LandingHeader`

# State Management

- Local: `scrolled` (hero vs solid header)
- Global: `useAuthStore` — `user`, `isLoadingUser`, `openAuth`

# Navigation

- Mobile nav: `LandingMobileMenu` receives `onNavigate={(path) => router.push(path)}`.
- Locale change: `router.replace(pathname, { locale })`.
- Sign-in (guest): mobile header button beside hamburger calls `openAuth(AUTH_VIEW.chooseAccount)`.

# Actions / Inputs

| Area | Items | Action |
| --- | --- | --- |
| Header bar (mobile, guest) | Logo (left), Sign-in + hamburger (right, `gap-2`) | Home, auth modal, open drawer |
| Header bar (mobile, logged in) | Logo (left), Notifications + hamburger (right, `gap-2`) | Home, upcoming feature modal, open drawer |
| Mobile drawer | See `LandingMobileMenu` | Navigation + settings |

# UI Details

- **`NotificationsPopover`** when signed in (mobile, `overHero` when applicable); desktop via `ProfilePopover`.
- **`md` / `lg`:** `grid grid-cols-[1fr_auto_1fr]` — centered desktop nav + `LandingDesktopActions`.
- **Hero mode (`overHero`):** white menu icon, avatar ring on `sm`; logo swaps dark/light variant on scroll.

# Dependencies

- `LandingDesktopNav`, `LandingDesktopActions`, `LandingMobileMenu`

# Notes

- Mobile drawer is entirely implemented in `LandingMobileMenu.tsx` (single file).
