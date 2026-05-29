# File Overview

Project source module.

**Source:** `src/layouts/public-layout/DesktopNav.tsx` (Client Component)

# Responsibilities

- Project source module.
- Render desktop nav links with standard public-layout styling.

# Imports

- `import { cn } from "@/src/lib/cn"`
- `import { useRouter } from "@/src/i18n/navigation"`

# Exports

- `DesktopNav`

# State Management

_No significant state; presentational or config module._

# API Usage

_N/A unless extended._

# Navigation

- Use **`Link`**, **`useRouter`**, **`redirect`** from `@/src/i18n/navigation` for locale-prefixed paths (e.g. `/en/listing`).

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

See source in `src/layouts/public-layout/DesktopNav.tsx` for step-by-step behavior aligned with [application.md](../../application.md) (path relative may vary).

# Dependencies

- Parent feature or route that imports this file.
- See **Imports** for direct module dependencies.

# Notes

- Landing-specific visual treatment now lives in `src/layouts/landing-layout/LandingDesktopNav.tsx`.
- Keep in sync when `src/layouts/public-layout/DesktopNav.tsx` changes.
