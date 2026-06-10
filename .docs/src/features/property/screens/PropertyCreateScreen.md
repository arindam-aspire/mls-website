# File Overview

Create-property screen at `/en/property-create`. Loads taxonomy/feature catalog on mount; form UI coming soon.

**Source:** `src/features/property/screens/PropertyCreateScreen.tsx`

# Responsibilities

- Render localized page title and subtitle.
- Show role-aware breadcrumb on `md+` (hidden on `sm`) in the header row right section.
- Show `PropertyCreateScreenSkeleton` while catalog APIs load.
- Render `ComingSoonCard` after catalog data is ready (form UI TBD).

# Imports

- `usePropertyCreateScreen`, `PropertyCreateScreenSkeleton`, `Breadcrumb`, `ComingSoonCard`, typography helpers

# Navigation

- `app/[locale]/(main)/(listings)/property-create/page.tsx` — `useAuthorize("PROPERTY_CREATE")`
- Breadcrumb: `/dashboard` → `/my-listings` or `/manage-listings` → current (Create)

# API Usage

Catalog prefetch is owned by [usePropertyCreateScreen.md](../hooks/usePropertyCreateScreen.md) (`is_active=true` on features only).

# UI Details

- Header row matches `ListingPropertyScreen` / `ManageListingsScreen` layout.
- Loading skeleton mirrors header + coming-soon card layout at all breakpoints.
- Breadcrumb: `hidden md:flex` on the right; Home icon, List icon + listings label, Create (current).
- Light/dark semantic tokens; i18n in all four locales.

# Flow Description

1. Page guard passes user with `PROPERTY_CREATE`.
2. Hook fetches property taxonomy, category taxonomy, and active features in parallel.
3. Screen shows skeleton until catalog load completes.
4. Screen renders header + Coming Soon card (catalog available to future form).

# Dependencies

- [usePropertyCreateScreen.md](../hooks/usePropertyCreateScreen.md)
- [PropertyCreateScreenSkeleton.md](../components/PropertyCreateScreenSkeleton.md)
- [breadcrumb/index.md](../../../components/ui/breadcrumb/index.md)
