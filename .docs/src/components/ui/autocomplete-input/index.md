# AutocompleteInput

**Source:** `src/components/ui/autocomplete-input/index.tsx`

# Responsibilities

- Combobox text field with client-side option filtering by label.
- Supports controlled `inputValue` / `onInputChange` and selected `value` / `onOptionSelect`.
- Used for location search (area, city) on landing hero and property list filters.

# UI Details

- Control: `rounded-lg` (matches Input).
- Dropdown panel: full width of the input (`static` + `absolute inset-x-0`), `rounded-xl`, `bg-surface`, `border-secondary/15`.
- Options: `rounded-lg`, focus/hover `bg-primary-light`, selected state `text-primary-dark`.
- Match highlighting: query substring in each option uses `bg-primary-light` + `text-primary` via `HighlightedLabel`.
- List closes after a committed selection (label matches chosen option), on outside click, blur, or Escape; reopens when the user edits the text again.
- Variants: `outline`, `ghost`, `clear` (aligned with Input).

# Props (highlights)

| Prop | Purpose |
| --- | --- |
| `options` | `{ value, label }[]` |
| `inputValue` / `onInputChange` | Controlled search text |
| `value` / `onOptionSelect` | Selected option |
| `minCharsToShow` | Minimum typed chars before showing panel (default `0`) |
| `maxOptions` | Cap filtered results (default `20`) |
