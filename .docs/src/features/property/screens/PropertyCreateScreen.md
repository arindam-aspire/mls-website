# File Overview

Create-property screen at `/en/property-create` (coming soon placeholder). Used by owners (from My Listings) and agents (from Manage Listings).

**Source:** `src/features/property/screens/PropertyCreateScreen.tsx`

# Responsibilities

- Render localized page title and subtitle.
- Show role-aware breadcrumb on `md+` (hidden on `sm`) in the header row right section.
- Render `ComingSoonCard` until the create-listing form ships.

# Imports

- `usePropertyCreateScreen`, `Breadcrumb`, `ComingSoonCard`, typography helpers

# Navigation

- `app/[locale]/(main)/(listings)/property-create/page.tsx` — `useAuthorize("PROPERTY_CREATE")`
- Breadcrumb: `/dashboard` → `/my-listings` or `/manage-listings` → current (Create)

# UI Details

- Header row matches `ListingPropertyScreen` / `ManageListingsScreen` layout.
- Breadcrumb: `hidden md:flex` on the right; Home icon, List icon + listings label, Create (current).
- Light/dark semantic tokens; i18n in all four locales.

# Flow Description

1. Page guard passes user with `PROPERTY_CREATE`.
2. Hook builds breadcrumb from user role (`resolveListingsMenuPath`).
3. Screen renders header + Coming Soon card.

# Dependencies

- [usePropertyCreateScreen.md](../hooks/usePropertyCreateScreen.md)
- [breadcrumb/index.md](../../../components/ui/breadcrumb/index.md)
