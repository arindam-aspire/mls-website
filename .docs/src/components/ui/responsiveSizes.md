# File Overview

Shared mobile-first size tokens for UI controls. Compact below the `sm` viewport breakpoint; full scale from `sm` up.

**Source:** `src/components/ui/responsiveSizes.ts`

# Responsibilities

- Centralize viewport-responsive padding, height, and typography for buttons, fields, toggles, links, and dropdown panels.
- Keep component `size` props (`sm` | `md` | `lg`) unchanged — only screen width affects compact vs full sizing.

# Exports

| Export | Used by |
| --- | --- |
| `buttonSizeClasses`, `buttonIconSizeClasses` | `Button` |
| `iconButtonSizeClasses` | `IconButton` |
| `fieldControlSizeClasses`, `fieldIconSizeClasses` | `Input`, `SelectDropdown` |
| `selectTriggerSizeClasses`, `selectOptionSizeClasses` | `Select` |
| `textareaSizeClasses` | `Textarea` |
| `toggleContainerSizeClasses`, `toggleSegmentSizeClasses`, `toggleIconSizeClasses` | `ToggleButton` |
| `linkSizeClasses`, `linkIconSizeClasses` | `Link` |
| `budgetShellSizeClasses`, `budgetCurrencyPaddingClasses`, `budgetTriggerPaddingClasses` | `BudgetSelect` |
| `dropdownPanelSizeClasses`, `dropdownOptionSizeClasses` | `SelectDropdown`, `BudgetSelect` |
| `fieldLabelSizeClasses`, `fieldErrorSizeClasses`, `fieldHintSizeClasses` | Form field labels, errors, hints |
| `phoneInputShellSizeClasses`, `phoneInputTextSizeClasses`, … | `PhoneInput` |

# UI Details

- **Pattern:** shared `controlHeightClasses` — three **viewport** steps: default (< 640px), `sm:` (≥ 640px), `lg:` (≥ 1024px). Component `size` prop (`sm` | `md` | `lg`) is separate.
- **Example (`size="md"`):** `h-8` → `sm:h-11` → `lg:h-12` (32px → 44px → 48px).

# Notes

- To adjust mobile density app-wide, edit this file rather than individual components.
- See also [fieldVariants.md](./fieldVariants.md) for shared outline/focus styles.
