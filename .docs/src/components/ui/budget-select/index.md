# File Overview

Compound budget range selector: fixed **JD** currency prefix plus a Headless UI `Listbox` dropdown for min/max ranges. Used on property search filters (Buy vs Rent option sets).

**Source:** `src/components/ui/budget-select/index.tsx` (Client Component)

# Responsibilities

- Render a segmented control shell (`JD` | divider | range trigger) matching `PhoneInput` prefix + `SelectDropdown` patterns.
- Support controlled/uncontrolled value via encoded range strings (`min:max`, `:max`, `min:`).
- Provide default Buy and Rent option presets via `BUY_BUDGET_OPTIONS` / `RENT_BUDGET_OPTIONS`.
- Expose encode/decode helpers for URL `budgetMin` / `budgetMax` sync.

# Imports

- `@headlessui/react` — `Field`, `Label`, `Listbox`, …
- `lucide-react` — `ChevronDown`
- `next-intl` — `useLocale` for RTL anchor
- `@/src/lib/cn`, `@/src/i18n/routing`
- `../fieldVariants` — outline focus/variant classes

# Exports

- `BudgetSelect`
- `BUDGET_SELECT_EMPTY_VALUE`, `BUDGET_SELECT_SIZES`, `BUDGET_SELECT_VARIANTS`
- `BUY_BUDGET_OPTIONS`, `RENT_BUDGET_OPTIONS` (from `ranges.ts`)
- `decodeBudgetRange`, `encodeBudgetRange`, `formatBudgetAmount`, `resolveBudgetRangeValue` (from `utils.ts`)
- Types: `BudgetSelectOption`, `BudgetSelectProps`, `BudgetSelectSize`, `BudgetSelectVariant`

# State Management

- **React** `useState` for uncontrolled mode when `value` prop is omitted.

# API Usage

_N/A — presentational control; parent maps selection to API/URL params._

# Navigation

_No direct navigation._

# Props / Parameters

| Prop | Purpose |
| --- | --- |
| `options` | Range options (excluding placeholder; component prepends placeholder row) |
| `placeholder` | Shown when no range selected; also first listbox option value |
| `currencyLabel` | Prefix text (default `JD`) |
| `value` / `defaultValue` | Encoded range string |
| `onChange` | Called with encoded value or empty sentinel |
| `variant` | `outline` \| `ghost` \| `clear` |
| `size` | `sm` \| `md` \| `lg` |
| `disabled`, `error`, `hint`, `label`, `fullWidth`, className overrides | Same patterns as `SelectDropdown` |

# Actions / Inputs

## Inputs

- Budget range dropdown selection (includes placeholder / clear row).

## Actions

- Open dropdown, pick a range, or re-select placeholder to clear.

## Validations

- Optional `error` string renders alert below control.

# UI Details

- **Shell:** `rounded-lg` (control); **panel:** `rounded-xl` popover list.
- **Prefix:** muted `JD` + vertical divider + flex trigger.
- **Theme:** semantic tokens (`bg-surface`, `text-text`, `text-muted`, `border-secondary/15`).
- **RTL:** listbox anchor `bottom end` when locale is RTL.
- **Responsive:** `fullWidth` default; truncates long labels.

# Flow Description

1. Parent passes `options` (Buy or Rent presets) and controlled `value` from URL params.
2. User opens dropdown; first option clears selection (`BUDGET_SELECT_EMPTY_VALUE`).
3. Selecting a range calls `onChange` with encoded `min:max` string.
4. Parent decodes via `decodeBudgetRange` and writes `budgetMin` / `budgetMax` to URL.

# Dependencies

- [../select-dropdown/index.md](../select-dropdown/index.md) — shared Listbox/dropdown patterns
- [../phone-input/index.md](../phone-input/index.md) — prefix segment layout reference
- [../fieldVariants.md](../fieldVariants.md)

# Notes

- `resolveBudgetRangeValue` returns empty sentinel if URL min/max do not match a preset option.
- See [ranges.md](./ranges.md) and [types.md](./types.md) for option shapes and helpers.
