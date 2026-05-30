# File Overview

Type definitions and constants for `BudgetSelect`.

**Source:** `src/components/ui/budget-select/types.ts`

# Responsibilities

- Define `BudgetSelectOption` shape (`value`, `label`, optional `min`/`max`).
- Export variant/size unions and `BudgetSelectProps` interface.
- Define `BUDGET_SELECT_EMPTY_VALUE` sentinel for “no budget selected”.

# Exports

- `BUDGET_SELECT_EMPTY_VALUE`
- `BUDGET_SELECT_VARIANTS`, `BUDGET_SELECT_SIZES`
- `BudgetSelectVariant`, `BudgetSelectSize`, `BudgetSelectOption`, `BudgetSelectProps`

# Notes

- Option `value` uses `encodeBudgetRange` format: `"min:max"`, `":max"` (up to), or `"min:"` (from).
