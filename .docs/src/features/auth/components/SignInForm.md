# File Overview

Feature or shared UI component.

**Source:** `src/features/auth/components/SignInForm.tsx` (Client Component)

# Responsibilities

- Feature or shared UI component.

# Imports

- `import { Button, Input, Link } from "@/src/components/ui"`
- `import { useForm } from "@/src/hooks/useForm"`
- `import { cn } from "@/src/lib/cn"`
- `import { usePathname, useRouter } from "@/src/i18n/navigation"`
- `import { AUTH_VIEW, buildAuthModalUrl, type AuthView } from "../authViews"`
- `import { SignInFormValues } from "../types/auth.types"`

# Exports

- `SignInForm`

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

- `password`
- `rememberMe`
- `username`

## Actions

- Open auth view: forgotPassword
- Open auth view: signInOtp
- Submit form
- Toggle password visibility
- Trigger sign-in callback

## Validations

- `password`
  - Rules: `Required`
  - Message keys: `signInPasswordRequired`
- `username`
  - Rules: `Required (non-empty)`
  - Message keys: `signInEmailOrPhoneRequired`

## Show/Hide Controls

- Password visibility toggles via `showPassword` state (eye icon controls input `type`).

# UI Details

- **Theme:** semantic tokens (`bg-page`, `bg-surface`, `text-text`, `text-muted`, `bg-primary`, `border-secondary/15`).
- **Light/dark:** via `ThemeProvider` / `html.light` | `html.dark`.
- **Radius:** `rounded-lg` controls; `rounded-xl` cards/modals/popovers; `rounded-full` avatars/pills.
- **Responsive:** mobile-first (`sm:`, `md:`, `lg:`).
- Uses **`Modal`** from UI kit (`rounded-xl`).

# Flow Description

See source in `src/features/auth/components/SignInForm.tsx` for step-by-step behavior aligned with [application.md](../../application.md) (path relative may vary).

# Dependencies

- Parent feature or route that imports this file.
- See **Imports** for direct module dependencies.

# Notes

- Keep in sync when `src/features/auth/components/SignInForm.tsx` changes.
