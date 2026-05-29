# File Overview

Route-level property list screen that currently renders a placeholder card while triggering list fetch from URL query params.

**Source:** `src/features/property/screens/PropertyListScreen.tsx`

# Responsibilities

- Read `status` and `category` from URL search params.
- Trigger property list fetch through `useGetPropertyList`.
- Reuse cached property list from `usePropertyStore` when params are unchanged.
- Keep existing placeholder UI unchanged.

# Imports

- `import { ComingSoonCard } from "@/src/components/common/ComingSoonCard"`
- `import { useSearchParams } from "next/navigation"`
- `import { useGetPropertyList } from "../mutations/property.mutation"`

# Exports

- `PropertyListScreen`
- `default`

# State Management

- **React** `useEffect` for fetch lifecycle

# API Usage

- Fetches property list via `useGetPropertyList` (`mutationFn: getPropertyList` → `GET /properties`).
- Sends params directly from URL query with defaults (`status=buy`, empty `category`, page `1`, pageSize `10`).

# Navigation

- Reads search params from route URL (`status`, `category`) via `useSearchParams`.

# Props / Parameters

- See component/handler props in source (TypeScript interfaces).

# Actions / Inputs

## Inputs

_No explicit inputs detected._

## Actions

- On mount/URL change: build params from query and update `usePropertyStore` only when params differ.
- Trigger property list mutation only when cache is missing or params changed.

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

1. Screen reads `status` and `category` from URL query.
2. Builds `nextParams` and stores them in `usePropertyStore`.
3. If store already has listings for same params, skip API call.
4. Otherwise call `useGetPropertyList().mutate(nextParams)`.
5. Maps response items/pagination into store listings.
6. Keeps rendering `ComingSoonCard` placeholder UI.

# Dependencies

- Parent feature or route that imports this file.
- See **Imports** for direct module dependencies.

# Notes

- Mock list data now maps image selection from `sampleImages` by index (`images: [sampleImages[index % sampleImages.length]]`).
- Keep in sync when `src/features/property/screens/PropertyListScreen.tsx` changes.
