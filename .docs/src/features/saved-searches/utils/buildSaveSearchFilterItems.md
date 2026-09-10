# File Overview

Builds chip/summary items shown in the save-search modal from current filter values.

**Source:** `src/features/saved-searches/utils/buildSaveSearchFilterItems.ts`

# Responsibilities

- Resolve option labels for status, category, type, rooms, amenities.
- Join selected area labels from `locationValues` (or a legacy `locationValue`) into one location chip.

# Exports

- `BuildSaveSearchFilterItemsInput` (`locationValues?: string[]`)
- `buildSaveSearchFilterItems(input, t, resolveAmenityLabel)`

# Dependencies

- [buildSaveSearchCriteria.md](./buildSaveSearchCriteria.md)
- [PropertyListFilters.md](../../property/components/PropertyListFilters.md)
