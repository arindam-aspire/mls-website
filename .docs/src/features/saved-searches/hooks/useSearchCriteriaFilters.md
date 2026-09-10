# File Overview

Filter-state hook for saved-search create/edit (`SearchCriteriaForm`). Same area multi-select encoding as property list search.

**Source:** `src/features/saved-searches/hooks/useSearchCriteriaFilters.ts`

# Responsibilities

- Load property/location taxonomy when missing from `usePropertyStore`.
- Own draft fields for location, budget, area, plot, and cadastral inputs.
- Multi-select areas via `parseSearchLocationValues` / `serializeSearchLocationValues`.
- Return `SearchCriteriaFieldsProps` for the form UI.

# Exports

- `SearchCriteriaFieldsProps`
- `useSearchCriteriaFilters`

# Actions / Inputs

- `onLocationOptionSelect` — add an encoded `city|area` value.
- `onLocationRemove` — drop a chip and rewrite `city` / `locations`.
- `onLocationCommit` — match typed label to a suggestion and add it.

# Dependencies

- [propertySearchLocations.utils.md](../../property/utils/propertySearchLocations.utils.md)
- [SearchCriteriaForm.md](../components/SearchCriteriaForm.md)
