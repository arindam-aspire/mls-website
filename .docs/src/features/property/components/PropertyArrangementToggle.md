# File Overview

Toggle control for DLS arrangement selection: **Properties** vs **Land**.

**Source:** `src/features/property/components/PropertyArrangementToggle.tsx`

# Responsibilities

- Presentational wrapper around shared `ToggleButton`.
- Accepts arrangement options and calls `onChange` with `PropertyArrangementId`.

# Props

| Prop | Type | Notes |
| --- | --- | --- |
| `value` | `PropertyArrangementId` | Current arrangement |
| `onChange` | `(value) => void` | Arrangement change |
| `items` | `ToggleButtonItem[]` | Localized labels |
| `ariaLabel` | `string` | a11y label |
| `disabled` | `boolean?` | Optional |
| `className` | `string?` | Optional |

# UI Details

- Uses `ToggleButton` with `rounded` / size from shared UI (`rounded-lg` controls).
- Semantic tokens via ToggleButton variants.

# Dependencies

- Used by property list filters, saved-search criteria, and property create setup step.
