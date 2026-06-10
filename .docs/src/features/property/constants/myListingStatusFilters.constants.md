# File Overview

Status filter value keys for the My Listings status `SelectDropdown`.

**Source:** `src/features/property/constants/myListingStatusFilters.constants.ts`

# Exports

- `MY_LISTING_STATUS_FILTER_VALUES` — API/status slug list (excludes empty “all”)
- `MyListingStatusFilterValue`

# Notes

- Labels live in `propertyList.myListings.statusFilter` (all four locales).
- Empty string (`""`) means “All” via `SelectDropdown` placeholder.
