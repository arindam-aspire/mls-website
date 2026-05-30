# File Overview

Project source module.

**Source:** `src/layouts/public-layout/PublicMain.tsx`

# Responsibilities

- Wrap route children in a centered container within the main region.
- On `/property-list`, skip the outer container so the screen can render a full-width sticky filter bar and a separate container for list content.

# Imports

- `usePathname` from `@/src/i18n/navigation`
- `cn` from `@/src/lib/cn`

# Exports

- `PublicMain`

# State Management

_No significant state; presentational wrapper._

# Navigation

- When `pathname === "/property-list"`, children render directly (no `container` wrapper) and top padding is removed so the sticky filter bar aligns with the header offset.

# UI Details

- Default: `flex flex-1 flex-col overflow-visible px-6 py-4` + inner `container mx-auto`
- Property list: `pt-0` on main; sticky filters and list each use their own `container mx-auto`
- Document scroll (not an inner scroll trap) — required for `position: sticky` on the filter bar

# Notes

- Landing-only spacing logic lives in `LandingMain.tsx`.
- Sticky offset uses global `--layout-header-height` (see `app/globals.css`).
