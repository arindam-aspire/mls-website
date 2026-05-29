# File Overview

Landing desktop actions module for auth/profile and locale controls.

**Source:** `src/layouts/landing-layout/LandingDesktopActions.tsx`

# Responsibilities

- Render desktop action controls (theme toggle, locale selector, auth/profile actions).
- Compose landing-specific theme and profile components.

# Imports

- `LandingProfilePopover` from `src/layouts/landing-layout/LandingProfilePopover`
- `LandingHeaderThemeButton` from `src/layouts/landing-layout/LandingHeaderThemeButton`
- `useAuthStore` from `src/features/auth/store/auth.store`

# Exports

- `LandingDesktopActions`

# Notes

- This file is now fully implemented in `landing-layout` (no re-export).
