# File Overview

Encode/decode helpers for budget range values used by `BudgetSelect` and URL params.

**Source:** `src/components/ui/budget-select/utils.ts`

# Responsibilities

- `encodeBudgetRange(min?, max?)` → `"min:max"` string or empty sentinel.
- `decodeBudgetRange(value)` → `{ min?, max? }`.
- `resolveBudgetRangeValue(min, max, options)` → matching option value or empty sentinel.
- `formatBudgetAmount(number)` → grouped integer string for labels.

# Exports

- `encodeBudgetRange`, `decodeBudgetRange`, `resolveBudgetRangeValue`, `formatBudgetAmount`

# Notes

- Empty segments in encoded strings mean open-ended min or max (e.g. `:50000` = up to 50,000).
