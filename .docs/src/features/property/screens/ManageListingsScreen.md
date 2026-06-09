# File Overview

Route-level screen for agency/agent/owner listing management (Coming Soon placeholder).

**Source:** `src/features/property/screens/ManageListingsScreen.tsx`

# Responsibilities

- Render localized Coming Soon UI for the manage listings area.
- Copy from `propertyList.manageListings` namespace (`pageTitle`, `comingSoonEyebrow`, `comingSoonDescription`).

# Imports

- `import { ComingSoonCard } from "@/src/components/common/ComingSoonCard"`
- `import { useTranslations } from "next-intl"`

# Exports

- `ManageListingsScreen` (default)

# State Management

_No local state; presentational._

# Navigation

- Mounted at `/en/manage-listings` via `app/[locale]/(main)/manage-listings/page.tsx` (`ProtectedLayout`, `useAuthorize("MANAGE_LISTINGS")`).
- Linked from protected sidebar (`common.manageListings`).

# UI Details

- Uses `ComingSoonCard` with semantic theme tokens.
- i18n: `useTranslations("propertyList.manageListings")`.

# Flow Description

1. Page guard passes authenticated user with `DASHBOARD` permission.
2. Screen loads translated strings.
3. Renders `ComingSoonCard` until listing management UI is implemented.

# Dependencies

- [ComingSoonCard.md](../../../components/common/ComingSoonCard.md)
- `src/messages/*/propertyList.json` — `manageListings` group

# Notes

- Distinct from `/listing` (`ListingPropertyScreen`, `MY_LISTINGS` permission, owner menu).
