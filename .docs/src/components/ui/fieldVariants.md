# File Overview

Feature or shared UI component.

**Source:** `src/components/ui/fieldVariants.ts`

# Responsibilities

- Feature or shared UI component.

# Imports

- `import { cn } from "@/src/lib/cn"`

# Exports

- `inheritOutlineVariantClasses`
- `inheritOutlineFocusWithinClasses`
- `inheritOutlineFocusVisibleClasses`
- `inheritOutlineDataHoverClasses`

# State Management

_No significant state; presentational or config module._

# API Usage

_N/A unless extended._

# Navigation

_No direct navigation._

# Props / Parameters

_N/A — non-component module._

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

# Flow Description

See source in `src/components/ui/fieldVariants.ts` for step-by-step behavior aligned with [application.md](../../application.md) (path relative may vary).

# Dependencies

- Parent feature or route that imports this file.
- See **Imports** for direct module dependencies.

# Notes

- Keep in sync when `src/components/ui/fieldVariants.ts` changes.
