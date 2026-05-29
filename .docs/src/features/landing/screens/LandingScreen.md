# File Overview

Route-level screen component composing feature UI.

**Source:** `src/features/landing/screens/LandingScreen.tsx` (Client Component)

# Responsibilities

- Route-level screen component composing feature UI.
- Fetch property taxonomy and mirror it into `usePropertyStore` for property feature reuse.

# Imports

- `import { DetailsSection } from "@/src/features/landing/components/DetailsSection"`
- `import { HeroSection } from "@/src/features/landing/components/HeroSection"`
- `import { useGetPropertyTaxonomy } from "../mutations/landing.mutation"`
- `import { useTheme } from "@/src/providers/ThemeProvider"`
- `import { usePropertyStore } from "@/src/features/property/store/property.store"`

# Exports

- `LandingScreen`

# State Management

- Reads taxonomy mutation state from React Query (`useGetPropertyTaxonomy`).
- Taxonomy persistence to Zustand happens inside the mutation hook `onSuccess`.
- Reads cached taxonomy from `usePropertyStore` to avoid duplicate API calls on revisit.

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

- On mount, trigger taxonomy mutation via `mutate()`.
- API call is skipped when `propertyTaxonomy` already exists in store.
- Mutation hook handles store persistence and error toast.

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

See source in `src/features/landing/screens/LandingScreen.tsx` for step-by-step behavior aligned with [application.md](../../application.md) (path relative may vary).

# Dependencies

- Parent feature or route that imports this file.
- See **Imports** for direct module dependencies.

# Notes

- Keep in sync when `src/features/landing/screens/LandingScreen.tsx` changes.
