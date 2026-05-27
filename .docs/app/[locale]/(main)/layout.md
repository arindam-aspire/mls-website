# File Overview

Next.js layout wrapping child routes with shared shell or i18n providers.

**Source:** `app/[locale]/(main)/layout.tsx`

# Responsibilities

- Next.js layout wrapping child routes with shared shell or i18n providers.

# Imports

- `import PublicLayout from "@/src/layouts/public-layout"`

# Exports

- `MainLayout`
- `default`

# State Management

_No significant state; presentational or config module._

# API Usage

_N/A unless extended._

# Navigation

- Renders under `app/[locale]/…`; public URLs always include locale prefix.

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

See source in `app/[locale]/(main)/layout.tsx` for step-by-step behavior aligned with [application.md](../../application.md) (path relative may vary).

# Dependencies

- Parent feature or route that imports this file.
- See **Imports** for direct module dependencies.

# Notes

- Keep in sync when `app/[locale]/(main)/layout.tsx` changes.
