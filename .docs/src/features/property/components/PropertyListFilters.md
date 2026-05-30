# File Overview

Filter bar for the property list: primary row (status, category, type, location, budget, actions) plus expandable **Advanced Search** panel.

**Source:** `src/features/property/components/PropertyListFilters.tsx`

# Responsibilities

- Render primary filter controls and action buttons.
- Toggle **Advanced Search** panel (`PropertyListAdvancedFilters`) via `open` / `onClose`.
- Auto-expand advanced panel when `hasAdvancedFilters` is true (URL has advanced params).
- Close advanced panel on **Reset Search**.

# Imports

- `BudgetField` from `@/src/components/search`
- `PropertyListAdvancedFilters` from `./PropertyListAdvancedFilters`
- `ToggleButton`, `SelectDropdown`, `Input`, `Button` from `@/src/components/ui`

# State Management

- Local: `isBudgetOpen`, `isAdvancedOpen` (initialized from `hasAdvancedFilters`).
- Filter values from props (`usePropertyList`).

# Actions / Inputs

- **Advanced Search** — toggles advanced panel; icon switches `SlidersHorizontal` ↔ `Minus`; `aria-expanded`.
- **Budget trigger** — opens min/max editor; **bottom sheet** below `md`, **anchored dropdown** on `md`+.
- **Done** (budget) — commits `budgetMin` / `budgetMax` to URL.
- **Reset Search** — clears URL filters to defaults and closes advanced panel; **`similar_to` is kept** when present.
- **Save Search** — still opens upcoming-feature modal (via hook).

# UI Details

- **Below `md`:** primary row scrolls horizontally; toggle **`8rem`**, other controls **`9rem`**; advanced filters open in a **bottom sheet** (not inline).
- **`md`–`lg`:** primary grid unchanged; advanced filters expand inline below the bar.
- **`lg`+:** eight-column primary row.
- Root wrapper: `relative isolate z-50` so dropdowns/advanced panel stack above list content (sticky bar on screen uses matching `z-50`).

# Dependencies

- [PropertyListAdvancedFilters.md](./PropertyListAdvancedFilters.md)
- [../hooks/usePropertyList.md](../hooks/usePropertyList.md)
- [../../../components/search/BudgetField.md](../../../components/search/BudgetField.md)
