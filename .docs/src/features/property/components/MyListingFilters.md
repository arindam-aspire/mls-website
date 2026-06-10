# File Overview

Filter bar for the **My Listings** screen (`ListingPropertyScreen`): search + status dropdown.

**Source:** `src/features/property/components/MyListingFilters.tsx`

# Responsibilities

- Search field (left) with `SearchInput`.
- Status filter dropdown (right on `sm+`) with `SelectDropdown`.
- `IconButton` with `TableProperties` beside the status dropdown.

# Imports

- `SearchInput`, `SelectDropdown`
- `MY_LISTING_STATUS_FILTER_VALUES` from `myListingStatusFilters.constants`
- `common` + `propertyList.myListings.statusFilter` translations

# Props / Parameters

| Prop | Type |
| --- | --- |
| `search` | `string` |
| `status` | `string` |
| `onSearchChange` | `(value: string) => void` |
| `onStatusChange` | `(value: string) => void` |

# Actions / Inputs

| Input | i18n / values |
| --- | --- |
| Search | `common.searchPlaceholder`, `common.clearSearch` (built-in clear `X` when query is non-empty) |
| Status | `statusFilter.all` (placeholder / all), `statusFilter.{value}` per option |
| Table view button | `myListings.tableViewAriaLabel` |

# UI Details

- Row on `sm+`: `justify-between`, search left, status + table-view button grouped on the right.
- Stacked column on small screens; actions row uses `flex` with status `flex-1` and icon button `shrink-0`.
- Search: `w-full sm:max-w-sm md:max-w-md`, `size="md"`.
- Status: `min-w` scale (`11.5rem` → `14.5rem`) so labels fit without over-shrinking.
- Table view `IconButton`: `color="inherit"` + `variant="outline"` to match select field borders.
- All controls use `size="md"` for aligned heights.

# Dependencies

- [myListingStatusFilters.constants.md](../constants/myListingStatusFilters.constants.md)
- [ListingPropertyScreen.md](../screens/ListingPropertyScreen.md)
