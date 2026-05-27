# File Overview

Feature or shared UI component.

**Source:** `src/features/auth/components/ResetPasswordForm.tsx` (Client Component)

# Responsibilities

- Feature or shared UI component.

# Imports

- `import { Button, Input } from "@/src/components/ui"`
- `import { useForm } from "@/src/hooks/useForm"`
- `import { usePathname, useRouter } from "@/src/i18n/navigation"`
- `import { AUTH_VIEW, buildAuthModalUrl, type AuthView } from "../authViews"`

# Exports

- `ResetPasswordForm`
- `ResetPasswordFormValues`

# State Management

- **React** `useState`
- **`useForm`** hook

# API Usage

_N/A unless extended._

# Navigation

- Use **`Link`**, **`useRouter`**, **`redirect`** from `@/src/i18n/navigation` for locale-prefixed paths (e.g. `/en/listing`).
- Auth modal: query `?auth=<view>` on current pathname (see `authViews.ts`).

# Props / Parameters

- See component/handler props in source (TypeScript interfaces).

# Actions / Inputs

## Inputs

- `confirmPassword`
- `password`

## Actions

- Submit form

## Validations

- `confirmPassword`
  - Rules: `Required`
  - Message keys: `resetPasswordConfirmMismatch`, `resetPasswordConfirmRequired`
- `password`
  - Rules: `Required`
  - Message keys: `resetPasswordInvalid`, `resetPasswordNewRequired`

## Show/Hide Controls

_No explicit show/hide controls detected._

# UI Details

- **Theme:** semantic tokens (`bg-page`, `bg-surface`, `text-text`, `text-muted`, `bg-primary`, `border-secondary/15`).
- **Light/dark:** via `ThemeProvider` / `html.light` | `html.dark`.
- **Radius:** `rounded-lg` controls; `rounded-xl` cards/modals/popovers; `rounded-full` avatars/pills.
- **Responsive:** mobile-first (`sm:`, `md:`, `lg:`).
- Uses **`Modal`** from UI kit (`rounded-xl`).

# Flow Description

See source in `src/features/auth/components/ResetPasswordForm.tsx` for step-by-step behavior aligned with [application.md](../../application.md) (path relative may vary).

# Dependencies

- Parent feature or route that imports this file.
- See **Imports** for direct module dependencies.

# Notes

- Keep in sync when `src/features/auth/components/ResetPasswordForm.tsx` changes.
