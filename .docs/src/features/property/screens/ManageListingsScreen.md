# File Overview

Agency/agent **Manage Listings** screen at `/en/manage-listings`: page header, **Add Property** action, filters, and agent listings table — same layout and data flow as `ListingPropertyScreen`.

**Source:** `src/features/property/screens/ManageListingsScreen.tsx`

# Responsibilities

- Render localized page title and subtitle (`propertyList.manageListings`).
- **Add Property** primary button (right on `sm+`) for **agents only** (`isAgentUser`); navigates directly to `/property-create` (no agency selection modal).
- Show `Card` (`rounded-xl`) with `MyListingFilters` and `ListTableView` from `@abdoun/abdoun-library`.
- Reuse `useManageListingsScreen()` for table data and filters.

# Imports

- `Card`, `CardContent`, `Button`, `MyListingFilters`
- `ListTableView` from `@abdoun/abdoun-library`
- `useManageListingsScreen`
- `useTranslations("propertyList.manageListings")`
- Typography: `headingPageClasses`, `bodyLargeTextClasses`
- `Plus` icon (lucide-react)

# Exports

- `ManageListingsScreen` (default)

# State Management

- Reads `user` from `useAuthStore` to derive `showAddProperty` via `isAgentUser(user)`.
- `useManageListingsScreen()` — **agents** use `GET /agent-properties`; **admins** use `GET /admin/property-submissions`.

# Navigation

- Mounted at `/en/manage-listings` via `app/[locale]/(main)/(listings)/manage-listings/page.tsx` (`MANAGE_LISTINGS` permission).
- Row click / workflow **View** / **Continue** → `/property-update?property_id=…` (from hook).

# Actions / Inputs

| Action | Behavior |
| --- | --- |
| Add Property | Agent only → `router.push("/property-create")` |
| Search / status filters | Via `MyListingFilters` → refetch API (page resets to 1); search hidden for admin |
| Table sort | Client-side `sortConfig` on current page rows |
| Pagination | Server page / page size via `ListTableView` footer |
| Property title / View / Continue | Navigate to property update with `property_id` query |

# UI Details

- Header layout matches `ListingPropertyScreen` (title left, action right on `sm+`).
- `rounded-lg` button; `rounded-xl` card; semantic tokens; mobile-first.
- `ListTableView` uses built-in `TableBodySkeleton` while loading; empty state from `noDataFound` i18n keys.
- Custom columns via `buildMyListingTableColumns`: **Property** (name + reference stacked), **Status**, **Submitted on**, **Reviewed on**, **Actions**.
- Pinned columns: `title` (Property) (left), `actions` (right).

# API Usage

| Method | Endpoint | Auth | Role |
| --- | --- | --- | --- |
| GET | `/agent-properties` | Yes | Agent |
| GET | `/admin/property-submissions` | Yes | Admin / agency |

# Dependencies

- [useManageListingsScreen.md](../hooks/useManageListingsScreen.md)
- [ListingPropertyScreen.md](./ListingPropertyScreen.md) — shared screen pattern
- [agentPropertiesList.mapper.md](../mappers/agentPropertiesList.mapper.md)
- `src/messages/*/propertyList.json` → `manageListings.*`
- `app/[locale]/(main)/(listings)/manage-listings/page.tsx`

# Notes

- Distinct route/permission from `/my-listings` (`MY_LISTINGS`, owners). Same table UI; API depends on role (agent vs admin).
- `property-create` requires `PROPERTY_CREATE` (owner or agent); agency users without that permission are redirected by page guard.
