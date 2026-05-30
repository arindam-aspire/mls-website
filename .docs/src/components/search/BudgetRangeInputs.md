# File Overview

Inner budget panel: min/max numeric inputs, suggestion list, Reset and Done.

**Source:** `src/components/search/BudgetRangeInputs.tsx`

# Exports

- `BudgetRangeInputs`

# Actions / Inputs

- Min/max number inputs — digits only; minus blocked; clamped to opposite bound.
- Suggestion list on focus — filtered by min/max rules from `budget.utils.ts`.
- **Reset** — `onReset()` + dismiss suggestions.
- **Done** — `onDone()` only (parent closes panel).

# UI Details

- **`variant="dropdown"` (default):** panel min-width 260px; `rounded-xl` card shell; `text-xs`.
- **`variant="sheet"`:** no outer card border/shadow; padded content for bottom sheet body.
- Input height 36px (`h-9`); labels uppercase tracked.
