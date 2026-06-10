# File Overview

Shared option lists and amenity URL helpers for advanced property list filters.

**Source:** `src/features/property/constants/propertyListAdvancedFilters.constants.ts`

# Exports

- `BEDROOMS_OPTIONS`, `BATHROOMS_OPTIONS`, `PARKING_OPTIONS`, `PROPERTY_AGE_OPTIONS`
- `ADVANCED_AMENITY_OPTIONS` — `{ slug, label }[]` for checkboxes
- `AMENITY_SLUGS` — `["alarm-system", "parking-available"]`
- `parseAmenitiesParam(value)` — comma-separated string → `Set<string>` (unknown slugs ignored)
- `serializeAmenitiesParam(values)` — `Set<string>` → canonical string, e.g. **`alarm-system,parking-available`**
- `normalizeAmenitiesParam(value)` — parse + re-serialize for URL/API
- `hasAdvancedFilters(params)` — true when any advanced URL param is set

# Notes

- **Bedrooms / bathrooms:** dropdown values `"1"` … `"10"`.
- **Parking:** dropdown values `"1"` … `"5"`.
- **Property age:** `new`, `1-5`, `5-10`, `10-20`, `20+` (labels: New, 1-5 years, …).
- URL and API use **comma-separated slugs** for amenities only (no spaces around commas required; trimmed on read).
- Amenity order is fixed: `alarm-system` then `parking-available` when both are selected.

# Dependencies

- Used by `PropertyListAdvancedFilters`, `usePropertySearchFilters`, URL param utils, and saved-search builders.
