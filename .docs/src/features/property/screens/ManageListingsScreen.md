# File Overview

Route-level screen for agency/agent listing management (`MANAGE_LISTINGS` permission). Agency users see a header and Coming Soon placeholder; **agents** also get an **Add Property** action.

**Source:** `src/features/property/screens/ManageListingsScreen.tsx`

# Responsibilities

- Render localized page title and subtitle from `propertyList.manageListings`.
- Show **Add Property** button only when the logged-in user has the **agent** role (`isAgentUser`).
- Navigate agents to `/property-create` on Add Property click.
- Render `ComingSoonCard` until full listing management UI ships.

# Imports

- `ComingSoonCard`, `Button`, `useAuthStore`, `isAgentUser`, `useRouter`, typography helpers, `Plus` icon, `useTranslations`

# Exports

- `ManageListingsScreen` (default)

# State Management

- Reads `user` from `useAuthStore` to derive `showAddProperty` via `isAgentUser(user)`.

# Navigation

- Mounted at `/en/manage-listings` via `app/[locale]/(main)/(listings)/manage-listings/page.tsx` (`useAuthorize("MANAGE_LISTINGS")`).
- Add Property → `router.push("/property-create")` (requires `PROPERTY_CREATE` permission — owner or agent).

# Actions / Inputs

| Action | Who | Result |
| --- | --- | --- |
| Add Property | Agent only | Navigate to `/property-create` |

# UI Details

- Responsive header row: stacked on mobile, title/subtitle left and button right from `sm:`.
- `headingPageClasses` + `bodyLargeTextClasses` for title/subtitle (matches `ListingPropertyScreen`).
- Button: `rounded-lg`, `size="md"`, primary solid, `Plus` icon.
- `ComingSoonCard` below header.
- Light/dark semantic tokens; i18n keys in all four locales.

# Flow Description

1. Page guard passes user with `MANAGE_LISTINGS` (agency or agent).
2. Screen reads user from auth store; agents see Add Property.
3. Agency users see title, subtitle, and Coming Soon only.
4. Agent clicks Add Property → `/property-create` (guarded by `PROPERTY_CREATE`).

# Dependencies

- [ListingPropertyScreen.md](./ListingPropertyScreen.md) — shared header layout pattern
- [profileMenuRoleAccess.ts](../../auth/utils/profileMenuRoleAccess.ts) — `isAgentUser`
- `src/lib/auth/permissions.ts` — `MANAGE_LISTINGS`, `PROPERTY_CREATE`
- `src/messages/*/propertyList.json` — `manageListings` group

# Notes

- Distinct from `/my-listings` (`ListingPropertyScreen`, `MY_LISTINGS`, owner always sees Add Property).
- Agency (`admin`) role does not see Add Property on this screen.
