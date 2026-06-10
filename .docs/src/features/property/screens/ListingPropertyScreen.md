# File Overview

Owner **My Listings** screen at `/en/my-listings`: page header, **Add Property** action, and coming-soon placeholder content.

**Source:** `src/features/property/screens/ListingPropertyScreen.tsx`

# Responsibilities

- Render localized page title and subtitle (`propertyList.myListings`).
- **Add Property** primary button (right on `sm+`) navigates to `/property-create` via `useRouter` from `@/src/i18n/navigation`.
- Show `Card` (`rounded-xl`) with `MyListingFilters` as the listings content area.

# Imports

- `Card`, `CardContent`, `Button`, `MyListingFilters`
- `useTranslations("propertyList.myListings")`
- Typography: `headingPageClasses`, `bodyLargeTextClasses`
- `Plus` icon (lucide-react)

# Exports

- `ListingPropertyScreen` (default)

# State Management

- `useListingPropertyScreen()` fetches `GET /agent-properties` with `search` / `status` from `MyListingFilters`.
- Add Property uses locale-aware navigation.

# Navigation

- Mounted at `/en/my-listings` via `app/[locale]/(main)/(listings)/my-listings/page.tsx` (`MY_LISTINGS` permission).

# Actions / Inputs

| Action | Behavior |
| --- | --- |
| Add Property | `router.push("/property-create")` |

# UI Details

- Header layout matches `RecentlyViewedScreen` (title left, action right on `sm+`).
- `rounded-lg` button; semantic tokens; mobile-first (`w-full` button stacks on small screens).

# API Usage

| Method | Endpoint | Auth |
| --- | --- | --- |
| GET | `/agent-properties` | Yes |

# Dependencies

- [useListingPropertyScreen.md](../hooks/useListingPropertyScreen.md)
- `src/messages/*/propertyList.json` → `myListings.*`
- `app/[locale]/(main)/(listings)/my-listings/page.tsx`
