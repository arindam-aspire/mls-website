# File Overview

Parse and serialize property-search area selections. Add Property uses single `area_id`; property search / saved search areas are multi-select.

**Source:** `src/features/property/utils/propertySearchLocations.utils.ts`

# Responsibilities

- `parseSearchLocationValues(city, locations)` — hydrate encoded `city|area` values from URL/saved-search params.
  - Pipe-encoded multi: `locations=city|area,city|area`
  - Legacy comma areas with a single city
  - Legacy single city + area name
- `serializeSearchLocationValues(values)` — one area keeps legacy `city` + `locations=areaName`; two or more emit comma-joined encoded values.

# Exports

- `parseSearchLocationValues`
- `serializeSearchLocationValues`

# Dependencies

- [usePropertySearchFilters.md](../hooks/usePropertySearchFilters.md)
- [useSearchCriteriaFilters.md](../../saved-searches/hooks/useSearchCriteriaFilters.md)
