# File Overview

Budget range filter trigger + portaled panel. Used on property list filters.

**Source:** `src/components/search/BudgetField.tsx`

# Responsibilities

- Render JD badge, formatted range label, chevron trigger aligned to shared control height.
- **Below `md` (`max-width: 767px`):** open budget editor in a **bottom sheet** (Headless UI `Dialog`, slide-up, backdrop, close button).
- **`md` and up:** host `AnchoredDropdown` + `BudgetRangeInputs` as a portaled anchored panel.
- Support RTL, rent/buy labels, Done (commit + close), Reset (clear + URL).

# Imports

- `useMatchMedia` from `@/src/hooks/useMatchMedia`
- Headless UI `Dialog`, `DialogBackdrop`, `DialogPanel`, `DialogTitle`, `CloseButton`
- `AnchoredDropdown`, `BudgetRangeInputs`

# Flow Description

1. User opens panel → edits min/max digit strings with suggestions.
2. **Done** → `onCommit()` then `onClose()` (does not submit form; hook writes URL).
3. **Reset** → clears both values via `onReset()`.
4. Desktop: outside click closes panel without committing. Mobile sheet: backdrop / close / Escape via `onClose`.

# Dependencies

- [BudgetRangeInputs.md](./BudgetRangeInputs.md)
- [AnchoredDropdown.md](./AnchoredDropdown.md)
- [../ui/responsiveSizes.md](../ui/responsiveSizes.md)
