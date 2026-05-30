# File Overview

Default budget range presets for Buy (sale) and Rent listings.

**Source:** `src/components/ui/budget-select/ranges.ts`

# Responsibilities

- Export `BUY_BUDGET_OPTIONS` — JOD sale price bands (50k–500k+).
- Export `RENT_BUDGET_OPTIONS` — monthly rent bands (300–2000+).

# Exports

- `BUY_BUDGET_OPTIONS`
- `RENT_BUDGET_OPTIONS`

# Notes

- Labels use `formatBudgetAmount` from `utils.ts` (en-US grouping, no decimals).
- Parent switches option set when search `status` toggles Buy vs Rent.
