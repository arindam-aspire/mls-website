# File Overview

Category- and property-type-aware visibility rules for **Advanced Search** fields on the property list page. Determines which scalar filters and amenity checkboxes apply for `residential`, `commercial`, and `land`, and prunes URL params when category or type changes.

**Source:** `src/features/property/utils/propertyAdvancedFieldVisibility.ts`

# Responsibilities

- Expose `show*` helpers for each advanced field group (bedrooms vs rooms, plot area, governorate, type-dependent fields).
- `isAmenityVisible` / `getVisibleAmenitySlugs` — amenity checkbox visibility per category + type slug.
- `pruneAdvancedParamsForContext` — returns partial `PropertyListParams` updates to clear params that no longer apply after category/type change.

# Imports

- `SELECT_DROPDOWN_EMPTY_VALUE` from `@/src/components/ui`
- `PropertyListParams` from `../types/property.types`
- Amenity parse/serialize helpers from `../components/propertyListAdvancedFilters.constants`

# Exports

- Category field helpers: `showBedrooms`, `showRooms`, `showBathrooms`, `showParking`, `showMinMaxArea`, `showPropertyAge`, `showMinMaxPlotArea`, `showGovernorate`, `showDirectorate`, `showVillage`, `showFurnitureStatus`, `showFloorLevel`, `showParcelName`
- `isAmenityVisible`, `getVisibleAmenitySlugs`, `pruneAdvancedParamsForContext`

# Visibility rules (summary)

| Category | Always (no type required) | Type-dependent |
| --- | --- | --- |
| **residential** | bedrooms, bathrooms, parking, min/max area, property age, alarmSystem, parkingAvailable | furnitureStatus (apartment, villa), floorLevel (apartment, building), balcony, builtInCloset, garden, homeAutomation, gymAccess |
| **commercial** | rooms, bathrooms, parking, min/max area, property age, alarmSystem, parkingAvailable | floorLevel (building, office), loadingAccess, storageArea (warehouse), displayFrontage (shop, showroom), airConditioning |
| **land** | min/max plot area, governorate, directorate, village, roadAccess | parcelName (any land type when type selected), utilitiesAvailable, zonedUse, waterSource, electricityNearby (per land type) |

Amenity slugs use **camelCase** in the query string (`alarmSystem`, `parkingAvailable`, …). Legacy kebab-case values are normalized on parse.

# Dependencies

- [PropertyListAdvancedFilters.md](../components/PropertyListAdvancedFilters.md) — consumes visibility helpers for conditional UI
- [usePropertyList.md](../hooks/usePropertyList.md) — calls `pruneAdvancedParamsForContext` on category/type change

# Notes

- Type slugs match taxonomy API slugs (e.g. `business`, `residential-land`).
- When no property type is selected, only category-default advanced fields are shown; type-specific fields are hidden and pruned from the URL.
