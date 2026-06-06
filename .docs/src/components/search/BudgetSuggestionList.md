# BudgetSuggestionList

## File Overview

Shared listbox of formatted budget suggestions for min/max budget inputs.

**Source:** `src/components/search/BudgetSuggestionList.tsx`

## Props

| Prop | Type | Notes |
| --- | --- | --- |
| `values` | `string[]` | Suggestion amounts (digit strings) |
| `selectedValue` | `string` | Current value for `aria-selected` |
| `onSelect` | `(value: string) => void` | Pick handler |
| `anchored` | `boolean?` | `true` — absolute panel under field; `false` — in-panel flow ([BudgetRangeInputs.md](./BudgetRangeInputs.md)) |

## Dependencies

- [budget.utils.md](./budget.utils.md) — `formatBudgetAmount`
