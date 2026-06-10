# File Overview

Expandable **Advanced Search** panel for the property list filter bar. Fields are **conditional** on selected **category** (`residential` | `commercial` | `land`) and, for several controls, on the selected **property type** slug.

**Source:** `src/features/property/components/PropertyListAdvancedFilters.tsx`

# Responsibilities

- Render labeled advanced filter controls in a responsive grid; only show fields applicable to current category/type.
- **Below `md`:** bottom sheet (Headless UI `Dialog`); **`md`+:** inline panel when `open`.
- Amenity checkboxes rendered only for slugs returned by `getVisibleAmenitySlugs(category, type)`.
- All user-facing labels via `useTranslations("propertyList.advanced")`.

# Imports

- `Input`, `SelectDropdown` from `@/src/components/ui`
- `useMatchMedia`, Headless UI dialog primitives
- Option presets from `../constants/propertyListAdvancedFilters.constants`
- Visibility helpers from `../utils/propertyAdvancedFieldVisibility`

# Props / Parameters

| Prop | Notes |
| --- | --- |
| `category` | Active category slug — drives category-only fields |
| `type` | Active type slug or empty — drives type-dependent fields |
| Scalar fields | bedrooms/rooms, bathrooms, parking, areas, plot areas, governorate/directorate/village, parcelName, propertyAge, floorLevel, furnitureStatus |
| `selectedAmenities` | Parsed amenity slug list |
| Handlers | Change/commit callbacks per field; `onAmenityChange(slug, checked)` |

# Actions / Inputs

See [propertyAdvancedFieldVisibility.md](../utils/propertyAdvancedFieldVisibility.md) for the full field matrix. URL keys include `bedrooms`, `rooms`, `bathrooms`, `parking`, `minArea`, `maxArea`, `minPlotArea`, `maxPlotArea`, `governorate`, `directorate`, `village`, `parcelName`, `propertyAge`, `floorLevel`, `furnitureStatus`, and comma-separated `amenities` (camelCase slugs).

# Dependencies

- [PropertyListFilters.md](./PropertyListFilters.md)
- [propertyAdvancedFieldVisibility.md](../utils/propertyAdvancedFieldVisibility.md)
- [../hooks/usePropertyList.md](../hooks/usePropertyList.md)
