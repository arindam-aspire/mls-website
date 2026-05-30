# File Overview

Expandable **Advanced Search** panel for the property list filter bar: bedrooms, bathrooms, parking, area range, property age, and amenity checkboxes.

**Source:** `src/features/property/components/PropertyListAdvancedFilters.tsx`

# Responsibilities

- Render labeled advanced filter controls in a responsive grid (`md:grid-cols-4`, `lg:grid-cols-6`).
- **Below `md` (`max-width: 767px`):** render as a **bottom sheet** (Headless UI `Dialog`, slide-up panel, backdrop, drag handle, close button).
- **`md` and up:** render inline below the filter bar when `open` is true (unchanged expandable panel).
- Fields block wrapped with explicit **`border-t border-b border-secondary/15`** on inline layout; sheet uses padded content without side borders.
- Six fields on `md`+ (four per row on `md`, six on `lg`); amenity checkboxes below without the border wrapper.

# Imports

- `Input`, `SelectDropdown` from `@/src/components/ui`
- `useMatchMedia` from `@/src/hooks/useMatchMedia`
- Headless UI `Dialog`, `DialogBackdrop`, `DialogPanel`, `DialogTitle`, `CloseButton`
- Option presets from `./propertyListAdvancedFilters.constants`

# Exports

- `PropertyListAdvancedFilters`
- `PropertyListAdvancedFiltersProps`

# Props / Parameters

| Prop | Type | Notes |
| --- | --- | --- |
| `open` | `boolean` | Controls visibility (inline panel or bottom sheet) |
| `onClose` | `() => void` | Backdrop, close button, Escape — sheet on mobile |
| `title` | `string?` | Sheet header; default `"Advanced Search"` |
| … | filter fields | Same as before (bedrooms, amenities handlers, etc.) |

# State Management

_Stateless filter values from parent; `useMatchMedia('(max-width: 767px)')` picks layout._

# API Usage

_Updates URL search params through parent handlers (`bedrooms`, `bathrooms`, `parking`, `propertyAge`, `minArea`, `maxArea`, `amenities`)._

# Actions / Inputs

| Control | URL param | Behavior |
| --- | --- | --- |
| Bedrooms | `bedrooms` | Dropdown 1–10; placeholder "All Rooms" clears param |
| Bathrooms | `bathrooms` | Dropdown 1–10; placeholder "All Baths" clears param |
| Parking | `parking` | Dropdown 1–5; placeholder "All Parking" clears param |
| Min Area | `minArea` | Numeric input; commits on blur/Enter |
| Max Area | `maxArea` | Numeric input; commits on blur/Enter |
| Property Age | `propertyAge` | Dropdown: New, 1-5 years, 5-10 years, 10-20 years, 20+ years |
| Alarm System / Parking Available | `amenities` | Comma-separated slugs, e.g. `alarm-system,parking-available` |

# UI Details

- **Below `md`:** bottom sheet — `z-[80]`, `rounded-t-xl`, max height `90dvh`, scrollable body, semantic tokens, light/dark.
- **Inline (`md`+):** fields block **`border-t border-b border-secondary/15`**; **`md`:** four fields per row; **`lg`:** six in one row.
- Sheet: two-column field grid from `sm` within the sheet viewport; checkboxes below with padding.
- Checkboxes on the row below; semantic tokens, light/dark.

# Dependencies

- [PropertyListFilters.md](./PropertyListFilters.md) — toggles panel visibility
- [propertyListAdvancedFilters.constants.md](./propertyListAdvancedFilters.constants.md)
- [../hooks/usePropertyList.md](../hooks/usePropertyList.md)
