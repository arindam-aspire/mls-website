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

- See component/handler props in source (TypeScript interfaces).

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
- **Options panel stacking:** `ListboxOptions` is portaled (Headless UI `anchor`) and uses `z-[100]` so options stay above modals (`z-50`) and bottom-sheet dialogs (`z-[80]`), e.g. the `PropertyListAdvancedFilters` mobile sheet. Only the toaster (`z-[9999]`) sits above it.

# Flow Description

See source in `src/components/ui/select-dropdown/index.tsx` for step-by-step behavior aligned with [application.md](../../application.md) (path relative may vary).

# Dependencies

- Parent feature or route that imports this file.
- See **Imports** for direct module dependencies.

# Notes

- Keep in sync when `src/components/ui/select-dropdown/index.tsx` changes.
