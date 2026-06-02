# File Overview

Shared mobile-first size tokens for UI controls. Moderate mobile scale; full scale from `sm` up; slightly roomier from `lg` up.

**Source:** `src/components/ui/responsiveSizes.ts`

# Responsibilities

- Centralize viewport-responsive **heights**, padding, and gaps for buttons, fields, toggles, links, and dropdown panels.
- Import **text** scales from [`typography.ts`](../../lib/typography.md) (`controlTextClasses`, field labels, dropdown text).
- Keep component `size` props (`sm` | `md` | `lg`) unchanged — only screen width affects standard vs roomy sizing.

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
| `toggleShellSizeClasses`, `toggleTrackInsetClasses`, `toggleBorderedTrackInsetClasses`, `toggleSegmentSizeClasses`, `toggleIconSizeClasses` | `ToggleButton` — outer shell height; inner track inset (`p-1` for bordered `solid`/`outline`, `p-0.5 sm:p-1` for `ghost`); segments stretch inside the track |
| `linkSizeClasses`, `linkIconSizeClasses` | `Link` |
| `budgetShellSizeClasses`, `budgetCurrencyPaddingClasses`, `budgetTriggerPaddingClasses` | `BudgetSelect`, `BudgetField` |
| `dropdownPanelSizeClasses`, `dropdownOptionSizeClasses` | Dropdowns |
| `fieldLabelSizeClasses`, `fieldErrorSizeClasses`, `fieldHintSizeClasses` | Form fields (from typography) |
| `phoneInputShellSizeClasses`, `phoneInputTrackClasses`, `phoneInputCountrySegmentSolidClasses`, `phoneInputCountrySegmentGhostClasses`, `phoneInputDividerClasses`, `phoneInputFieldPaddingClasses`, … | `PhoneInput` — outer shell + inset track; country segment has padding only (no fill) on `outline` variant |
| `heroCarouselShellSizeClasses`, … | Property carousel controls |

# UI Details

- **Heights (`size="md"`):** `h-9` → `sm:h-11` → `lg:h-12` (36px → 44px → 48px).
- **Text:** paired with `controlTextClasses` — `text-xs` → `sm:text-sm` for `md` tier.

# Notes

- To adjust control density app-wide, edit `typography.ts` (text) and this file (heights/padding).
- See also [fieldVariants.md](./fieldVariants.md).
