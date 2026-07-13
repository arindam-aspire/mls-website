# File Overview

Feature or shared UI component.

**Source:** `src/components/ui/popover/index.tsx` (Client Component)

# Responsibilities

- Wrap Headless UI popover primitives with shared MLS styling and RTL-aware defaults.
- Provide a reusable `PopoverButton` trigger with project button sizing, semantic color tokens, and hydration-warning suppression for browser extensions that inject client-only attributes.
- Expose `PopoverPanel` helpers for anchored and fullscreen overlays.

# Imports

- `import { cn } from "@/src/lib/cn"`
- `import { isRtlLocale } from "@/src/i18n/routing"`

# Exports

- `PopoverGroup`
- `Popover`
- `PopoverButton`
- `PopoverBackdrop`
- `PopoverPanel`
- `PopoverHeader`
- `PopoverTitle`
- `PopoverContent`

# State Management

_No significant state; presentational or config module._

# API Usage

_N/A unless extended._

# Navigation

_No direct navigation._

# Props / Parameters

- See component/handler props in source (TypeScript interfaces).

# Actions / Inputs

## Inputs

- `PopoverButton` accepts Headless UI popover trigger props plus shared class names.
- `PopoverPanel` accepts `anchor`, `fullScreen`, `modal`, and `transition` behavior.

## Actions

- Trigger press toggles the popover open/closed through Headless UI state management.
- Fullscreen panels render through a portal and default to modal behavior.

## Validations

- `_N/A_`

## Show/Hide Controls

- `PopoverPanel` resolves a locale-aware default anchor: `bottom start` for LTR and `bottom end` for RTL.

# UI Details

- **Theme:** semantic tokens (`bg-page`, `bg-surface`, `text-text`, `text-muted`, `bg-primary`, `border-secondary/15`).
- **Light/dark:** via `ThemeProvider` / `html.light` | `html.dark`.
- **Radius:** `rounded-lg` controls; `rounded-xl` cards/modals/popovers; `rounded-full` avatars/pills.
- **Responsive:** mobile-first (`sm:`, `md:`, `lg:`).
- **Headless UI** primitives where applicable.

# Flow Description

1. `Popover` and `PopoverGroup` wrap the matching Headless UI primitives with shared classes.
2. `PopoverButton` renders the trigger with shared control styling and `suppressHydrationWarning` so extension-injected attributes like `fdprocessedid` do not cause React hydration mismatch warnings.
3. `PopoverPanel` chooses an RTL-aware default anchor unless an explicit anchor is provided.
4. When `fullScreen` is enabled, the panel becomes a portal-backed modal sheet with page-level layout classes.

# Dependencies

- Parent feature or route that imports this file.
- See **Imports** for direct module dependencies.

# Notes

- `suppressHydrationWarning` is intentionally limited to the trigger element so real content mismatches elsewhere still surface during development.
- Keep in sync when `src/components/ui/popover/index.tsx` changes.
