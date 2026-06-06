# parseSavedSearchCriteriaToParams

## File Overview

Maps API `SavedSearchCriteria` (string fields) into in-form `SearchCriteriaParams` (typed numbers where applicable) for edit mode in [SearchCriteriaForm.md](../components/SearchCriteriaForm.md).

**Source:** `src/features/saved-searches/utils/parseSavedSearchCriteriaToParams.ts`

## Exports

- `parseSavedSearchCriteriaToParams(criteria)` → `SearchCriteriaParams`

## Notes

- Falls back to `DEFAULT_SEARCH_CRITERIA_PARAMS` for missing `status` / `category`.
- Numeric strings (`budgetMin`, `bedrooms`, area fields, etc.) are parsed with `Number`; invalid values become `undefined`.
