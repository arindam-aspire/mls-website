# File Overview

Landing desktop navigation module.

**Source:** `src/layouts/landing-layout/LandingDesktopNav.tsx`

# Responsibilities

- Render desktop navigation links for landing header.
- Handle locale-aware navigation through `useRouter`.

# Imports

- `useTranslations` from `next-intl`
- `useRouter` from `src/i18n/navigation`
- `cn` from `src/lib/cn`

# Exports

- `LandingDesktopNav`

# Notes

- Nav `<button>` elements use `suppressHydrationWarning` because password-manager / autofill extensions often add `fdprocessedid` on the client; the landing **Buy** link is a common trigger when `overHero` styles apply.
- This file is now fully implemented in `landing-layout` (no re-export).
