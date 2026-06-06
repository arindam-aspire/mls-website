# File Overview

Self-contained **saved search criteria** form for the add-new modal. Three top rows (title, filters, location/budget) plus advanced criteria below.

**Source:** `src/features/saved-searches/components/SearchCriteriaForm.tsx`

# Layout

1. **Row 1** — Search title (`Input`, full width)
2. **Row 2** — `SelectDropdown` grid (`md:grid-cols-3`): Looking For (Buy / Rent), category, type
3. **Row 3** — Location, Min Budget, Max Budget (`BudgetAutocompleteField`; buy/rent suggestions)
4. **Conditional criteria** — responsive grid (`md:grid-cols-4`), no section heading; amenities below when visible
5. **Footer** — Cancel, Reset, Save / Update (right-aligned)

# Dependencies

- [useSearchCriteriaForm.md](../hooks/useSearchCriteriaForm.md)
- [useSearchCriteriaFilters.md](../hooks/useSearchCriteriaFilters.md) — filter state, taxonomy; exports `SearchCriteriaFieldsProps`

# Notes

- Status uses `SelectDropdown` (not toggle); option labels from `savedSearches.criteria.statusBuy` / `statusRent`.
- Option constants: [searchCriteriaFilter.constants.md](../constants/searchCriteriaFilter.constants.md)
- Advanced field visibility: [searchCriteriaFieldVisibility.md](../utils/searchCriteriaFieldVisibility.md)
