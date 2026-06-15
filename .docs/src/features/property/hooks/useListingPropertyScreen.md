# File Overview

Screen hook for **`ListingPropertyScreen`** (`/my-listings`): fetches agent properties, maps rows for `ListTableView`, and exposes filters, sort, and pagination.

**Source:** `src/features/property/hooks/useListingPropertyScreen.ts`

# Responsibilities

- Thin wrapper around `useAgentListingsTable` with `listingsNamespace: "myListings"`.
- All table logic lives in [useAgentListingsTable.md](./useAgentListingsTable.md).

# Imports

- `useAgentListingsTable` from `./useAgentListingsTable`

# Exports

- `useListingPropertyScreen()`

# Navigation

- Used by `ListingPropertyScreen` at `/en/my-listings` (`MY_LISTINGS` permission).

# Dependencies

- [useAgentListingsTable.md](./useAgentListingsTable.md)
- [ListingPropertyScreen.md](../screens/ListingPropertyScreen.md)
