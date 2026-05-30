# File Overview

Filter bar for the property list: Buy/Rent toggle, category dropdown, and type dropdown. Fully controlled via props.

**Source:** `src/features/property/components/PropertyListFilters.tsx`

# Responsibilities

- Render status segmented control (`ToggleButton`).
- Render category and type `SelectDropdown` controls.
- Emit changes via parent callbacks (no local filter state).

# Imports

- `ToggleButton`, `SelectDropdown` from `@/src/components/ui`

# Exports

- `PropertyListFilters`
- `PropertyListFiltersProps`

# State Management

_Stateless — all values and handlers from props (typically `usePropertyList` → `filters`)._

# API Usage

_No direct API calls._

# Navigation

_No direct navigation._

# Props / Parameters

| Prop | Purpose |
| --- | --- |
| `status` | Current Buy/Rent value |
| `statusOptions` | Toggle items |
| `onStatusChange` | Status change handler |
| `category` | Selected category slug |
| `categoryOptions` | Category dropdown options |
| `onCategoryChange` | Category change handler |
| `type` | Selected type slug or empty sentinel |
| `typeOptions` | Type dropdown options (from taxonomy) |
| `onTypeChange` | Type change handler |
| `onResetSearch` | Reset URL to default search params |
| `onAdvanceSearch?` | Opens upcoming-feature modal (`Advance Search`) |
| `onSaveSearch?` | Opens upcoming-feature modal (`Save Search`) |
| `disabled?` | Disable all controls while taxonomy loads |
| `*AriaLabel`, `*Placeholder` | Optional a11y / placeholder copy |

# Actions / Inputs

- Buy / Rent toggle
- Category dropdown
- Type dropdown
- **Reset Search** — resets URL to `status=buy&category=residential&sort=newest&page=1&pageSize=10` (clears other params)
- Advance Search / Save Search — open [UpcomingFeatureModal](../../../components/common/UpcomingFeatureModal.md) via hook handlers

# UI Details

- **Outer layout:** `grid-cols-1` until `lg:grid-cols-8` (`lg:col-span-5` filters + `lg:col-span-3` slot); gaps `gap-2` → `md:gap-4` → `lg:gap-6`
- **Inner filters grid:** `grid-cols-1` → `md:grid-cols-4` → `lg:grid-cols-5`; each control `col-span-1`
- **Action buttons:** Advance Search (`primary` solid), Reset Search (`inherit` outline), Save Search (`secondary` outline); icons `SlidersHorizontal`, `RotateCcw`, `Bookmark`; `rounded-lg`
- **Dropdowns:** `SelectDropdown` — `variant="outline"`, `rounded-xl` trigger (UI default)
- **Theme:** semantic tokens via shared UI components

# Flow Description

1. Parent passes current filter values and taxonomy-driven options.
2. User changes status, category, or type.
3. Component calls the matching callback; parent updates URL/store and refetches.

# Dependencies

- [../hooks/usePropertyList.md](../hooks/usePropertyList.md) — builds `filters` prop object
- [../screens/PropertyListScreen.md](../screens/PropertyListScreen.md)

# Notes

- Type options depend on selected category (parent responsibility).
- Category change should reset type (handled in hook).
