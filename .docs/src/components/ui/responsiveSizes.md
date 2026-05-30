# File Overview

Shared mobile-first size tokens for UI controls. Compact below `sm`; full scale from `sm` up.

**Source:** `src/components/ui/responsiveSizes.ts`

# Responsibilities

- Centralize viewport-responsive **heights**, padding, and gaps for buttons, fields, toggles, links, and dropdown panels.
- Import **text** scales from [`typography.ts`](../../lib/typography.md) (`controlTextClasses`, field labels, dropdown text).
- Keep component `size` props (`sm` | `md` | `lg`) unchanged — only screen width affects compact vs full sizing.

# Imports

- `@/src/lib/typography` — text tokens re-exported where needed

# Exports

| Export | Used by |
| --- | --- |
| `buttonSizeClasses`, `buttonIconSizeClasses` | `Button` |
| `iconButtonSizeClasses`, `iconButtonIconSizeClasses` | `IconButton` |
| `fieldControlSizeClasses`, `fieldIconSizeClasses` | `Input`, `SelectDropdown` |
| `selectTriggerSizeClasses`, `selectLeadingIconPositionClasses`, `selectTriggerLeadingIconPaddingClasses` | `Select` |
| `selectOptionSizeClasses` | Select options |
| `textareaSizeClasses` | `Textarea` |
| `toggleContainerSizeClasses`, `toggleSegmentSizeClasses`, `toggleIconSizeClasses` | `ToggleButton` |
| `linkSizeClasses`, `linkIconSizeClasses` | `Link` |
| `budgetShellSizeClasses`, `budgetCurrencyPaddingClasses`, `budgetTriggerPaddingClasses` | `BudgetSelect`, `BudgetField` |
| `dropdownPanelSizeClasses`, `dropdownOptionSizeClasses` | Dropdowns |
| `fieldLabelSizeClasses`, `fieldErrorSizeClasses`, `fieldHintSizeClasses` | Form fields (from typography) |
| `phoneInputShellSizeClasses`, … | `PhoneInput` |
| `heroCarouselShellSizeClasses`, … | Property carousel controls |

# UI Details

- **Heights (`size="md"`):** `h-8` → `sm:h-11` (32px → 44px).
- **Text:** paired with `controlTextClasses` — `text-xs` → `sm:text-sm` for `md` tier.

# Notes

- To adjust mobile density app-wide, edit `typography.ts` (text) and this file (heights/padding).
- See also [fieldVariants.md](./fieldVariants.md).
