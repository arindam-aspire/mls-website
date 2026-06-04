# File Overview

Project source module.

**Source:** `src/layouts/public-layout/PublicHeaderThemeButton.tsx` (Client Component)

# Responsibilities

- Light/dark toggle for desktop public header (`md+`), matching `ProtectedThemeButton` (`inherit`/`outline` rounded `IconButton`, `size-5` Moon/Sun).

# Imports

- `import { IconButton } from "@/src/components/ui/icon-button"`
- `import { useTheme, type ThemeMode } from "@/src/providers/ThemeProvider"`

# Exports

- `PublicHeaderThemeButton`

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

See source in `src/layouts/public-layout/PublicHeaderThemeButton.tsx` for step-by-step behavior aligned with [application.md](../../application.md) (path relative may vary).

# Dependencies

- Parent feature or route that imports this file.
- See **Imports** for direct module dependencies.

# Notes

- Landing-specific transparent/hero variant lives in `src/layouts/landing-layout/LandingHeaderThemeButton.tsx`.
- Keep in sync when `src/layouts/public-layout/PublicHeaderThemeButton.tsx` changes.
