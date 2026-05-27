# File Overview

Feature or shared UI component.

**Source:** `src/features/landing/components/HeroSearchBar.tsx` (Client Component)

# Responsibilities

- Feature or shared UI component.

# Imports

- `import { ButtonGroup } from "@/src/components/ui/button-group"`
- `import { cn } from "@/src/lib/cn"`

# Exports

- `HeroSearchBar`

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

# Flow Description

See source in `src/features/landing/components/HeroSearchBar.tsx` for step-by-step behavior aligned with [application.md](../../application.md) (path relative may vary).

# Dependencies

- Parent feature or route that imports this file.
- See **Imports** for direct module dependencies.

# Notes

- Keep in sync when `src/features/landing/components/HeroSearchBar.tsx` changes.
