# File Overview

Project source module.

**Source:** `src/layouts/public-layout/DesktopActions.tsx` (Client Component)

# Responsibilities

- Project source module.

# Imports

- `import { Button } from "@/src/components/ui/button"`
- `import { Select } from "@/src/components/ui/select"`
- `import { Skeleton } from "@/src/components/ui/skeleton"`
- `import { useAuthStore } from "@/src/features/auth/store/auth.store"`
- `import { AUTH_VIEW } from "@/src/features/auth/authViews"`
- `import { usePathname, useRouter } from "@/src/i18n/navigation"`
- `import type { AppLocale } from "@/src/i18n/routing"`
- `import { ProfilePopover } from "./ProfilePopover"`
- `import { PublicHeaderThemeButton } from "./PublicHeaderThemeButton"`

# Exports

- `DesktopActions`

# State Management

- **Zustand** `useAuthStore`

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

See source in `src/layouts/public-layout/DesktopActions.tsx` for step-by-step behavior aligned with [application.md](../../application.md) (path relative may vary).

# Dependencies

- Parent feature or route that imports this file.
- See **Imports** for direct module dependencies.

# Notes

- Keep in sync when `src/layouts/public-layout/DesktopActions.tsx` changes.
