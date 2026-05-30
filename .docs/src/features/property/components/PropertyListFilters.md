# File Overview

Filter bar for the property list: Buy/Rent toggle, category dropdown, type dropdown, and location input. Fully controlled via props.

**Source:** `src/features/property/components/PropertyListFilters.tsx`

# Responsibilities

- Render status segmented control (`ToggleButton`).
- Render category and type `SelectDropdown` controls.
- Render location `Input` with map pin icon.
- Emit changes via parent callbacks (no local filter state).

# Imports

- `ToggleButton`, `SelectDropdown`, `Input` from `@/src/components/ui`

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
| `location` | Location search draft value |
| `onLocationChange` | Updates location draft while typing |
| `onLocationCommit` | Commits location to URL (blur / Enter) |
| `onResetSearch` | Reset URL to default search params |
| `onAdvanceSearch?` | Opens upcoming-feature modal (`Advance Search`) |
| `onSaveSearch?` | Opens upcoming-feature modal (`Save Search`) |
| `disabled?` | Disable all controls while taxonomy loads |
| `*AriaLabel`, `*Placeholder` | Optional a11y / placeholder copy |

# Actions / Inputs

- Buy / Rent toggle
- Category dropdown
- Type dropdown
- Location text input (commits on blur or Enter)
- **Reset Search** — resets URL to defaults (clears `location` and other optional params)
- Advance Search / Save Search — open [UpcomingFeatureModal](../../../components/common/UpcomingFeatureModal.md) via hook handlers

# UI Details

- **Outer layout:** `grid-cols-1` until `lg:grid-cols-8` (`lg:col-span-5` filters + `lg:col-span-3` slot); gaps `gap-2` → `md:gap-4` → `lg:gap-6`
- **Inner filters grid:** `grid-cols-1` → `md:grid-cols-4` → `lg:grid-cols-5`; each control `col-span-1`
- **Location input:** `Input` — `variant="outline"`, `MapPin` icon end
- **Action buttons:** Advance Search (`primary` solid), Reset Search (`inherit` outline), Save Search (`secondary` outline); icons `SlidersHorizontal`, `RotateCcw`, `Bookmark`; `rounded-lg`
- **Dropdowns:** `SelectDropdown` — `variant="outline"`, `rounded-xl` trigger (UI default)
- **Theme:** semantic tokens via shared UI components

# Flow Description

1. Parent passes current filter values and taxonomy-driven options.
2. User changes status, category, type, or location.
3. Component calls the matching callback; parent updates URL/store and refetches (location commits on blur or Enter).

# Dependencies

- [../hooks/usePropertyList.md](../hooks/usePropertyList.md) — builds `filters` prop object
- [../screens/PropertyListScreen.md](../screens/PropertyListScreen.md)

# Notes

- Type options depend on selected category (parent responsibility).
- Category change should reset type (handled in hook).
