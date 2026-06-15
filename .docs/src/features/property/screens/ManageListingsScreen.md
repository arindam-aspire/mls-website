# File Overview

Agency/agent **Manage Listings** screen at `/en/manage-listings`: page header, **Add Property** action, filters, and agent listings table — same layout and data flow as `ListingPropertyScreen`.

**Source:** `src/features/property/screens/ManageListingsScreen.tsx`

# Responsibilities

- Render localized page title and subtitle (`propertyList.manageListings`).
- **Add Property** primary button (right on `sm+`) for **agents only** (`isAgentUser`); navigates to `/property-create` via `useRouter` from `@/src/i18n/navigation`.
- Show `Card` (`rounded-xl`) with `MyListingFilters` and `ListTableView` from `@abdoun/abdoun-library`.
- Reuse `useListingPropertyScreen({ listingsNamespace: "manageListings" })` for table data and filters.

# Imports

- `Card`, `CardContent`, `Button`, `MyListingFilters`
- `ListTableView` from `@abdoun/abdoun-library`
- `useListingPropertyScreen`
- `useTranslations("propertyList.manageListings")`
- Typography: `headingPageClasses`, `bodyLargeTextClasses`
- `Plus` icon (lucide-react)

# Exports

- `ManageListingsScreen` (default)

# State Management

- Reads `user` from `useAuthStore` to derive `showAddProperty` via `isAgentUser(user)`.
- `useListingPropertyScreen({ listingsNamespace: "manageListings" })` fetches `GET /agent-properties`, maps rows for `ListTableView`, and owns sort/pagination state.

# Navigation

- Mounted at `/en/manage-listings` via `app/[locale]/(main)/(listings)/manage-listings/page.tsx` (`MANAGE_LISTINGS` permission).
- Row click / workflow **View** / **Continue** → `/property-update?property_id=…` (from hook).

# Actions / Inputs

| Action | Behavior |
| --- | --- |
| Add Property | Agent only → `router.push("/property-create")` |
| Search / status filters | Via `MyListingFilters` → refetch API (page resets to 1) |
| Table sort | Client-side `sortConfig` on current page rows |
| Pagination | Server page / page size via `ListTableView` footer |
| Property title / View / Continue | Navigate to property update with `property_id` query |

# UI Details

- Header layout matches `ListingPropertyScreen` (title left, action right on `sm+`).
- `rounded-lg` button; `rounded-xl` card; semantic tokens; mobile-first.
- `ListTableView` uses built-in `TableBodySkeleton` while loading; empty state from `noDataFound` i18n keys.
- Custom columns via `buildMyListingTableColumns`: **Property Name**, **Reference**, **Status**, **Submitted on**, **Actions**.
- Pinned columns: `title` (left), `actions` (right).

# API Usage

| Method | Endpoint | Auth |
| --- | --- | --- |
| GET | `/agent-properties` | Yes |

# Dependencies

- [useListingPropertyScreen.md](../hooks/useListingPropertyScreen.md)
- [ListingPropertyScreen.md](./ListingPropertyScreen.md) — shared screen pattern
- [agentPropertiesList.mapper.md](../mappers/agentPropertiesList.mapper.md)
- `src/messages/*/propertyList.json` → `manageListings.*`
- `app/[locale]/(main)/(listings)/manage-listings/page.tsx`

# Notes

- Distinct route/permission from `/my-listings` (`MY_LISTINGS`, owners) but same table UI and API.
- `property-create` requires `PROPERTY_CREATE` (owner or agent); agency users without that permission are redirected by page guard.
