# File Overview

Standalone search field aligned with `Input` variants, sizing, and field chrome (label, error, hint).

**Source:** `src/components/ui/search-input/index.tsx` (Client Component)

# Responsibilities

- Same `variant` map as `Input`: `outline` (default), `ghost`, `clear`.
- Same control shell: `fieldControlSizeClasses`, `rounded-xl`, error ring styles.
- Leading **Search** icon; trailing **Clear** when value is non-empty.

# Exports

- `SearchInput` (`forwardRef`)
- `SearchInputProps`, `SearchInputSize`, `SearchInputVariant`
- `SEARCH_INPUT_SIZES`, `SEARCH_INPUT_VARIANTS` (aliases of `Input` constants)

# Props / Parameters

Mirrors `Input` plus search-specific props:

| Prop | Notes |
| --- | --- |
| `variant` | `outline` \| `ghost` \| `clear` — default `outline` |
| `size` | `sm` \| `md` \| `lg` — default `md` |
| `label`, `error`, `hint`, `isRequired` | Same as `Input` |
| `placeholder`, `clearLabel` | Required |
| `aria-label` | Required when `label` is omitted |
| `onClear` | Optional callback after clear |

# UI Details

- Variant styles from `fieldVariants` + same classes as `src/components/ui/input/index.tsx`.
- Clear button: `rounded-lg`, `hover:bg-page`, `focus-visible:ring-secondary/40`.

# Dependencies

- `../input/types`, `../fieldVariants`, `../responsiveSizes`
- `src/layouts/protected-layout/ProtectedHeader.tsx`

# Notes

- Does not compose `Input`; duplicates its field shell so the clear affordance stays native to search.
