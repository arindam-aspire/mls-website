# File Overview

Landing footer module for landing layout composition.

**Source:** `src/layouts/landing-layout/LandingFooter.tsx`

# Responsibilities

- Render the full landing footer UI and app download badges.
- Keep footer implementation isolated under `landing-layout` for independent updates.

# Imports

- `Image` from `next/image`
- `getTranslations` from `next-intl/server`
- `Link` from `src/i18n/navigation`

# Exports

- `LandingFooter`

# Notes

- On viewports below `md`, extra bottom padding clears the fixed [LandingBottomTabBar](./LandingBottomTabBar.md).
