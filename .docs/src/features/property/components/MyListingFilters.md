# File Overview

Filter bar for **My Listings** (`ListingPropertyScreen`) and **Manage Listings** (`ManageListingsScreen`): search, status dropdown, and column visibility popover.

**Source:** `src/features/property/components/MyListingFilters.tsx`

# Responsibilities

- Search field (left) with `SearchInput`.
- Status filter dropdown (right on `sm+`) with `SelectDropdown`.
- **Column picker** — `Popover` + `PopoverButton` (table icon) opens a panel of checkboxes; toggling updates which columns `ListTableView` shows.

# Imports

- `SearchInput`, `SelectDropdown`, `Popover` family from `@/src/components/ui/popover`
- `MY_LISTING_STATUS_FILTER_VALUES` from `myListingStatusFilters.constants`
- `common` + `propertyList.myListings` or `propertyList.manageListings` translations (via `listingsNamespace`)

# Props / Parameters

| Prop | Type |
| --- | --- |
| `search` | `string` |
| `status` | `string` |
| `onSearchChange` | `(value: string) => void` |
| `onStatusChange` | `(value: string) => void` |
| `columnOptions` | `MyListingColumnOption[]` — label and visible per optional column |
| `onColumnVisibilityChange` | `(columnId, visible) => void` |
| `listingsNamespace` | `"myListings" \| "manageListings"` (default `"myListings"`) |

# Actions / Inputs

| Input | i18n / values |
| --- | --- |
| Search | `common.searchPlaceholder`, `common.clearSearch` |
| Status | `statusFilter.all`, `statusFilter.{value}` |
| Column picker trigger | `columnPickerAriaLabel` |
| Column picker title | `columnPickerTitle` |
| Column labels | `columns.reference`, `status`, `submittedOn` (toggleable only) |

# UI Details

- Popover panel: `rounded-xl`, anchored `bottom end`, explicit `min-w` (not button width).
- **Toggle Columns** title (`text-sm font-semibold`) above a **two-column** checkbox grid.
- Checkboxes: shared `CheckboxField` from `@/src/components/ui` (primary fill + checkmark when checked).
- Trigger styled like outline `IconButton` (`border-secondary/15`, `rounded-lg`).
- **Property Name** and **Actions** are always visible in the table and are not listed in the popover.
- Each optional column (**Reference**, **Status**, **Submitted on**) can be enabled or disabled independently (all three may be hidden).

# Dependencies

- [myListingStatusFilters.constants.md](../constants/myListingStatusFilters.constants.md)
- [myListingTableColumns.constants.md](../constants/myListingTableColumns.constants.md)
- [useListingPropertyScreen.md](../hooks/useListingPropertyScreen.md)
