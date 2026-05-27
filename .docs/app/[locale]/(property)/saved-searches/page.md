# File Overview

Next.js App Router page for route segment `[locale]/saved-searches`. Thin wrapper that renders a feature screen.

**Source:** `app/[locale]/(property)/saved-searches/page.tsx`

# Responsibilities

- Next.js App Router page for route segment `[locale]/saved-searches`. Thin wrapper that renders a feature screen.

# Imports

- `import SavedSearchesScreen from "@/src/features/property/screens/SavedSearchesScreen"`

# Exports

- `SavedSearchesPage`
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

1. Next.js resolves locale-prefixed URL.
2. Layout chain provides i18n + `PublicLayout` where applicable.
3. Page default export renders the feature screen.
4. Next.js App Router page for route segment `[locale]/saved-searches`. Thin wrapper that renders a feature screen.

# Dependencies

- Parent feature or route that imports this file.
- See **Imports** for direct module dependencies.

# Notes

- Keep in sync when `app/[locale]/(property)/saved-searches/page.tsx` changes.
