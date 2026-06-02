# File Overview

Feature or shared UI component.

**Source:** `src/components/ui/select-dropdown/index.tsx` (Client Component)

# Responsibilities

- Feature or shared UI component.

# Imports

- `import { cn } from "@/src/lib/cn"`
- `import { isRtlLocale } from "@/src/i18n/routing"`

# Exports

- `SelectDropdown`
- `SELECT_DROPDOWN_EMPTY_VALUE`
- `SELECT_DROPDOWN_SIZES`
- `SELECT_DROPDOWN_VARIANTS`

# State Management

- **React** `useState`

# API Usage

_N/A unless extended._

# Navigation

_No direct navigation._

# Props / Parameters

| Prop | Type | Default | Purpose |
| --- | --- | --- | --- |
| `options` | `SelectDropdownOption[]` | — | Selectable values |
| `placeholder` | `string` | — | Trigger text when no value; also first list option when `includePlaceholderOption` is true |
| `includePlaceholderOption` | `boolean` | `true` | When `false`, omit empty placeholder from the dropdown list (use when value is always set, e.g. mobile drawer language) |
| `value` / `onChange` | `string` | — | Controlled selection |
| `fullWidth` | `boolean` | `true` | Set `false` for compact trailing controls in settings rows |
| `listboxModal` | `boolean` | `true` | Pass `false` inside dialogs/drawers so the panel stacks above chrome without scroll-lock conflicts |

# Actions / Inputs

## Inputs

_No explicit inputs detected._

## Actions

_No explicit actions detected._

## Validations

_No explicit validations detected._

## Show/Hide Controls

_No explicit show/hide controls detected._

# UI Details

- **Theme:** semantic tokens (`bg-page`, `bg-surface`, `text-text`, `text-muted`, `bg-primary`, `border-secondary/15`).
- **Light/dark:** via `ThemeProvider` / `html.light` | `html.dark`.
- **Radius:** `rounded-lg` controls; `rounded-xl` cards/modals/popovers; `rounded-full` avatars/pills.
- **Responsive:** mobile-first (`sm:`, `md:`, `lg:`).
- **Options panel width:** matches the trigger via Headless UI `--button-width` (`w/min/max-w-(--button-width)`). Pass `panelClassName` only when a wider minimum is needed.
- **Options panel stacking:** portaled (`anchor` + `portal`), `z-[130]` (above mobile drawer `z-[120]`). Use `listboxModal={false}` inside drawers.

# Flow Description

See source in `src/components/ui/select-dropdown/index.tsx` for step-by-step behavior aligned with [application.md](../../application.md) (path relative may vary).

# Dependencies

- [PublicMobileMenu.md](../../../layouts/public-layout/PublicMobileMenu.md), [LandingMobileMenu.md](../../../layouts/landing-layout/LandingMobileMenu.md) — language row in mobile drawers.
- Filter bars ([PropertyListFilters.md](../../../features/property/components/PropertyListFilters.md), [HeroSearchBar.md](../../../features/landing/components/HeroSearchBar.md)).

# Notes

- Keep in sync when `src/components/ui/select-dropdown/index.tsx` changes.
