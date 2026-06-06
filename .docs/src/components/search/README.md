# Search components (`src/components/search/`)

Property-search filter primitives: portaled budget range picker and anchored dropdown shell.

## Modules

| File | Export | Role |
| --- | --- | --- |
| [BudgetField.md](./BudgetField.md) | `BudgetField` | Trigger + dropdown wiring |
| [BudgetAutocompleteField.md](./BudgetAutocompleteField.md) | `BudgetAutocompleteField` | Single min/max field with suggestion dropdown |
| [BudgetRangeInputs.md](./BudgetRangeInputs.md) | `BudgetRangeInputs` | Min/max inputs, suggestions, Reset/Done |
| [BudgetSuggestionList.md](./BudgetSuggestionList.md) | `BudgetSuggestionList` | Shared suggestion listbox |
| [AnchoredDropdown.md](./AnchoredDropdown.md) | `AnchoredDropdown` | Body-portaled popover anchored to trigger |
| [budget.utils.md](./budget.utils.md) | helpers | Sanitize, format, URL hydrate, suggestion filters |

## Usage

```tsx
import { BudgetField } from "@/src/components/search";
```

Integrated in [PropertyListFilters.md](../../features/property/components/PropertyListFilters.md).

## Conventions

- Budget min/max stored as **digit strings** in UI state.
- URL params: `budgetMin`, `budgetMax` (legacy `minPrice` / `maxPrice` on hydrate).
- Rent mode: yearly labels + rent suggestion presets.
- Semantic theme tokens; `rounded-lg` controls; `rounded-xl` panel.
