# File Overview

Landing desktop actions module for auth/profile and locale controls.

**Source:** `src/layouts/landing-layout/LandingDesktopActions.tsx`

# Responsibilities

- Render desktop action controls (theme toggle, fullscreen, locale selector, auth/profile actions).
- Compose landing-specific theme and profile components.

# Imports

- `HeaderFullscreenButton` from `src/layouts/shared/HeaderFullscreenButton`
- `HeaderLanguageSelect` from `src/layouts/shared/HeaderLanguageSelect`
- `buildHeaderLocaleOptions` from `src/layouts/shared/buildHeaderLocaleOptions`
- `LandingProfilePopover` from `src/layouts/landing-layout/LandingProfilePopover`
- `LandingHeaderThemeButton` from `src/layouts/landing-layout/LandingHeaderThemeButton`
- `useAuthStore` from `src/features/auth/store/auth.store`

# Exports

- `LandingDesktopActions`

# Notes

- Passes `overHero` to theme, fullscreen, language select, and profile popover for hero contrast.
- Language picker matches protected/public headers via shared `HeaderLanguageSelect`.
