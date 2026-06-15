# File Overview

Column ids and default visibility for the **My Listings** table column picker.

**Source:** `src/features/property/constants/myListingTableColumns.constants.ts`

# Exports

| Symbol | Purpose |
| --- | --- |
| `MY_LISTING_TABLE_COLUMN_IDS` | All table column ids |
| `MY_LISTING_ALWAYS_VISIBLE_COLUMN_IDS` | `title`, `actions` — always in table, not in popover |
| `MY_LISTING_TOGGLEABLE_COLUMN_IDS` | `reference`, `status`, `submittedOn`, `reviewedOn` — column picker only |
| `MyListingColumnVisibility` | Toggle state for optional columns only |
| `DEFAULT_MY_LISTING_COLUMN_VISIBILITY` | All toggleable columns visible initially |
| `isMyListingTableColumnVisible` | Resolves visibility for any column id |
| `MY_LISTING_COLUMN_I18N_KEY` | Maps column id → `propertyList.myListings.columns.*` key |

# Dependencies

- `useListingPropertyScreen` — visibility state and filtered `columns`
- `MyListingFilters` — popover checkboxes
