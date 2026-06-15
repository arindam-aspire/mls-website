# File Overview

Owner **My Listings** screen at `/en/my-listings`: page header, **Add Property** action, filters, and agent listings table.

**Source:** `src/features/property/screens/ListingPropertyScreen.tsx`

# Responsibilities

- Render localized page title and subtitle (`propertyList.myListings`).
- **Add Property** primary button (right on `sm+`) uses `useAddPropertyEntry`: if `user.has_agency === true` → `/property-create`; otherwise opens `SelectAgencyModal` from profile feature.
- Show `Card` (`rounded-xl`) with `MyListingFilters` and `ListTableView` from `@abdoun/abdoun-library`.

# Imports

- `Card`, `CardContent`, `Button`, `MyListingFilters`
- `SelectAgencyModal` from `@/src/features/profile/modals/SelectAgencyModal`
- `MyListingRejectedReasonModal`, `ConfirmModal` (delete listing)
- `useAddPropertyEntry`, `useListingPropertyScreen`
- `useTranslations("propertyList.myListings")`
- Typography: `headingPageClasses`, `bodyLargeTextClasses`
- `Plus` icon (lucide-react)

# Exports

- `ListingPropertyScreen` (default)

# State Management

- `useListingPropertyScreen()` fetches `GET /agent-properties`, maps rows for `ListTableView`, and owns sort/pagination state.

# Navigation

- Mounted at `/en/my-listings` via `app/[locale]/(main)/(listings)/my-listings/page.tsx` (`MY_LISTINGS` permission).
- Row click / **View** → `/propert-details/{propertyHash}` (library row `id`).
- **Continue** / **Edit** (rejected) → `/property-create?submission_id=…` when a submission id exists.
- **View Rejected Reason** opens `MyListingRejectedReasonModal` (`ModalHeader` + reason panel + footer close).
- **Delete** sets pending row state → `ConfirmModal` (danger variant) → on confirm `DELETE /property-submissions/{submissionId}`.
- `ListTableView` receives `workflowActions`, `onRowAction`, `canViewDelete`, and `onClickDelete` so delete always opens the confirm modal before the API call.

# Actions / Inputs

| Action | Behavior |
| --- | --- |
| Add Property | If `has_agency === true` → `/property-create`; else open `SelectAgencyModal` |
| Search / status filters | Via `MyListingFilters` → refetch API (page resets to 1) |
| Table sort | Client-side `sortConfig` on current page rows |
| Pagination | Server page / page size via `ListTableView` footer |
| Property title / View / Continue | Navigate to property update with `property_id` query |

# UI Details

- Header layout matches `RecentlyViewedScreen` (title left, action right on `sm+`).
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
- [useAddPropertyEntry.md](../hooks/useAddPropertyEntry.md)
- [SelectAgencyModal.md](../../profile/modals/SelectAgencyModal.md)
- [agentPropertiesList.mapper.md](../mappers/agentPropertiesList.mapper.md)
- `src/messages/*/propertyList.json` → `myListings.*`
- `app/[locale]/(main)/(listings)/my-listings/page.tsx`
