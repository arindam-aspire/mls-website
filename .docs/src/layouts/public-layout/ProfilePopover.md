# File Overview

Project source module.

**Source:** `src/layouts/public-layout/ProfilePopover.tsx` (Client Component)

# Responsibilities

- Project source module.

# Imports

- `import { UpcomingFeatureModal } from "@/src/components/common/UpcomingFeatureModal"`
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

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `user` | `LoggedInUser` | required | Signed-in user for avatar and menu |
| `showNotificationsButton` | `boolean` | `true` | When `false`, hide bell (e.g. `ProtectedHeader` provides its own) |
| `overHero` | `boolean` | `false` | Landing hero: light text/icons on image; hero avatar border treatment |

# Actions / Inputs

## Inputs

_No explicit inputs detected._

## Actions

- Notifications bell → `NotificationsPopover` (with `overHero` on landing hero)
- Profile menu links → navigate and close popover (`filterProfileMenuItemsWithRoleAccess`; **My Recently Viewed** only for `registered_user` and `admin`/`agency`)
- Sign out → `ConfirmModal` then `useLogout`

## Show/Hide Controls

- `isUpcomingFeatureModalOpen` — notifications coming-soon modal
- `showLogoutConfirm` — logout confirmation modal

# UI Details

- **Theme:** semantic tokens (`bg-page`, `bg-surface`, `text-text`, `text-muted`, `bg-primary`, `border-secondary/15`).
- **Light/dark:** via `ThemeProvider` / `html.light` | `html.dark`.
- **Header strip:** matches `ProtectedProfileMenu` — `lg+` shows `full_name` + role (`resolveProfileRoleLabel`); `md` avatar only; vertical divider before profile at `lg+`.
- **Header avatar:** `size="md"`, `rounded-full !bg-page text-text`; trigger uses transparent `PopoverButton` + `ring-secondary/40` focus.
- **Popover header:** role subtitle when mapped; else email fallback.
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
