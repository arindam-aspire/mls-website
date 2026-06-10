# File Overview

Accessible checkbox control with custom indicator styling, plus `CheckboxField` for label + checkbox rows.

**Source:** `src/components/ui/checkbox/index.tsx` (Client Component)

# Responsibilities

- Render a square checkbox with rounded corners, primary fill, and white checkmark when checked.
- `Checkbox` — standalone control (`aria-label` when no visible label).
- `CheckboxField` — associates a text label with the checkbox via `htmlFor` / `id`.

# Imports

- `lucide-react` — `Check` icon
- `@/src/lib/cn`, `checkboxLabelClasses`

# Exports

- `Checkbox`, `CheckboxField`
- `CHECKBOX_COLORS`, `CHECKBOX_SIZES`
- Types: `CheckboxColor`, `CheckboxFieldProps`, `CheckboxProps`, `CheckboxSize`

# Props / Parameters

## `Checkbox`

| Prop | Type | Default |
| --- | --- | --- |
| `checked` | `boolean` | — |
| `onChange` | `(checked: boolean) => void` | — |
| `disabled` | `boolean` | `false` |
| `color` | `"primary"` \| `"secondary"` | `"primary"` |
| `size` | `"sm"` \| `"md"` | `"sm"` |
| `aria-label` | `string` | — |

## `CheckboxField`

| Prop | Type | Default |
| --- | --- | --- |
| `label` | `ReactNode` | — |
| `checked` | `boolean` | — |
| `onChange` | `(checked: boolean) => void` | — |
| `disabled` | `boolean` | `false` |
| `color` / `size` | same as `Checkbox` | `"primary"` / `"sm"` |

# UI Details

- **Box:** `rounded` (not `rounded-lg` — compact control), `border-secondary/25`, `bg-surface`.
- **Checked:** `bg-primary` + white `Check` icon (`color="primary"`).
- **Focus:** `focus-visible` ring on indicator via `group-has-[:focus-visible]/checkbox`.
- **Label:** `checkboxLabelClasses` on `CheckboxField`.

# Dependencies

- [MyListingFilters.md](../../../features/property/components/MyListingFilters.md) — column picker popover
- Re-exported from `src/components/ui/index.tsx`
