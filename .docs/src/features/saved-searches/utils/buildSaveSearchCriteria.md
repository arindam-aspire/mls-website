# File Overview

Builds `SavedSearchCriteria` from the current filter bar or criteria form, including multi-area location encoding.

**Source:** `src/features/saved-searches/utils/buildSaveSearchCriteria.ts`

# Responsibilities

- Copy status, category, type, budget, rooms, amenities, and cadastral fields.
- Prefer `locationValues[]`: serialize with `serializeSearchLocationValues`.
- Fall back to a single `locationValue` for older callers.

# Exports

- `buildSaveSearchCriteria(input)`

# Dependencies

- [buildSaveSearchFilterItems.md](./buildSaveSearchFilterItems.md)
- [propertySearchLocations.utils.md](../../property/utils/propertySearchLocations.utils.md)
