# File Overview

Project source module.

**Source:** `src/layouts/public-layout/ProfilePopover.tsx` (Client Component)

# Responsibilities

- Project source module.

# Imports

- `import { ConfirmModal } from "@/src/components/common/ConfirmModal"`
- `import { Avatar } from "@/src/components/ui/avatar"`
- `import { Button } from "@/src/components/ui/button"`
- `import { IconButton } from "@/src/components/ui/icon-button"`
- `import { Link as UiLink } from "@/src/components/ui/link"`
- `import { useLogout } from "@/src/features/auth/mutations/auth.mutation"`
- `import type { LoggedInUser } from "@/src/features/auth/types/auth.types"`
- `import { useRouter } from "@/src/i18n/navigation"`

# Exports

- `ProfilePopover`

# State Management

- **React** `useState`

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

- Close popover/menu
- Navigate and close popover/menu

## Validations

_No explicit validations detected._

## Show/Hide Controls

_No explicit show/hide controls detected._

# UI Details

- **Theme:** semantic tokens (`bg-page`, `bg-surface`, `text-text`, `text-muted`, `bg-primary`, `border-secondary/15`).
- **Light/dark:** via `ThemeProvider` / `html.light` | `html.dark`.
- **Radius:** `rounded-lg` controls; `rounded-xl` cards/modals/popovers; `rounded-full` avatars/pills.
- **Responsive:** mobile-first (`sm:`, `md:`, `lg:`).
- Uses **`Modal`** from UI kit (`rounded-xl`).

# Flow Description

See source in `src/layouts/public-layout/ProfilePopover.tsx` for step-by-step behavior aligned with [application.md](../../application.md) (path relative may vary).

# Dependencies

- Parent feature or route that imports this file.
- See **Imports** for direct module dependencies.

# Notes

- Landing-specific visual variants now live in `src/layouts/landing-layout/LandingProfilePopover.tsx`.
- Keep in sync when `src/layouts/public-layout/ProfilePopover.tsx` changes.
