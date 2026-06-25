# File Overview

Project source module.

**Source:** `src/layouts/public-layout/DesktopActions.tsx` (Client Component)

# Responsibilities

- Project source module.
- Render desktop theme, fullscreen, locale, and auth/profile controls for non-landing public routes.

# Imports

- `import { Button } from "@/src/components/ui/button"`
- `import { HeaderFullscreenButton } from "@/src/layouts/shared/HeaderFullscreenButton"`
- `import { HeaderLanguageSelect } from "@/src/layouts/shared/HeaderLanguageSelect"`
- `import { buildHeaderLocaleOptions } from "@/src/layouts/shared/buildHeaderLocaleOptions"`
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

1. Renders theme toggle, fullscreen, `HeaderLanguageSelect` (flag + code trigger, full names in popover), then auth/profile.
2. Locale change: `router.replace(pathname, { locale })` via `buildHeaderLocaleOptions` labels.
3. Loading: skeleton row matching icon buttons + compact language placeholder (`w-14`).

# Dependencies

- [../shared/HeaderLanguageSelect.md](../shared/HeaderLanguageSelect.md)
- [../shared/buildHeaderLocaleOptions.md](../shared/buildHeaderLocaleOptions.md)
- [ProfilePopover.md](./ProfilePopover.md)

# Notes

- Landing-specific action styling and behavior now lives in `src/layouts/landing-layout/LandingDesktopActions.tsx`.
- Keep in sync when `src/layouts/public-layout/DesktopActions.tsx` changes.
