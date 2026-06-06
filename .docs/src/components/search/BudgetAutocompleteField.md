# BudgetAutocompleteField

## File Overview

Single **min** or **max** budget control with dropdown suggestion autocomplete — same suggestion logic as [BudgetRangeInputs.md](./BudgetRangeInputs.md), styled like a form field for inline grids.

**Source:** `src/components/search/BudgetAutocompleteField.tsx`

## Props

| Prop | Type | Notes |
| --- | --- | --- |
| `mode` | `"min" \| "max"` | Which bound this field edits |
| `value` | `string` | Digit string |
| `peerValue` | `string?` | Opposite bound for filtering suggestions |
| `rentMode` | `boolean?` | Rent vs buy suggestion presets |
| `suggestions` | `readonly string[]?` | Override default buy/rent lists |
| `onChange` | `(value: string) => void` | Sanitized updates |
| `onCommit` | `() => void?` | Blur / Enter / suggestion pick |

## UI Details

- Outline field shell (`rounded-lg`), label via `fieldLabelSizeClasses`
- Focus opens [BudgetSuggestionList.md](./BudgetSuggestionList.md) (`anchored`)
- Filters: peer min/max bounds + typed query (`filterBudgetSuggestionsByQuery`)

## Usage

```tsx
<BudgetAutocompleteField
  label={t("minBudget")}
  mode="min"
  value={budgetMin}
  peerValue={budgetMax}
  rentMode={status === "rent"}
  onChange={onBudgetMinChange}
  onCommit={onBudgetCommit}
/>
```

Used in [SearchCriteriaForm.md](../../features/saved-searches/components/SearchCriteriaForm.md) row 3.
